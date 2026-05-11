"""Risk scoring + analytics aggregation."""
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any
from collections import defaultdict


# Apps considered "high risk" for doomscrolling
HIGH_RISK_APPS = {
    "instagram", "tiktok", "youtube", "facebook", "snapchat", "twitter", "reddit",
}

# How much an intent reduces risk
INTENT_MODIFIER = {
    "work": -35,
    "habit": +10,
    "social": -10,
    "other": 0,
    None: 0,
}


def compute_risk(
    app_id: str,
    intent: str | None = None,
    time_of_day: int | None = None,
    recent_minutes_today: float = 0.0,
) -> tuple[int, str]:
    """Return (risk_score 0-100, label)."""
    base = 30
    app_id = (app_id or "").lower()
    if app_id in HIGH_RISK_APPS:
        base += 35
    # Golden Hour (6-10 AM)
    if time_of_day is not None and 6 <= time_of_day <= 10:
        base += 20
    # Late-night doom (22-2)
    if time_of_day is not None and (time_of_day >= 22 or time_of_day <= 2):
        base += 15
    base += INTENT_MODIFIER.get(intent, 0)
    # cumulative usage today nudges risk up
    base += min(15, int(recent_minutes_today / 15))
    base = max(0, min(100, base))
    if base >= 70:
        label = "High"
    elif base >= 40:
        label = "Medium"
    else:
        label = "Low"
    return base, label


def aggregate_daily(
    events: List[Dict[str, Any]], target_date: datetime
) -> Dict[str, Any]:
    """Summarize a list of usage events for a given calendar date."""
    by_hour = defaultdict(float)
    by_category = defaultdict(float)

    for e in events:
        started = e["started_at"]
        if started.date() != target_date.date():
            continue
        by_hour[started.hour] += float(e["duration_min"])
        by_category[e.get("category", "other")] += float(e["duration_min"])

    total = sum(by_hour.values())
    peak_hour = max(by_hour, key=by_hour.get) if by_hour else 0
    peak_minutes = by_hour.get(peak_hour, 0.0)

    # 8-bucket hourly array (every 3 hours: 12am, 3am, 6am, 9am, 12pm, 3pm, 6pm, 9pm)
    bucket_labels = ["12 AM", "3 AM", "6 AM", "9 AM", "12 PM", "3 PM", "6 PM", "9 PM"]
    bucket_hours = [0, 3, 6, 9, 12, 15, 18, 21]
    hourly = []
    for label, h in zip(bucket_labels, bucket_hours):
        # sum 3-hour window
        window = sum(by_hour.get(h + i, 0.0) for i in range(3))
        hourly.append({
            "hour": label,
            "value": round(window, 1),
            "peak": h <= peak_hour < h + 3,
        })

    # Distribution
    palette = {
        "productive": "#22C55E",
        "social": "#3B82F6",
        "entertainment": "#EF4444",
        "other": "#9CA3AF",
    }
    distribution = []
    for label in ("productive", "social", "entertainment", "other"):
        mins = round(by_category.get(label, 0.0), 1)
        percent = round((mins / total) * 100, 1) if total else 0
        distribution.append({
            "label": label.capitalize(),
            "minutes": mins,
            "percent": percent,
            "color": palette[label],
        })

    # Risk: simple — % of social+entertainment time in golden hour
    golden_hour_minutes = sum(by_hour.get(h, 0.0) for h in (6, 7, 8, 9, 10))
    risk_score = min(100, int(((golden_hour_minutes + by_category.get("social", 0) * 0.5) / 60) * 100)) if total else 0
    if risk_score >= 70:
        risk_label = "High"
    elif risk_score >= 40:
        risk_label = "Medium"
    else:
        risk_label = "Low"

    return {
        "date": target_date.strftime("%Y-%m-%d"),
        "total_minutes": round(total, 1),
        "productive_minutes": round(by_category.get("productive", 0), 1),
        "social_minutes": round(by_category.get("social", 0), 1),
        "entertainment_minutes": round(by_category.get("entertainment", 0), 1),
        "other_minutes": round(by_category.get("other", 0), 1),
        "peak_hour": peak_hour,
        "peak_minutes": round(peak_minutes, 1),
        "risk_score": risk_score,
        "risk_label": risk_label,
        "hourly": hourly,
        "distribution": distribution,
    }


def aggregate_weekly(events: List[Dict[str, Any]], end_date: datetime) -> Dict[str, Any]:
    """Roll up the past 7 days."""
    days = []
    total = 0.0
    productive = 0.0
    distracted = 0.0
    for i in range(6, -1, -1):
        d = end_date - timedelta(days=i)
        daily = aggregate_daily(events, d)
        days.append(daily)
        total += daily["total_minutes"]
        productive += daily["productive_minutes"]
        distracted += daily["social_minutes"] + daily["entertainment_minutes"]
    avg_minutes = round(total / 7, 1) if days else 0
    return {
        "days": days,
        "total_minutes": round(total, 1),
        "average_daily_minutes": avg_minutes,
        "productive_minutes": round(productive, 1),
        "distracted_minutes": round(distracted, 1),
        "improvement": "Morning Focus",
    }
