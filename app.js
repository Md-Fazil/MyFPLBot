require('dotenv').config(); //loads variables into process.env

const token = process.env.TOKEN;
const {Telegraf, Extra, Markup, Scenes, Stage, session} = require('telegraf');
const {parseLeagueDetails, parseCurrentGameweekFixtures, parseMyTeam} = require('./services/parser');
const bot = new Telegraf(token);
bot.use(session());

bot.command(['start', 'text'], ctx => {
    let welcomeMessage = `Welcome to the Fantasy Premier League bot ${ctx.from.first_name}!`;
    let helpMessage = "How can I help?";
    let result = ctx.message.text == '/start' ? welcomeMessage + ' ' + helpMessage: helpMessage;
    bot.telegram.sendMessage(ctx.chat.id, result, {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: "View My Team",
                    callback_data: 'myteam'
                },
                {
                    text: "View League Standings",
                    callback_data: 'myleague'
                },{
                    text: "Gameweek Fixtures",
                    callback_data: "fixtures"
                }]
            ]
        }
    });
})

bot.help((ctx) => {
    ctx.reply("This bot can perform the following commands\n - /start\n - /help")
})

bot.action('fixtures', ctx => {
    parseCurrentGameweekFixtures().then(res => ctx.reply(res));
});



const viewLeagueDetails = new Scenes.WizardScene("myleague",
ctx => { 
    ctx.reply("Please key in your league id.");
    return ctx.wizard.next();
},
ctx =>{
    ctx.wizard.state.leagueid = ctx.message.text;
    
    //ctx.session.leagueid = ctx.message.text;

    ctx.reply(`Got it! Your league id is ${ctx.wizard.state.leagueid}.`);
    parseLeagueDetails(ctx.wizard.state.leagueid).then(data => ctx.reply(data));
    
    return ctx.scene.leave();
});

const viewMyTeam = new Scenes.WizardScene("myteam",
ctx => { 
    ctx.reply("Please key in your login email.");
    return ctx.wizard.next();
},
ctx =>{
    ctx.wizard.state.login = ctx.message.text;
    ctx.reply(`Got it! Your email is ${ctx.wizard.state.login}.\n Next, please key in your password.`);
    return ctx.wizard.next();
},
ctx =>{
    ctx.wizard.state.password = ctx.message.text;
    ctx.reply(`Got it! Your password is ${ctx.wizard.state.password}.\n Finally, please key in your managerid.`);
    return ctx.wizard.next();
},
ctx =>{
    ctx.wizard.state.managerid = ctx.message.text;
    ctx.reply(`Got it! Your managerid is ${ctx.wizard.state.manager}.\n Please wait while I retrieve your team details.`);
    parseMyTeam(ctx.wizard.state.login, ctx.wizard.state.password, ctx.wizard.state.managerid).then(data => ctx.reply(data));
    return ctx.scene.leave();
},
);



const stage = new Scenes.Stage([viewLeagueDetails, viewMyTeam]);
bot.use(stage.middleware());
bot.action('myteam', ctx => {
    ctx.scene.enter('myteam');
})
//{ default: "myleague" }



bot.startPolling(); // Start polling bot from you computer


