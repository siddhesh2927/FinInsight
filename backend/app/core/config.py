from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "FinInsight API"
    environment: str = "development"

    database_url: str

    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: str

    pinecone_api_key: str = ""
    pinecone_index_name: str = "fininsight"

    openai_api_key: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()