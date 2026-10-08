-- Enable pgvector extension for AI embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id VARCHAR(64) PRIMARY KEY,
    title TEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'active',
    category TEXT,
    primary_language VARCHAR(16),
    languages_detected TEXT[],
    platforms TEXT[],
    post_count INT DEFAULT 0,
    overall_threat_min INT,
    overall_threat_max INT,
    threat_score INT,
    confidence VARCHAR(32),
    coordination_score INT,
    ai_probability INT,
    cross_platform_sync INT,
    target TEXT,
    summary TEXT,
    authorized_actions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tipline Signals table with vector embedding column for semantic search
CREATE TABLE IF NOT EXISTS tipline_signals (
    id VARCHAR(64) PRIMARY KEY,
    source VARCHAR(32) NOT NULL,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    raw_payload TEXT NOT NULL,
    detected_language VARCHAR(32),
    confidence_score FLOAT,
    intent_classification VARCHAR(64),
    severity VARCHAR(32),
    normalized_translation TEXT,
    campaign_id VARCHAR(64) REFERENCES campaigns(id) ON DELETE SET NULL,
    embedding vector(384)
);

-- HNSW Vector Index for ultra-fast cosine similarity search across signals
CREATE INDEX IF NOT EXISTS tipline_signals_embedding_hnsw_idx 
ON tipline_signals 
USING hnsw (embedding vector_cosine_ops);

-- Audit Ledger table for tamper-proof evidence tracking
CREATE TABLE IF NOT EXISTS audit_ledger (
    id SERIAL PRIMARY KEY,
    package_id VARCHAR(64) NOT NULL,
    campaign_id VARCHAR(64),
    sha256_hash VARCHAR(128) NOT NULL,
    tx_hash VARCHAR(128),
    block_number BIGINT,
    contract_address VARCHAR(64),
    event_type VARCHAR(64) NOT NULL,
    details TEXT,
    analyst_id VARCHAR(64),
    role VARCHAR(64),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

