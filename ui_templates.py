from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton

class UITemplates:
    
    @staticmethod
    def welcome_message(first_name):
        return (
            f"⚡ **سڵاڤ {first_name}! بەخێربهێی بۆ ئیمپراتۆریەتا Pro-Down Matrix!**\n\n"
            "🌀 **Pro-Down v3.0 Enterprise Engine** خێراترین و بڵندترین ئاستێ "
            "داگرتنا میدیایانە د جیهانێ دا ب کوالێتیا **Ultra HD 8K + Dolby Atmos**.\n\n"
            "🌐 **تۆڕێن پشتیڤانیکری (7+ Platforms):**\n"
            "├ 📸 **Instagram:** Reels, Stories, Posts, IGTV\n"
            "├ 🎵 **TikTok:** No Watermark, HD Audio, Slideshows\n"
            "├ 🔴 **YouTube:** 8K Videos, Playlists, Shorts, MP3 320k\n"
            "├ 👻 **Snapchat:** Spotlight, Public Stories\n"
            "├ 📘 **Facebook:** HD Videos, Watch, Reels\n"
            "├ 🐦 **Twitter (X):** Video HD, GIFs\n"
            "└ 📌 **Pinterest:** Videos & High-Res Pins\n\n"
            "✨ **سەرەدانا مالپەڕێ سەرەکی ب کەن بۆ تایبەتمەندیێن AI Studio:**\n"
            "🔗 https://pro-down.vercel.app\n\n"
            "👇 *لینکێ خۆ ل خوارێ بنێرە دا ڕاستەوخۆ دەست ب پرۆسێسکرنێ بکەت!*"
        )

    @staticmethod
    def processing_message(platform_name):
        return (
            f"⚙️ **[PRO-ENGINE] پرۆسێسکرنا ئاستبەرز دەستپێکر...**\n\n"
            f"🎯 **تۆڕ:** `{platform_name.upper()}`\n"
            "📡 **کوالێتی:** `8K Ultra HD (Auto-Optimized)`\n"
            "🛡️ **واتەرمارک:** `بۆتە سڕین (Removed)`\n\n"
            "⏳ *تکایە چەند چڕۆکەک بپێشە، کۆدێ پایتۆن یێ ڕاستەوخۆ کار دکەت...*"
        )

    @staticmethod
    def main_keyboard():
        markup = InlineKeyboardMarkup()
        markup.row_width = 2
        
        btn_web = InlineKeyboardButton("🌐 مالپەڕێ سەرەکی (8K)", url="https://pro-down.vercel.app")
        btn_bot = InlineKeyboardButton("⚡ نۆژەنکرنەوە (Refresh)", callback_data="refresh_status")
        btn_stats = InlineKeyboardButton("📊 ئامارا سێرڤەری", callback_data="server_stats")
        btn_vip = InlineKeyboardButton("🔑 ئەکتیڤکرنا VIP", callback_data="activate_vip")
        
        markup.add(btn_web, btn_bot)
        markup.add(btn_stats, btn_vip)
        return markup
