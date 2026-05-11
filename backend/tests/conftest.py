"""Shared pytest fixtures for Gzen backend API tests."""
import os
import uuid
import pytest
import requests
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

BASE_URL = (os.environ.get("EXPO_PUBLIC_BACKEND_URL")
            or os.environ.get("EXPO_BACKEND_URL")
            or os.environ.get("FRONTEND_URL")
            or "https://gzen-valuegate.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

SEED_EMAIL = os.environ.get("ADMIN_EMAIL", "ansh@gzen.app")
SEED_PASSWORD = os.environ.get("ADMIN_PASSWORD", "gzen1234")


@pytest.fixture(scope="session")
def base_url():
    return BASE_URL


@pytest.fixture(scope="session")
def api_url():
    return API


@pytest.fixture()
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def seed_token():
    """Login as the seeded admin user once and reuse the token."""
    r = requests.post(f"{API}/auth/login",
                      json={"email": SEED_EMAIL, "password": SEED_PASSWORD},
                      timeout=15)
    if r.status_code != 200:
        pytest.skip(f"Cannot login as seeded user: {r.status_code} {r.text}")
    return r.json()["access_token"]


@pytest.fixture(scope="session")
def auth_headers(seed_token):
    return {"Authorization": f"Bearer {seed_token}", "Content-Type": "application/json"}


@pytest.fixture(scope="session")
def fresh_user():
    """Create a brand-new user for tests that need an isolated account."""
    email = f"TEST_{uuid.uuid4().hex[:10]}@example.com"
    password = "testpass123"
    r = requests.post(f"{API}/auth/signup",
                      json={"name": "Test User", "email": email, "password": password},
                      timeout=15)
    assert r.status_code == 200, f"signup failed: {r.status_code} {r.text}"
    body = r.json()
    return {
        "email": email,
        "password": password,
        "token": body["access_token"],
        "user": body["user"],
        "headers": {"Authorization": f"Bearer {body['access_token']}",
                    "Content-Type": "application/json"},
    }
