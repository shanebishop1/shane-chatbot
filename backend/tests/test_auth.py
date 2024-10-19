from freezegun import freeze_time
import pytest
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from src.auth.auth import (
    create_access_token,
    verify_jwt,
)


def test_verify_jwt(mocker):
    with freeze_time("2025-01-01"):
        token = create_access_token(1, "test@example.com")
        credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
        mocker.patch("src.auth.auth.security", return_value=credentials)
        email = verify_jwt(credentials)
        assert email == "test@example.com"


def test_verify_jwt_expired(mocker):
    with freeze_time("2025-01-01"):
        token = create_access_token(1, "test@example.com")
    with freeze_time("2025-01-01 00:31:00"):
        credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
        mocker.patch("src.auth.auth.security", return_value=credentials)
        with pytest.raises(HTTPException) as excinfo:
            verify_jwt(credentials)
        assert excinfo.value.status_code == 401
        assert excinfo.value.detail == "Token has expired"


def test_verify_jwt_invalid(mocker):
    token = "invalidtoken"
    credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
    mocker.patch("src.auth.auth.security", return_value=credentials)
    with pytest.raises(HTTPException) as excinfo:
        verify_jwt(credentials)
    assert excinfo.value.status_code == 403
    assert excinfo.value.detail == "Invalid token"
