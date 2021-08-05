const {getLeagueDetails, getTeamDetails, getFixtures, getPlayerDetails, getUserBasicInformation} = require('./api_service');
const {login} = require('./login_service');


const parseLeagueDetails = (id) => {
    return getLeagueDetails(id).then(data => {    
        let result = "\nPosition | Name | Total Points\n";
        result += "-----------------------------------------------\n"
        for (let i = 1; i <= data.length; i++) { 
            result += `${i.toString()}. ${data[i-1].player_name} - ${data[i-1].total}\n`;
        }
        return result;
    }).catch(err => `Unable to retrieve details for league id ${id}. Please try again.`);
}

const parseCurrentGameweekFixtures = () => {
    return Promise.all([getTeamDetails(), getFixtures()]).then(data => {
        const teams = data[0]; 
        const fixtures = data[1];
        const gameweekNo = fixtures.filter(fixture => !fixture.finished && !fixture.finished_provisional)[0].event;
        let result = `Gameweek ${gameweekNo} Fixtures: \n`;
        const firstFixture = 10 * (gameweekNo - 1);

        for (let i = firstFixture; i < firstFixture + 10; i++) {
            let current = fixtures[i];
            
            result += teams[current.team_h - 1].name + " vs " + teams[current.team_a - 1].name + " - ";
                                
            if (current.team_h_score == null || current.team_a_score == null) {
                result += new Date(fixtures[i].kickoff_time).toString().substring(0, 24) + "\n";
            } else {
                result += current.team_h_score + ":" + current.team_a_score + "\n";
            }
        }
        return result;
    }).catch(err => `Unable to retrieve fixtures for current gameweek. Please try again.`);
}


const parseMyTeam = (username, password, managerid) => {
    return Promise.all([login(username, password, managerid), getPlayerDetails()]).then(data => {
        const myTeam = data[0].picks;
        const players = data[1];
        let result = "Your current team: \n"

        for (let i = 0; i < myTeam.length; i++) {
            let playerId = myTeam[i].element;
            let player = players.filter(x => x.id == playerId)[0];
            result += (i + 1).toString() + ". " + player.first_name + " " + player.second_name;
            if (myTeam[i].is_captain) {
                result += " (captain)";
            } else if (myTeam[i].is_vice_captain) {
                result += " (vice captain)";
            }
            result += "\n";
        }
        return result;
    }).catch(err => 'Unable to retrieve your team. Please try again and ensure your credentials are correct.');
}

const parseLeagueStandings = (managerid) => {
    return getUserBasicInformation(managerid).then(data => {
        let details = `${data.name}\nCurrent gameweek points: ${data.summary_event_points}\nTotal points: ${data.summary_overall_points}\n\nOverall Standings:\n`;
        const leagues = data.leagues.classic;

        for(let i = 0; i < leagues.length; i++) {
            let currentLeague = leagues[i];
            const change = currentLeague.entry_rank - currentLeague.entry_last_rank;
            details += `${i + 1}. ${currentLeague.name} - league id: ${currentLeague.id} \nRank: ${currentLeague.entry_rank}`;
            details += change < 0 ? ` (↓${Math.abs(change)})\n` : ` (↑${change})\n`;
        }
        
        return details;
    }).catch(err => `Unable to retrieve league standings for manager id ${managerid}. If you have entered your manager id incorrectly, please use /edit to correct it.`);
}

//parseMyTeam('fuzyll10598@gmail.com', 'S9815467a28136', '2389247').then(res => console.log(res));
//parseUserDetails('2389247').then(data => console.log(data));
module.exports = {parseCurrentGameweekFixtures, parseLeagueDetails, parseMyTeam, parseLeagueStandings};


