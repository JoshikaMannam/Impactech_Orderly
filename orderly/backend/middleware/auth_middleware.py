from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from dotenv import load_dotenv
import os

load_dotenv()

SECRET = os.getenv("JWT_SECRET", "secret")
ALGO   = os.getenv("JWT_ALGORITHM", "HS256")

bearer = HTTPBearer(auto_error=False)

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer)
):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(
            credentials.credentials, SECRET, algorithms=[ALGO]
        )
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# Since your users table has no role column,
# staff check is done via a hardcoded staff email list
# OR you can add a role column later. For now using token claim.
def require_staff(user=Depends(get_current_user)):
    if user.get("role") != "staff":
        raise HTTPException(status_code=403, detail="Staff access required")
    return user