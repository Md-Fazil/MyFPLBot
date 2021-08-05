const welcomeMessage = (username) => {return `Welcome to Fantasy Premier League Bot ${username}!\n\n`};

const help = 'Here are the following commands that this bot can perform:'
+ '\n/fixtures - View current gameweek fixtures and scores.'
+ "\n/standings - View your team's overall standings in leagues."
+ '\n/edit - Edit your manager id.'
+ '\n/league 120232 - View player rankings in league 120232.'
+ '\n/myteam - View your current gameweek FPL team.'
+ '\n/help - View all the commands this bot can perform.';

module.exports = {welcomeMessage, help};