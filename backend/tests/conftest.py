import os
import sys
import pytest
from fastapi.testclient import TestClient

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from backend.app.main import app

@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c
