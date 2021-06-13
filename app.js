require('dotenv').config(); //loads variables into process.env
const token = process.env.TOKEN;

const {Telegraf} = require('telegraf');
const bot = new Telegraf(token);

bot.command('start', ctx => {
    console.log(ctx.from);
    bot.telegram.sendMessage(ctx.chat.id, 'Hello there! Welcome to the Fantasy Premier League bot!', {});
})

bot.hears("location", (ctx) => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, 'Can we access your location?', requestLocationKeyboard);
})

bot.launch();
