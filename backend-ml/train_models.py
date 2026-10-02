import json
import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

from dataset import TEXT_DATASET, URL_DATASET
from url_detector import extract_url_features

def train_and_evaluate():
    print("=== SocialShield AI Model Training ===")
    
    # 1. Train NLP Model for Social Engineering Messages
    print("\n[1/3] Training Social Engineering NLP Classifier...")
    texts = [item[0] for item in TEXT_DATASET]
    text_labels = [item[1] for item in TEXT_DATASET]
    
    tfidf = TfidfVectorizer(max_features=500, ngram_range=(1, 2), stop_words='english')
    X_text = tfidf.fit_transform(texts)
    y_text = np.array(text_labels)
    
    nlp_model = LogisticRegression(C=2.0, max_iter=200, random_state=42)
    nlp_model.fit(X_text, y_text)
    
    nlp_preds = nlp_model.predict(X_text)
    nlp_acc = accuracy_score(y_text, nlp_preds)
    nlp_prec = precision_score(y_text, nlp_preds, zero_division=0)
    nlp_rec = recall_score(y_text, nlp_preds, zero_division=0)
    nlp_f1 = f1_score(y_text, nlp_preds, zero_division=0)
    nlp_cm = confusion_matrix(y_text, nlp_preds).tolist()
    
    print(f"  - Accuracy:  {nlp_acc:.4f}")
    print(f"  - Precision: {nlp_prec:.4f}")
    print(f"  - Recall:    {nlp_rec:.4f}")
    print(f"  - F1-Score:  {nlp_f1:.4f}")
    print(f"  - Confusion Matrix: {nlp_cm}")
    
    # 2. Train URL ML Classifier
    print("\n[2/3] Training Phishing URL Feature Classifier...")
    urls = [item[0] for item in URL_DATASET]
    url_labels = [item[1] for item in URL_DATASET]
    
    X_url = []
    for u in urls:
        features, _, _ = extract_url_features(u)
        X_url.append(features)
    X_url = np.array(X_url)
    y_url = np.array(url_labels)
    
    url_model = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
    url_model.fit(X_url, y_url)
    
    url_preds = url_model.predict(X_url)
    url_acc = accuracy_score(y_url, url_preds)
    url_prec = precision_score(y_url, url_preds, zero_division=0)
    url_rec = recall_score(y_url, url_preds, zero_division=0)
    url_f1 = f1_score(y_url, url_preds, zero_division=0)
    url_cm = confusion_matrix(y_url, url_preds).tolist()
    
    print(f"  - Accuracy:  {url_acc:.4f}")
    print(f"  - Precision: {url_prec:.4f}")
    print(f"  - Recall:    {url_rec:.4f}")
    print(f"  - F1-Score:  {url_f1:.4f}")
    print(f"  - Confusion Matrix: {url_cm}")
    
    # 3. Save Serialized Artifacts
    print("\n[3/3] Saving Model Artifacts & Metrics JSON...")
    joblib.dump(tfidf, "tfidf.pkl")
    joblib.dump(nlp_model, "nlp_model.pkl")
    joblib.dump(url_model, "url_model.pkl")
    
    metrics = {
        "nlp_model": {
            "name": "Logistic Regression + TF-IDF (N-grams 1-2)",
            "accuracy": round(float(nlp_acc), 4),
            "precision": round(float(nlp_prec), 4),
            "recall": round(float(nlp_rec), 4),
            "f1_score": round(float(nlp_f1), 4),
            "confusion_matrix": nlp_cm,
            "sample_count": len(TEXT_DATASET)
        },
        "url_model": {
            "name": "Random Forest Classifier (11 Features)",
            "accuracy": round(float(url_acc), 4),
            "precision": round(float(url_prec), 4),
            "recall": round(float(url_rec), 4),
            "f1_score": round(float(url_f1), 4),
            "confusion_matrix": url_cm,
            "sample_count": len(URL_DATASET)
        }
    }
    
    with open("metrics.json", "w") as f:
        json.dump(metrics, f, indent=2)
        
    print("[SUCCESS] All ML models trained and saved successfully!")

if __name__ == "__main__":
    train_and_evaluate()
