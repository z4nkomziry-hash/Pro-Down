import os
import telebot
import yt_dlp

TOKEN = '8918824536:AAHqEEL34NC-hQ-fNOwN84mvuz3uDy0E_VA'
bot = telebot.TeleBot(TOKEN)

WEBSITE_URL = "https://pro-down.vercel.app"

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    welcome_text = (
        f"🌟 **بەخێربهێی بۆ Pro-Down Downloader Bot!**\n\n"
        f"لینکێ هەرمیدیا و ڤیدیۆیەکێ ژ (Instagram, TikTok, YouTube, Facebook, Snapchat, Pinterest, Telegram) فرێبکە!\n\n"
        f"🌐 سەرەدانا وێبسایتێ مە ب کە: {WEBSITE_URL}"
    )
    bot.reply_to(message, welcome_text, parse_mode='Markdown')

@bot.message_handler(func=lambda message: True)
def process_video(message):
    url = message.text.strip()
    if not (url.startswith("http://") or url.startswith("https://")):
        bot.reply_to(message, "⚠️ تکایە لینکەکێ دروست بنێرە!")
        return

    status_msg = bot.reply_to(message, "⏳ **فایلا تە د ئامادەکرنێ دایە... تکایە بپێشە...**")
    file_path = f"video_{message.chat.id}.mp4"

    ydl_opts = {
        'format': 'best',
        'outtmpl': file_path,
        'quiet': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

        with open(file_path, 'rb') as video:
            bot.send_video(
                message.chat.id, 
                video, 
                caption=f"🎉 **فایلا تە ب سەرکەفتنی هاتە داگرتن!**\n🌐 {WEBSITE_URL}"
            )

        bot.delete_message(message.chat.id, status_msg.message_id)
        if os.path.exists(file_path):
            os.remove(file_path)

    except Exception as e:
        bot.edit_message_text(f"❌ ئاریشەیەک چێبوو: {str(e)[:100]}", message.chat.id, status_msg.message_id)
        if os.path.exists(file_path):
            os.remove(file_path)

bot.infinity_polling()
