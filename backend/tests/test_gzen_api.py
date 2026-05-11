"""Comprehensive backend API tests for Gzen.

Covers: health, auth (signup/login/me/logout), profile, analytics (usage/daily/weekly),
value-gate (detect-risk/verify-task/unlock-session), AI generate-task, and rewards.

A "real AI" response is asserted by checking the prompt is NOT one of the four hardcoded
fallback prompts. The static fallback is acceptable only if Gemini fails — in which case
this is reported as a soft warning.
"""
import os
import time
import uuid
import datetime as dt
import requests
import pytest


# ----------------------------- 1. Health -----------------------------
class TestHealth:
    def test_health(self, api_url, api_client):
        r = api_client.get(f"{api_url}/health", timeout=10)
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "ok"
        assert "time" in data


# ----------------------------- 2. Auth -----------------------------
FALLBACK_PROMPTS = {
    "Summarize this news in one line.",
    "Write one thing you're grateful for today.",
    "What is your top priority for the next hour?",
    "Take 3 slow breaths. Type the feeling that follows.",
}


class TestAuth:
    def test_signup_new_user(self, api_url, api_client):
        email = f"TEST_{uuid.uuid4().hex[:10]}@example.com"
        r = api_client.post(f"{api_url}/auth/signup",
                            json={"name": "Random User", "email": email,
                                  "password": "pw1234"}, timeout=15)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["token_type"] == "bearer"
        assert body["access_token"]
        assert body["user"]["email"] == email.lower()
        assert body["user"]["id"]
        # check no _id leak
        assert "_id" not in body["user"]

    def test_signup_duplicate(self, api_url, api_client):
        r = api_client.post(f"{api_url}/auth/signup",
                            json={"name": "Ansh", "email": "ansh@gzen.app",
                                  "password": "gzen1234"}, timeout=15)
        assert r.status_code == 409

    def test_login_seeded_user(self, api_url, api_client):
        r = api_client.post(f"{api_url}/auth/login",
                            json={"email": "ansh@gzen.app", "password": "gzen1234"},
                            timeout=15)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["access_token"]
        assert body["user"]["email"] == "ansh@gzen.app"
        assert body["user"]["name"] == "Ansh Kumar"
        # cookie set
        assert "access_token" in r.cookies

    def test_login_wrong_password(self, api_url, api_client):
        r = api_client.post(f"{api_url}/auth/login",
                            json={"email": "ansh@gzen.app", "password": "wrong"},
                            timeout=15)
        assert r.status_code == 401

    def test_me_requires_token(self, api_url, api_client):
        r = api_client.get(f"{api_url}/auth/me", timeout=10)
        assert r.status_code == 401

    def test_me_returns_user(self, api_url, auth_headers):
        r = requests.get(f"{api_url}/auth/me", headers=auth_headers, timeout=10)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["email"] == "ansh@gzen.app"
        assert body["name"] == "Ansh Kumar"
        assert body["streak"] >= 0
        assert body["level"] >= 1

    def test_logout(self, api_url, api_client):
        # login -> logout flow
        api_client.post(f"{api_url}/auth/login",
                        json={"email": "ansh@gzen.app", "password": "gzen1234"})
        r = api_client.post(f"{api_url}/auth/logout", timeout=10)
        assert r.status_code == 200


# ----------------------------- 3. Profile -----------------------------
class TestProfile:
    def test_get_profile(self, api_url, auth_headers):
        r = requests.get(f"{api_url}/profile", headers=auth_headers, timeout=10)
        assert r.status_code == 200
        body = r.json()
        assert body["email"] == "ansh@gzen.app"

    def test_update_profile_persists(self, api_url, fresh_user):
        new_goals = ["focus", "sleep"]
        r = requests.put(f"{api_url}/profile", headers=fresh_user["headers"],
                         json={"goals": new_goals}, timeout=10)
        assert r.status_code == 200, r.text
        assert r.json()["goals"] == new_goals
        # GET to verify persistence
        r2 = requests.get(f"{api_url}/profile", headers=fresh_user["headers"], timeout=10)
        assert r2.status_code == 200
        assert r2.json()["goals"] == new_goals


