import os
import psycopg2
from psycopg2.extras import execute_values
import numpy as np

# Database connection settings
DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")
DB_NAME = os.getenv("POSTGRES_DB", "bharat_shield")
DB_USER = os.getenv("POSTGRES_USER", "postgres")
DB_PASS = os.getenv("POSTGRES_PASSWORD", "postgres")

def get_connection():
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASS
    )

def setup_vector_extension():
    """Ensure vector extension is created on PostgreSQL."""
    conn = get_connection()
    with conn.cursor() as cur:
        cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
        conn.commit()
    conn.close()
    print("✓ pgvector extension initialized.")

def search_similar_signals(query_embedding: list[float], limit: int = 5):
    """
    Search for signals using Cosine Distance (<-> operator in pgvector).
    Returns signals ordered by semantic similarity.
    """
    conn = get_connection()
    with conn.cursor() as cur:
        query = """
            SELECT id, source, raw_payload, detected_language, intent_classification,
                   1 - (embedding <=> %s::vector) AS similarity_score
            FROM tipline_signals
            WHERE embedding IS NOT NULL
            ORDER BY embedding <=> %s::vector ASC
            LIMIT %s;
        """
        cur.execute(query, (query_embedding, query_embedding, limit))
        results = cur.fetchall()
    conn.close()
    return results

if __name__ == "__main__":
    print("Testing PostgreSQL + pgvector connection...")
    try:
        setup_vector_extension()
    except Exception as e:
        print(f"Could not connect to PostgreSQL. Make sure Docker container is running!\nError: {e}")
