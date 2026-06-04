import sys
import os

# Добавляем корень проекта (где лежит main.py) в путь поиска модулей
# __file__ = .../boardy-api/tests/test_health.py
# dirname(dirname(...)) = .../boardy-api/
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Теперь импорт сработает
from main import app
from fastapi.testclient import TestClient

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
