import os
import telebot
import yt_dlp

TOKEN = '8918824536:AAHqEEL34NC-hQ-fNOwN84mvuz3uDy0E_VA'
bot = telebot.TeleBot(TOKEN)

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    welcome_text = (
        "🌟 **بەخێربهێی بۆ Pro-Down Downloader Bot!**\n\n"
        "لینکێ هەرمیدیا و ڤیدیۆیەکێ ژ (Instagram, TikTok, YouTube, Facebook...) فرێبکە "
        "دا ڕاستەوخۆ فایلا ڤیدیۆیێ بۆ تە بنێرم! 🚀"
    )
    bot.reply_to(message, welcome_text, parse_mode='Markdown')

@bot.message_handler(func=lambda message: True)
def download_and_send_video(message):
    url = message.text.strip()
    
    # Validating simple link format
    if not (url.startswith("http://") or url.startswith("https://")):
        bot.reply_to(message, "⚠️ تکایە لینکەکێ دروست بنێرە!")
        return

    status_msg = bot.reply_to(message, "⏳ **فایلا تە د ئامادەکرنێ دایە... تکایە بپێشە...**")
    
    file_path = f"video_{message.chat.id}.mp4"

    # Options for yt-dlp direct video download
    ydl_opts = {
        'format': 'best',
        'outtmpl': file_path,
        'quiet': True,
        'no_warnings': True,
    }

    try:
        # Download the media using yt-dlp
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

        # Send the downloaded video file to Telegram Chat
        with open(file_path, 'rb') as video:
            bot.send_video(
                message.chat.id, 
                video, 
                caption="🎉 **فایلا تە ب سەرکەفتنی هاتە داگرتن!**\n🌐 https://pro-down.vercel.app"
            )

        # Delete processing message & delete file from server
        bot.delete_message(message.chat.id, status_msg.message_id)
        if os.path.exists(file_path):
            os.remove(file_path)

    except Exception as e:
        bot.edit_message_text(
            f"❌ **ئاریشەیەک د داگرتنێ دا چێبوو!**\n\nدکرێت لینک تایبەت (Private) بێت یان مافێ پاراستنێ هەبێت.\nئاریشە: `{str(e)[:100]}`", 
            chat_id=message.chat.id, 
            message_id=status_msg.message_id
        )
        if os.path.exists(file_path):
            os.remove(file_path)

print("🚀 Direct Video Downloader Engine Active...")
bot.infinity_polling()