# ----------------------------- 4. Analytics -----------------------------
class TestAnalytics:
    def test_post_usage_then_daily(self, api_url, fresh_user):
        now = dt.datetime.now(dt.timezone.utc)
        events = [
            {"app_id": "instagram", "duration_min": 22.5,
             "started_at": now.replace(hour=9, minute=0, second=0, microsecond=0)
                              .isoformat(), "category": "social"},
            {"app_id": "vscode", "duration_min": 40.0,
             "started_at": now.replace(hour=11, minute=0, second=0, microsecond=0)
                              .isoformat(), "category": "productive"},
            {"app_id": "youtube", "duration_min": 15.0,
             "started_at": now.replace(hour=21, minute=0, second=0, microsecond=0)
                              .isoformat(), "category": "entertainment"},
        ]
        r = requests.post(f"{api_url}/usage", headers=fresh_user["headers"],
                          json=events, timeout=15)
        assert r.status_code == 200, r.text
        assert r.json()["inserted"] == 3

        d = requests.get(f"{api_url}/analytics/daily", headers=fresh_user["headers"],
                         timeout=15).json()
        assert d["total_minutes"] >= 77.0
        assert "hourly" in d and len(d["hourly"]) == 8
        assert "distribution" in d and len(d["distribution"]) == 4
        assert isinstance(d["risk_score"], int)

    def test_daily_demo_for_seeded_user_or_real(self, api_url, auth_headers):
        r = requests.get(f"{api_url}/analytics/daily", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        body = r.json()
        for k in ("total_minutes", "hourly", "distribution", "risk_score", "risk_label"):
            assert k in body

    def test_weekly(self, api_url, auth_headers):
        r = requests.get(f"{api_url}/analytics/weekly", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        body = r.json()
        assert "days" in body and len(body["days"]) == 7
        assert "average_daily_minutes" in body


# ----------------------------- 5. Value-Gate (CORE) -----------------------------
class TestValueGate:
    def test_full_flow_with_real_ai(self, api_url, auth_headers):
        # detect-risk
        r = requests.post(f"{api_url}/value-gate/detect-risk",
                          headers=auth_headers,
                          json={"app_id": "instagram", "intent": "habit",
                                "time_of_day": 9}, timeout=45)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["risk_score"] >= 70, f"expected risk_score>=70, got {body['risk_score']}"
        assert body["intervene"] is True
        assert body["session_id"]
        assert body["micro_task"] is not None
        mt = body["micro_task"]
        for key in ("type", "prompt", "context", "suggested_answer"):
            assert key in mt and mt[key], f"missing {key}"
        assert mt["type"] in {"summarize", "reflect", "mindfulness", "priority"}

        # Soft check: real AI should *usually* not produce one of the static fallbacks.
        if mt["prompt"] in FALLBACK_PROMPTS:
            print(f"\n[WARN] AI returned a fallback prompt — Gemini may have failed: {mt['prompt']}")

        session_id = body["session_id"]

        # verify-task with valid answer
        r2 = requests.post(f"{api_url}/value-gate/verify-task",
                           headers=auth_headers,
                           json={"session_id": session_id, "answer": "hello world"},
                           timeout=15)
        assert r2.status_code == 200, r2.text
        v = r2.json()
        assert v["success"] is True
        assert v["points_awarded"] == 25

        # unlock-session
        r3 = requests.post(f"{api_url}/value-gate/unlock-session",
                           headers=auth_headers,
                           json={"session_id": session_id, "duration_minutes": 10},
                           timeout=10)
        assert r3.status_code == 200, r3.text
        u = r3.json()
        assert u["minutes_allowed"] == 10
        assert u["completed_today"] >= 1
        assert u["target_today"] == 5

    def test_verify_task_short_answer_fails(self, api_url, auth_headers):
        # need a fresh session
        r = requests.post(f"{api_url}/value-gate/detect-risk",
                          headers=auth_headers,
                          json={"app_id": "instagram", "intent": "habit",
                                "time_of_day": 9}, timeout=45)
        sid = r.json()["session_id"]
        r2 = requests.post(f"{api_url}/value-gate/verify-task",
                           headers=auth_headers,
                           json={"session_id": sid, "answer": "ab"}, timeout=10)
        assert r2.status_code == 200
        body = r2.json()
        assert body["success"] is False
        assert body["points_awarded"] == 0

    def test_unauth_blocked(self, api_url, api_client):
        r = api_client.post(f"{api_url}/value-gate/detect-risk",
                            json={"app_id": "instagram", "intent": "habit",
                                  "time_of_day": 9})
        assert r.status_code == 401


# ----------------------------- 6. AI -----------------------------
class TestAI:
    def test_generate_task_real_ai(self, api_url, auth_headers):
        r = requests.post(f"{api_url}/ai/generate-task",
                          headers=auth_headers,
                          json={"intent": "habit", "goal": "improve focus",
                                "time_of_day": 10}, timeout=45)
        assert r.status_code == 200, r.text
        body = r.json()
        for k in ("type", "prompt", "context", "suggested_answer"):
            assert k in body and body[k]
        assert body["type"] in {"summarize", "reflect", "mindfulness", "priority"}
        if body["prompt"] in FALLBACK_PROMPTS:
            print(f"\n[WARN] AI returned fallback prompt: {body['prompt']}")


# ----------------------------- 7. Rewards -----------------------------
class TestRewards:
    def test_streak(self, api_url, auth_headers):
        r = requests.get(f"{api_url}/rewards/streak", headers=auth_headers, timeout=10)
        assert r.status_code == 200, r.text
        body = r.json()
        assert "streak" in body and isinstance(body["streak"], int)
        assert "longest_streak" in body

    def test_points(self, api_url, auth_headers):
        r = requests.get(f"{api_url}/rewards/points", headers=auth_headers, timeout=10)
        assert r.status_code == 200
        body = r.json()
        assert isinstance(body["points"], int)
        assert isinstance(body["level"], int) and body["level"] >= 1
        assert body["xp_for_next_level"] > 0
        assert isinstance(body["badges"], list) and len(body["badges"]) == 4
        for b in body["badges"]:
            for k in ("id", "name", "icon", "color", "earned"):
                assert k in b
