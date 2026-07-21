import os
import telebot

# Telegram Bot Token Directly Embedded
TOKEN = '8918824536:AAHqEEL34NC-hQ-fNOwN84mvuz3uDy0E_VA'
bot = telebot.TeleBot(TOKEN)

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    welcome_text = (
        "🌟 **بەخێربهێی بۆ Pro-Down Official Bot!**\n\n"
        "بۆ داگرتنا ڤیدیۆ، ستۆری و ڕێڵزان ب کوالێتیا Ultra HD 8K ب بێ وۆتەرمارک، "
        "سەرەدانا مالپەڕێ مە ب کەن:\n"
        "🌐 https://pro-down.vercel.app\n\n"
        "لینکێ ڤیدیۆیێ ل ڤێرێ بفرێزە دا بۆ تە داگرم!"
    )
    bot.reply_to(message, welcome_text, parse_mode='Markdown')

@bot.message_handler(func=lambda message: True)
def echo_all(message):
    bot.reply_to(
        message, 
        "⚙️ بووت یێ کار دکەت!\n\n"
        "بۆ داگرتنا ڤی فایلی ب کوالێتیا بەرز (8K) و ب بێ وۆتەرمارک، کەرەم بکە سەردانا وێبسایتی ب کە: \n"
        "🌐 https://pro-down.vercel.app"
    )

print("🚀 Pro-Down Bot Engine is Running Successfully on Railway...")
bot.infinity_polling()
