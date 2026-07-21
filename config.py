import os

class Config:
    # Telegram Bot Authorization
    BOT_TOKEN = os.getenv('BOT_TOKEN', '8918824536:AAHqEEL34NC-hQ-fNOwN84mvuz3uDy0E_VA')
    
    # Platform Endpoint Configurations
    WEBSITE_URL = "https://pro-down.vercel.app"
    BOT_USERNAME = "@ProDownOfficial_Bot"
    
    # Supported Engines Registry
    SUPPORTED_DOMAINS = {
        'instagram': ['instagram.com', 'instagr.am'],
        'tiktok': ['tiktok.com', 'vm.tiktok.com'],
        'youtube': ['youtube.com', 'youtu.be'],
        'snapchat': ['snapchat.com'],
        'facebook': ['facebook.com', 'fb.watch', 'fb.com'],
        'twitter': ['twitter.com', 'x.com'],
        'pinterest': ['pinterest.com', 'pin.it'],
        'spotify': ['spotify.com']
    }
    
    # Engine Settings
    MAX_THREADS = 16
    REQUEST_TIMEOUT = 30
    RATE_LIMIT_PER_MIN = 20
    DEBUG_MODE = False
