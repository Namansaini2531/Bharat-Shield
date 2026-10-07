from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class ContentItem(BaseModel):
    id: str
    platform: str  # twitter, telegram, whatsapp_tipline, news, etc.
    timestamp: str
    language: str  # en, hi, hi-Latn (Hinglish)
    text: str
    media_type: str = "text"
    ocr_text: Optional[str] = None
    media_url: Optional[str] = None
    submitter_hash: Optional[str] = None

class SignalDetail(BaseModel):
    name: str
    weight: float
    score: float
    description: str

class RiskAssessment(BaseModel):
    base_risk: float = Field(..., description="Score between 0 and 100")
    uncertainty_margin: float = Field(..., description="Margin +/-")
    risk_min: float
    risk_max: float
    confidence: str  # Low, Medium, High
    corroborating_signals_count: int
    signals: List[SignalDetail]
    human_review_required: bool

class EvidencePackage(BaseModel):
    evidence_id: str
    campaign_id: str
    created_at: str
    content_count: int
    sha256_hash: str
    audit_events: List[str]

class Campaign(BaseModel):
    id: str
    title: str
    status: str = "active"  # active, under_review, mitigated, archived
    primary_language: str
    languages_detected: List[str]
    platforms: List[str]
    post_count: int
    posts: List[ContentItem]
    risk_assessment: RiskAssessment
    evidence: Optional[EvidencePackage] = None
