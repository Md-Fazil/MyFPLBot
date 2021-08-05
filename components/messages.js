const welcome = (username) => {return `Welcome to Fantasy Premier League Bot ${username}!\n\n`};

const help = "Here are the following commands that this bot can perform:"
+ "\n/fixtures - View current gameweek fixtures and scores."
+ "\n/standings - View your team's overall standings in leagues."
+ "\n/edit - Edit your manager id."
+ "\n/league 120232 - View player rankings in league 120232."
+ "\n/myteam - View your current gameweek FPL team."
+ "\n/help - View all the commands this bot can perform.";

const setManagerId = "Please key in your manager id.\n\n"
+ "If you are wondering how to get the manager id, the answer is simple." 
+ "Just go to https://fantasy.premierleague.com, sign in with your account, "
+ "go to ‘Pick Team’ then ‘View Gameweek history’. You can find your id in the URL, right before the ‘/history’.";

const invalidManagerId = "Please provide a valid manager id. E.g. 123456";

const invalidLeagueId = "Please provide a valid league id. E.g. /league 123456";

module.exports = {welcome, helpMessage, setManagerId, invalidManagerId, invalidLeagueId};