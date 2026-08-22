from app.core.config import settings


def test_default_settings_load():
    assert settings.app_name == "FinInsight API"
    assert settings.environment == "development"
    assert settings.pinecone_index_name == "fininsight"
