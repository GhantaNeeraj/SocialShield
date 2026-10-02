import re

# Rule-based pattern sets for Social Engineering indicators
INDICATOR_PATTERNS = {
    "Urgency": [
        r"\b(urgent|urgently|immediately|in \d+ (minutes?|hours?)|within \d+ (minutes?|hours?)|right now|today|asap|final warning|expires today|action required now)\b"
    ],
    "Fear & Threat": [
        r"\b(account.*(suspended|locked|terminated|deleted|compromised|flagged)|frozen|legal action|law enforcement|shut off|permanently disabled|prosecution)\b"
    ],
    "Credential Harvesting": [
        r"\b(verify.*(password|credentials|account|identity)|reset.*credentials|enter.*password|login with|re-authenticate|security questions)\b"
    ],
    "OTP / 2FA Request": [
        r"\b(otp|\d{6}|verification code|2fa|share.*code|forward.*sms|secret pin)\b"
    ],
    "Financial & Sensitive Info": [
        r"\b(credit card|debit card|bank details|wire transfer|ssn|social security|seed phrase|pin number|customs fee|unpaid debt|gift card)\b"
    ],
    "Brand Impersonation": [
        r"\b(paypal|netflix|amazon|apple id|microsoft|office 365|dhl|usps|irs|bank of america|chase|wellsfargo|walmart|whatsapp|facebook)\b"
    ],
    "Suspicious Call-to-Action": [
        r"\b(click here|claim now|verify immediately|reply with|pay now|submit appeal|unblock your balance)\b"
    ]
}

def extract_nlp_features(text: str):
    """
    Extracts social engineering indicators and pattern matches from text.
    Returns:
        matches: list of dicts with category name, explanation, and boolean flag
        indicator_count: int
    """
    matches = []
    text_lower = text.lower()
    
    for category, patterns in INDICATOR_PATTERNS.items():
        detected = False
        matched_words = []
        for pattern in patterns:
            found = re.findall(pattern, text_lower, re.IGNORECASE)
            if found:
                detected = True
                # Format matched words neatly
                for match in found:
                    if isinstance(match, tuple):
                        matched_words.append(" ".join([m for m in match if m]))
                    else:
                        matched_words.append(match)
        
        matches.append({
            "category": category,
            "detected": detected,
            "evidence": list(set(matched_words)) if detected else []
        })
        
    indicator_count = sum(1 for m in matches if m["detected"])
    return matches, indicator_count
