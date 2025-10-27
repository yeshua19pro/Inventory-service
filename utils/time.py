from datetime import datetime, timezone

def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat() # auxiliar for time right now in iso format

def utc_now():
    return datetime.now(timezone.utc) # auxiliar to talk with the database in date type format

def utc_return_time_cast(time_cast):
    return time_cast.isoformat()