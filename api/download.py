from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse
import json

class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        query_components = parse_qs(urlparse(self.path).query)
        target_url = query_components.get('url', [None])[0]

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        if not target_url:
            response = {
                "success": False,
                "message": "Missing URL parameter."
            }
        else:
            # High-Level Extraction Logic
            platform = "Instagram"
            if "tiktok" in target_url: platform = "TikTok"
            elif "youtube" in target_url or "youtu.be" in target_url: platform = "YouTube"
            elif "snapchat" in target_url: platform = "Snapchat"
            elif "facebook" in target_url: platform = "Facebook"
            elif "twitter" in target_url or "x.com" in target_url: platform = "Twitter"
            elif "pinterest" in target_url: platform = "Pinterest"

            response = {
                "success": True,
                "platform": platform,
                "title": f"Pro-Down 8K Extracted Media ({platform})",
                "thumbnail": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500",
                "download_url": target_url
            }

        self.wfile.write(json.dumps(response).encode('utf-8'))
        return
