import re
from config import Config

class MediaEngine:
    
    @staticmethod
    def detect_platform(url: str) -> str:
        """
        Detects the social media platform based on domain patterns.
        """
        url_lower = url.lower()
        for platform, domains in Config.SUPPORTED_DOMAINS.items():
            for domain in domains:
                if domain in url_lower:
                    return platform
        return "unknown"

    @staticmethod
    def extract_media_metadata(url: str):
        """
        Simulates deep metadata extraction for production scale.
        """
        platform = MediaEngine.detect_platform(url)
        if platform == "unknown":
            return {"success": False, "error": "Invalid or Unsupported URL"}
        
        return {
            "success": True,
            "platform": platform,
            "url": url,
            "suggested_quality": "8K Ultra HD",
            "has_audio": True,
            "watermark_removed": True,
            "direct_download_link": f"{Config.WEBSITE_URL}?direct_url={url}"
        }
