def calculate_combined_risk(msg_risk: float = None, url_risk: float = None, nlp_indicators: list = None, url_reasons: list = None):
    """
    Fuses message risk score and URL risk score with cross-threat synergy bonus.
    Returns:
        overall_risk: int (0 to 100)
        risk_level: str ("LOW RISK", "MODERATE RISK", "HIGH RISK")
        explainable_summary: dict
        recommendations: list of str
    """
    if msg_risk is not None and url_risk is not None:
        # Both provided: weighted combination + synergy
        base_score = 0.45 * msg_risk + 0.55 * url_risk
        
        # Synergy bonus: High social engineering urgency + Phishing URL = lethal combination
        has_urgency_or_credentials = False
        if nlp_indicators:
            for ind in nlp_indicators:
                if ind.get("detected") and ind.get("category") in ["Urgency", "Credential Harvesting", "Fear & Threat", "OTP / 2FA Request"]:
                    has_urgency_or_credentials = True
                    break
                    
        has_url_threat = False
        if url_reasons and len(url_reasons) > 0:
            has_url_threat = True
            
        synergy_bonus = 0
        if has_urgency_or_credentials and has_url_threat:
            synergy_bonus = 12
            
        overall_risk = min(100.0, base_score + synergy_bonus)
    elif msg_risk is not None:
        overall_risk = msg_risk
    elif url_risk is not None:
        overall_risk = url_risk
    else:
        overall_risk = 0.0

    overall_risk = int(round(overall_risk))
    
    # Determine Risk Level
    if overall_risk >= 70:
        risk_level = "HIGH RISK"
        badge_color = "red"
    elif overall_risk >= 36:
        risk_level = "MODERATE RISK"
        badge_color = "amber"
    else:
        risk_level = "LOW RISK"
        badge_color = "emerald"

    # Gather detected message highlights
    msg_highlights = []
    if nlp_indicators:
        for ind in nlp_indicators:
            if ind.get("detected"):
                msg_highlights.append({
                    "category": ind["category"],
                    "evidence": ind["evidence"]
                })
                
    # Recommendations based on risk level and findings
    recommendations = []
    if overall_risk >= 70:
        recommendations.append("🚨 DO NOT click any links contained in this message.")
        recommendations.append("🔒 DO NOT provide passwords, OTPs, or financial information.")
        recommendations.append("🛡️ Report this message to your security team or mark it as spam.")
        recommendations.append("⚠️ If you already entered credentials, change your password immediately on the official website.")
    elif overall_risk >= 36:
        recommendations.append("⚠️ Proceed with caution. Verify the sender's identity through official channels.")
        recommendations.append("🔍 Hover over links to inspect the actual destination before clicking.")
        recommendations.append("❓ Do not trust urgent requests for account verification or payments.")
    else:
        recommendations.append("✅ No high-risk social engineering or phishing patterns detected.")
        recommendations.append("💡 Always stay vigilant when receiving unexpected communications.")

    return {
        "overall_risk": overall_risk,
        "risk_level": risk_level,
        "badge_color": badge_color,
        "msg_risk": int(round(msg_risk)) if msg_risk is not None else None,
        "url_risk": int(round(url_risk)) if url_risk is not None else None,
        "msg_highlights": msg_highlights,
        "url_reasons": url_reasons or [],
        "recommendations": recommendations
    }
