import os
import json
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from nlp_detector import extract_nlp_features
from url_detector import extract_url_features
from risk_engine import calculate_combined_risk

app = FastAPI(title="SocialShield AI - ML Microservice", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for models
tfidf = None
nlp_model = None
url_model = None
metrics_data = {}

def load_models_if_needed():
    global tfidf, nlp_model, url_model, metrics_data
    if tfidf is None or nlp_model is None or url_model is None:
        if not os.path.exists("nlp_model.pkl") or not os.path.exists("url_model.pkl"):
            from train_models import train_and_evaluate
            train_and_evaluate()
            
        tfidf = joblib.load("tfidf.pkl")
        nlp_model = joblib.load("nlp_model.pkl")
        url_model = joblib.load("url_model.pkl")
        
        if os.path.exists("metrics.json"):
            with open("metrics.json", "r") as f:
                metrics_data = json.load(f)

@app.on_event("startup")
def startup_event():
    load_models_if_needed()

class AnalyzeRequest(BaseModel):
    message: Optional[str] = ""
    url: Optional[str] = ""

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "SocialShield AI ML Service"}

@app.get("/metrics")
def get_metrics():
    load_models_if_needed()
    return metrics_data

@app.post("/analyze")
def analyze(req: AnalyzeRequest):
    load_models_if_needed()
    
    msg_input = req.message.strip() if req.message else ""
    url_input = req.url.strip() if req.url else ""
    
    if not msg_input and not url_input:
        raise HTTPException(status_code=400, detail="Please provide either a message or a URL to analyze.")
        
    msg_risk = None
    nlp_indicators = []
    
    if msg_input:
        # 1. ML NLP Model Probability
        X_msg = tfidf.transform([msg_input])
        prob_phish = nlp_model.predict_proba(X_msg)[0][1]
        raw_msg_score = float(prob_phish * 100.0)
        
        # 2. Extract Rule-Based Indicators
        nlp_indicators, ind_count = extract_nlp_features(msg_input)
        
        # Adjust score if heavy rule matches occur
        rule_boost = ind_count * 8.0
        msg_risk = min(100.0, max(raw_msg_score, raw_msg_score + rule_boost if ind_count >= 2 else raw_msg_score))

    url_risk = None
    url_reasons = []
    url_stats = {}
    
    if url_input:
        # 1. Feature Extraction
        features, url_reasons, url_stats = extract_url_features(url_input)
        
        # 2. ML URL Model Probability
        prob_url_phish = url_model.predict_proba([features])[0][1]
        raw_url_score = float(prob_url_phish * 100.0)
        
        # Boost if brand impersonation or raw IP
        if url_stats.get("brand_impersonation") or url_stats.get("is_ip"):
            url_risk = min(100.0, max(raw_url_score, 88.0))
        else:
            url_risk = raw_url_score

    # 3. Risk Fusion Engine
    result = calculate_combined_risk(
        msg_risk=msg_risk,
        url_risk=url_risk,
        nlp_indicators=nlp_indicators,
        url_reasons=url_reasons
    )
    
    result["input"] = {
        "message": msg_input,
        "url": url_input
    }
    result["url_stats"] = url_stats
    
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
