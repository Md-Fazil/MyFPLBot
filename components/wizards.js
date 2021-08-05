const {Scenes} = require('telegraf');
const {isValidLeagueId, isValidManagerId, parseLeagueId, parseLeagueDetails, parseMyTeam, parseLeagueStandings, parseCurrentGameweekFixtures} = require('../services/parser');
const {setManagerId, invalidManagerId, invalidLeagueId} = require('../components/messages');

const setManagerId = new Scenes.WizardScene("setmanagerid",
ctx => { 
    ctx.reply(setManagerId);
    return ctx.wizard.next();
},
ctx =>{
    const message = ctx.message.text;
    if (!isValidManagerId(message)) {
        ctx.reply(invalidManagerId);
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
    const message = ctx.message.text;
    if (!isValidLeagueId(message)) {
        ctx.reply(invalidLeagueId);
    } else {
        const leagueId = parseLeagueId(message);
        parseLeagueDetails(leagueId).then(data => ctx.reply(data));
    }
    return ctx.scene.leave();
});

const viewMyStandings = new Scenes.WizardScene("standings",
ctx => { 
    if(ctx.session.managerId === undefined) {
        ctx.reply(setManagerIdMessage);
        return ctx.wizard.next();
    } else {
        parseLeagueStandings(ctx.session.managerId).then(data => ctx.reply(data));
        return ctx.scene.leave();
    }
},
ctx => {
    const message = ctx.message.text;
    if (!isValidManagerId(message)) {
        ctx.reply(invalidManagerId);
        return ctx.wizard.selectStep(ctx.wizard.cursor);
    } else {
        ctx.session.managerId = message;
        parseLeagueStandings(ctx.session.managerId).then(data => ctx.reply(data));
        return ctx.scene.leave();
    }
});

const viewMyTeam = new Scenes.WizardScene("myteam",
ctx => { 
    ctx.reply("Please key in your Fantasy Premier League login email.");
    return ctx.wizard.next();
},
ctx =>{
    ctx.wizard.state.login = ctx.message.text;
    ctx.reply(`Got it! Your login email is ${ctx.wizard.state.login}.\n Please key in your password.`);
    return ctx.wizard.next();
},
ctx =>{
    ctx.wizard.state.password = ctx.message.text;
    ctx.reply(`Got it! Your password is ${ctx.wizard.state.password}. ` + setManagerId);
    return ctx.wizard.next();
},
ctx =>{ 
    ctx.wizard.state.managerid = ctx.message.text;
    ctx.reply(`Got it! Your manager id is ${ctx.wizard.state.managerid}.\nPlease wait...`);
    parseMyTeam(ctx.wizard.state.login, ctx.wizard.state.password, ctx.wizard.state.managerid).then(data => ctx.reply(data));
    return ctx.scene.leave();
},
);

const stage = new Scenes.Stage([viewLeagueDetails, viewMyTeam, setManagerId, viewMyStandings, viewFixtures]); 

module.exports = stage;