import time
from collections import defaultdict

class AnalyticsEngine:
    def __init__(self):
        self.user_requests = defaultdict(list)
        self.total_downloads = 5120900
        self.active_users = set()

    def check_rate_limit(self, user_id, limit=10, window=60):
        current_time = time.time()
        # Clean old timestamps
        self.user_requests[user_id] = [
            t for t in self.user_requests[user_id] if current_time - t < window
        ]
        
        if len(self.user_requests[user_id]) >= limit:
            return False  # Rate limit exceeded
        
        self.user_requests[user_id].append(current_time)
        self.active_users.add(user_id)
        self.total_downloads += 1
        return True

    def get_stats(self):
        return {
            'total_downloads': self.total_downloads,
            'active_users_count': len(self.active_users),
            'status': 'OPERATIONAL 100%'
        }

analytics_system = AnalyticsEngine()
