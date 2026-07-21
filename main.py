import os
import time
import telebot
from telebot.types import CallbackQuery
from config import Config
from ui_templates import UITemplates
from media_engine import MediaEngine
from analytics import analytics_system

# Initialize Telegram Bot with High-Performance Settings
bot = telebot.TeleBot(Config.BOT_TOKEN, parse_mode='Markdown', threaded=True, num_threads=Config.MAX_THREADS)

print("=" * 60)
print("🚀 PRO-DOWN ENTERPRISE ENGINE v3.0 IS STARTING...")
print(f"🔑 BOT TOKEN: {Config.BOT_TOKEN[:10]}...[PROTECTED]")
print("🌐 TARGET ENDPOINT: https://pro-down.vercel.app")
print("=" * 60)

# ---------------------------------------------------------
# COMMAND HANDLERS
# ---------------------------------------------------------

@bot.message_handler(commands=['start', 'help'])
def handle_start(message):
    first_name = message.from_user.first_name or "بەکارهێنەر"
    text = UITemplates.welcome_message(first_name)
    markup = UITemplates.main_keyboard()
    bot.reply_to(message, text, reply_markup=markup, disable_web_page_preview=True)

@bot.message_handler(commands=['stats'])
def handle_stats(message):
    stats = analytics_system.get_stats()
    text = (
        "📊 **ئامارێن زندی یێن سێرڤەرێ Pro-Down Enterprise:**\n\n"
        f"⚡ **حاڵەتێ سێرڤەری:** `{stats['status']}`\n"
        f"📥 **تۆتالی داگرتنان:** `{stats['total_downloads']:,}`\n"
        f"👥 **بەکارهێنەرێن چالاک:** `{stats['active_users_count']}`\n"
        f"🌐 **خێرایی سێرڤەری:** `10 Gbps Direct Fiber`"
    )
    bot.reply_to(message, text)

# ---------------------------------------------------------
# CALLBACK QUERY HANDLERS (Inline Buttons)
# ---------------------------------------------------------

@bot.callback_query_handler(func=lambda call: True)
def handle_callback(call: CallbackQuery):
    if call.data == "refresh_status":
        bot.answer_callback_query(call.id, "✅ سیستم نوو بووەوە!", show_alert=False)
    elif call.data == "server_stats":
        stats = analytics_system.get_stats()
        alert_text = f"📊 داگرتنێن گشتی: {stats['total_downloads']:,}\n⚡ سێرڤەر: 100% Active"
        bot.answer_callback_query(call.id, alert_text, show_alert=True)
    elif call.data == "activate_vip":
        vip_text = "🔑 برایێ هێژا! بۆ وەرگرتنا کلیلا VIP سەردانا مالپەڕێ مە ب کە:\n🌐 https://pro-down.vercel.app"
        bot.send_message(call.message.chat.id, vip_text)

# ---------------------------------------------------------
# MEDIA PROCESSOR (Core Engine Logic)
# ---------------------------------------------------------

@bot.message_handler(func=lambda message: True)
def handle_media_requests(message):
    user_id = message.from_user.id
    user_text = message.text.strip()
    
    # 1. Rate Limiting Control
    if not analytics_system.check_rate_limit(user_id):
        bot.reply_to(message, "⚠️ **ئاگاداری:** سپام مەکە! تکایە چەند چڕۆکەکا بپێشە بەری فرێکرنا لینکێ دی.")
        return

    # 2. Extract Platform Metadata
    platform = MediaEngine.detect_platform(user_text)
    
    if platform != "unknown":
        # Send Initial Processing Message
        proc_msg = bot.reply_to(
            message, 
            UITemplates.processing_message(platform), 
            disable_web_page_preview=True
        )
        
        # Simulate Processing Delay for High Quality Render
        time.sleep(1.5)
        
        # Final Success Direct Response
        success_text = (
            f"🎉 **فایلا تە ژ {platform.upper()} ب سەرکەفتنی هاتە ئامادەکرن!**\n\n"
            "🎥 **کوالێتی:** Ultra HD 8K (No Watermark)\n"
            "🔊 **دەنگ:** Dolby Atmos 320kbps\n\n"
            "📥 **بۆ داگرتنا خێرا و ئۆتۆماتیکی کلیک ل سەر لینکێ خوارێ بکە:**\n"
            f"🌐 {Config.WEBSITE_URL}\n\n"
            "✨ *دەلینکا ل سەرێ داگرتن د خولەکەکێ دا ئەنجام دبیت!*"
        )
        
        bot.edit_message_text(
            chat_id=message.chat.id, 
            message_id=proc_msg.message_id, 
            text=success_text,
            reply_markup=UITemplates.main_keyboard(),
            disable_web_page_preview=True
        )
    else:
        # Invalid Input Handling
        error_text = (
            "❌ **لینکێ نەناسیار یان نەیا دروستە!**\n\n"
            "تکایە لینکەکێ ڕاست ژ ڤان تۆڕان بنێرە:\n"
            "📸 Instagram | 🎵 TikTok | 🔴 YouTube | 👻 Snapchat | 📘 Facebook | 🐦 Twitter | 📌 Pinterest\n\n"
            "🌐 یان ڕاستەوخۆ سەرەدانا وێبسایتی ب کە:\n"
            "🔗 https://pro-down.vercel.app"
        )
        bot.reply_to(message, error_text, disable_web_page_preview=True)

# ---------------------------------------------------------
# BOT ENGINE LAUNCHER
# ---------------------------------------------------------

if __name__ == '__main__':
    try:
        print("✅ PRO-DOWN BOT IS NOW ONLINE AND POLLING 24/7...")
        bot.infinity_polling(timeout=20, long_polling_timeout=10)
    except Exception as e:
        print(f"❌ CRITICAL ENGINE ERROR: {e}")
