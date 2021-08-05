const {Telegraf, Extra, Markup, Scenes, Stage, session, Context} = require('telegraf');
const {parseLeagueDetails, parseMyTeam, parseLeagueStandings, parseCurrentGameweekFixtures} = require('../services/parser');

const setManagerId = new Scenes.WizardScene("setmanagerid",
ctx => { 
    ctx.reply("Please key in your manager id.\n\nIf you are wondering how to get the manager id, the answer is simple. Just go to https://fantasy.premierleague.com, sign in with your account, go to ‘Pick Team’ then ‘View Gameweek history’. You can find your id in the URL, right before the ‘/history’.");
    return ctx.wizard.next();
},
ctx =>{
    const values = ctx.message.text.trim().split(/(\s+)/);
    const isValidFormat = values.length == 1;
    const isNum = !isValidFormat ? false :  /^\d+$/.test(values[0]);
    if (!isValidFormat || !isNum) {
        ctx.reply('Please provide a valid manager id. E.g. 123456');
        return ctx.wizard.selectStep(ctx.wizard.cursor);
    } else {
        ctx.session.managerId = ctx.message.text;
        ctx.reply(`Done! Your manager id is set as ${ctx.session.managerId}.`);  
        return ctx.scene.leave();
    }
});

const viewFixtures = new Scenes.WizardScene("fixtures",
ctx => { 
    parseCurrentGameweekFixtures().then(data => ctx.reply(data));
    return ctx.scene.leave();
});

const viewLeagueDetails = new Scenes.WizardScene("league",
ctx =>{
    const values = ctx.message.text.trim().split(/(\s+)/);
    const isValidFormat = values.length == 3;
    const isNum = !isValidFormat ? false : /^\d+$/.test(values[2]);

    if (!isValidFormat || !isNum) {
        ctx.reply("Please provide a valid league id. E.g. /league 123456")
    } else {
        const leagueId = values[2];
        parseLeagueDetails(leagueId).then(data => ctx.reply(data));
    }
    return ctx.scene.leave();
});

const viewMyStandings = new Scenes.WizardScene("standings",
ctx => { 
    if(ctx.session.managerId === undefined) {
        ctx.reply("Please key in your manager id.\n\nIf you are wondering how to get the manager id, the answer is simple. Just go to https://fantasy.premierleague.com, sign in with your account, go to ‘Pick Team’ then ‘View Gameweek history’. You can find your id in the URL, right before the ‘/history’.");
        return ctx.wizard.next();
    } else {
        parseLeagueStandings(ctx.session.managerId).then(data => ctx.reply(data));
        return ctx.scene.leave();
    }
},
ctx => {
    const values = ctx.message.text.trim().split(/(\s+)/);
    const isValidFormat = values.length == 1;
    const isNum = !isValidFormat ? false :  /^\d+$/.test(values[0]);
    if (!isValidFormat || !isNum) {
        ctx.reply('Please provide a valid manager id. E.g. 123456');
        return ctx.wizard.selectStep(ctx.wizard.cursor);
    } else {
        ctx.session.managerId = values[0];
        parseLeagueStandings(ctx.session.managerId).then(data => ctx.reply(data));
        return ctx.scene.leave();
    }
});

const viewMyTeam = new Scenes.WizardScene("myteam",
ctx => { 
    ctx.reply("Please key in your Fantasy Premier League login email:");
    return ctx.wizard.next();
},
ctx =>{
    ctx.wizard.state.login = ctx.message.text;
    ctx.reply(`Got it! Your login email is ${ctx.wizard.state.login}.\nIf your email is incorrect, please type 'back'. Else, please key in your password.`);
    return ctx.wizard.next();
},
ctx =>{
    if(ctx.message.text.toUpperCase() === 'BACK') {
        return ctx.scene.enter("myteam");
    }
    ctx.wizard.state.password = ctx.message.text;
    ctx.reply(`Got it! Your password is ${ctx.wizard.state.password}.\nIf your password is incorrect, please type 'back' to restart the login process. Else, please key in your managerid.
    \nYou might be wondering: how to get the manager id? The answer is simple. Just go to https://fantasy.premierleague.com, sign in with your account, go to ‘Pick Team’ 
    then ‘View Gameweek history’. You can find your id in the URL, right before the ‘/history’.`,{
        reply_markup: {
            inline_keyboard: [
                [{
                    text: "back",
                    callback_data: 'back'
                },
               ]
            ]
        }
    });
    return ctx.wizard.next();
},
ctx =>{ 
    ctx.wizard.state.managerid = ctx.message.text;
    ctx.reply(`Got it! Your managerid is ${ctx.wizard.state.managerid}.\n Please wait while I try to retrieve your team details.`);
    parseMyTeam(ctx.wizard.state.login, ctx.wizard.state.password, ctx.wizard.state.managerid).then(data => ctx.reply(data));
    return ctx.scene.leave();
},
);



const stage = new Scenes.Stage([viewLeagueDetails, viewMyTeam, setManagerId, viewMyStandings, viewFixtures]); 

module.exports = stage;