const {getLeagueDetails, getTeamDetails, getFixtures} = require('./api_service');

const parseLeagueDetails = (id) => {
    return getLeagueDetails(id).then(data => {    
        let result = "\nPosition | Name | Total Points\n";
        result += "-----------------------------------------------\n"
        for (let i = 1; i <= data.length; i++) { 
            result += `${i.toString()}. ${data[i-1].player_name} - ${data[i-1].total}\n`;
        }
        return result;
    })
}



const parseCurrentGameweekFixtures = () => {
    return getTeamDetails().then(teams => {        
        return getFixtures().then(fixtures => {
            let gw = fixtures.filter(x => !x.finished && !x.finished_provisional)[0].event;
            let gwFixtures = `Gameweek ${gw} Fixtures:\n`;
            let firstFixture = Math.pow(10, gw - 1) - 1;

            for (let i = firstFixture; i < firstFixture + 10 ; i++) {
                let currFixture = fixtures[i];
                gwFixtures += teams[currFixture.team_h - 1].name + " vs " + teams[currFixture.team_a - 1].name + " - ";
                                
                if(currFixture.team_h_score == null || currFixture.team_a_score == null){
                    gwFixtures += new Date(fixtures[i].kickoff_time).toString().substring(0, 24) + "\n";
                } else {
                    gwFixtures += currFixture.team_h_score + ":" + currFixture.team_a_score + "\n";
                }
            }
            return gwFixtures;
        })    
    });  
}

module.exports = {parseCurrentGameweekFixtures, parseLeagueDetails};


