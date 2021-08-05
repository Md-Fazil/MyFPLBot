require('dotenv').config(); 

const token = process.env.TOKEN;
const {Telegraf, session} = require('telegraf');
const stage = require('./components/wizards');
const {welcome, help} = require('./components/messages');

const bot = new Telegraf(token);
bot.use(session());
bot.use(stage.middleware());

bot.command(['start'], ctx => {
    ctx.reply(welcome(ctx.from.first_name) + help);
})

bot.help((ctx) => {
    ctx.reply(help);
})

bot.command(['edit'], ctx => {
    ctx.scene.enter('setmanagerid');
})

bot.command(['fixtures'], ctx => {
    ctx.scene.enter('fixtures');
});

bot.command(['league'], ctx => {
    ctx.scene.enter('league');
})

bot.command(['standings'], ctx => {
    ctx.scene.enter('standings');
})

bot.command('myteam', ctx => {
    ctx.scene.enter('myteam');
})

bot.startPolling(); 


