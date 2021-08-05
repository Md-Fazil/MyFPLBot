const axios = require('axios');
const header = {headers: {'user-agent':'not axios'}};

const getLeagueDetails = (id) => {
    return axios.get(`https://fantasy.premierleague.com/api/leagues-classic/${id}/standings/`, header);
}

const getFixtures = () => {
    return axios.get(`https://fantasy.premierleague.com/api/fixtures/`, header).then(response => response.data);
}

const getGeneralDetails = () => {
    return axios.get('https://fantasy.premierleague.com/api/bootstrap-static/', header).then(response => response.data);
}

const getTeamDetails = () => {
    return getGeneralDetails().then(response => response.teams);
}

const getPlayerDetails = () => {
    return getGeneralDetails().then(response => response.elements);
}

//requires authenthication
const getManagerDetails = (managerid) => {
    return axios.get(`https://fantasy.premierleague.com/api/entry/${managerid}/history/`, header);
}

const getUserBasicInformation = (managerid) => {
    return axios.get(`https://fantasy.premierleague.com/api/entry/${managerid}/`, header).then(response => response.data);
}
//getUserBasicInformation('2389247').then(x => console.log(x.leagues.classic));

module.exports = {getLeagueDetails, getFixtures, getTeamDetails, getPlayerDetails, getManagerDetails, getUserBasicInformation};



