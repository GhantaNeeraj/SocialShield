import re
import math
from urllib.parse import urlparse

TARGET_BRANDS = [
    "google", "paypal", "amazon", "apple", "microsoft", "netflix",
    "bankofamerica", "chase", "wellsfargo", "dhl", "usps", "instagram",
    "facebook", "binance", "metamask", "office365"
]

SUSPICIOUS_TLDS = [".xyz", ".info", ".top", ".site", ".online", ".cc", ".vip", ".biz", ".work", ".tk"]
SUSPICIOUS_KEYWORDS = ["login", "verify", "account", "update", "signin", "secure", "banking", "confirm", "security", "auth", "redeliver", "appeal"]

def calculate_shannon_entropy(text: str) -> float:
    """Calculates Shannon entropy of a string."""
    if not text:
        return 0.0
    prob = [float(text.count(c)) / len(text) for c in set(text)]
    return -sum([p * math.log2(p) for p in prob])

def levenshtein_distance(s1: str, s2: str) -> int:
    """Computes Levenshtein distance between two strings."""
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)
    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    return previous_row[-1]

def extract_url_features(url: str):
    """
    Extracts structural and semantic features from a URL for ML & explainability.
    Returns:
        feature_dict: numeric features for ML model
        reasons: explainable warning bullet points
    """
    if not url.startswith(("http://", "https://")):
        url = "http://" + url
        
    parsed = urlparse(url)
    domain = parsed.netloc.lower()
    path = parsed.path.lower()
    full_str = url.lower()

    url_len = len(full_str)
    domain_len = len(domain)
    num_dots = domain.count(".")
    num_hyphens = full_str.count("-")
    num_at = full_str.count("@")
    num_subdomains = max(0, num_dots - 1)
    
    # Check if IP address
    is_ip = 1 if re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$", domain) else 0
    
    # Entropy
    entropy = calculate_shannon_entropy(domain)
    
    # Check suspicious keywords
    keyword_matches = [kw for kw in SUSPICIOUS_KEYWORDS if kw in full_str]
    has_suspicious_kw = len(keyword_matches)
    
    # Check TLD
    has_suspicious_tld = 1 if any(domain.endswith(tld) for tld in SUSPICIOUS_TLDS) else 0
    
    # Brand Impersonation Check
    brand_impersonation = False
    impersonated_brand = None
    for brand in TARGET_BRANDS:
        # If brand is in subdomains or path or domain, but not the actual official root domain
        if brand in full_str:
            official_domains = [f"{brand}.com", f"{brand}.org", f"{brand}.net", f"www.{brand}.com"]
            if not any(domain == off or domain == f"www.{off}" for off in official_domains):
                brand_impersonation = True
                impersonated_brand = brand
                break
        else:
            # Check typo-squatting (e.g., paypa1, netflx)
            words_in_domain = re.split(r"[\.-]", domain)
            for word in words_in_domain:
                if len(word) >= 4 and levenshtein_distance(word, brand) == 1:
                    brand_impersonation = True
                    impersonated_brand = f"{brand} (typosquat '{word}')"
                    break
                    
    # Construct Explainable Reasons
    reasons = []
    if is_ip:
        reasons.append({"title": "IP-Based URL", "detail": "URL uses a raw IP address instead of a domain name."})
    if brand_impersonation:
        reasons.append({"title": "Brand Impersonation", "detail": f"Possible spoofing of targeted brand '{impersonated_brand}'."})
    if num_subdomains >= 2:
        reasons.append({"title": "Suspicious Subdomain Structure", "detail": f"Domain contains {num_subdomains} subdomains."})
    if num_hyphens >= 3:
        reasons.append({"title": "Excessive Hyphens", "detail": "High count of hyphens often used in phishing lures."})
    if keyword_matches:
        reasons.append({"title": "Login/Security Keywords", "detail": f"Found sensitive keywords: {', '.join(keyword_matches[:3])}."})
    if has_suspicious_tld:
        reasons.append({"title": "High-Risk TLD", "detail": "Domain uses a top-level domain frequently associated with spam."})
    if entropy > 4.2:
        reasons.append({"title": "High Domain Entropy", "detail": "Domain name appears algorithmically generated or randomized."})
    if url_len > 75:
        reasons.append({"title": "Abnormally Long URL", "detail": f"URL length ({url_len} characters) exceeds standard norms."})

    features = [
        url_len,
        domain_len,
        num_dots,
        num_hyphens,
        num_at,
        num_subdomains,
        is_ip,
        entropy,
        has_suspicious_kw,
        has_suspicious_tld,
        1 if brand_impersonation else 0
    ]
    
    return features, reasons, {
        "url_len": url_len,
        "subdomains": num_subdomains,
        "is_ip": bool(is_ip),
        "entropy": round(entropy, 2),
        "brand_impersonation": impersonated_brand if brand_impersonation else None
    }
