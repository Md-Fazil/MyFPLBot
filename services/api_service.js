const axios = require('axios');
const header = {headers: {'user-agent':'not axios'}};

const getLeagueDetails = (id) => {
    return axios.get(`https://fantasy.premierleague.com/api/leagues-classic/${id}/standings/`, header);
}

const getFixtures = () => {
    return axios.get(`https://fantasy.premierleague.com/api/fixtures/`, header).then(response => { return response.data});
}

const getGeneralDetails = () => {
    return axios.get('https://fantasy.premierleague.com/api/bootstrap-static/', header).then(response => {return response.data});
}

const getTeamDetails = () => {
    return getGeneralDetails().then(response => {return response.teams});
}

const getPlayerDetails = (id) => {
    return axios.get(`https://fantasy.premierleague.com/api/element-summary/{element_id}/`, header).then(response => { return response.data});
}

const getManagerDetails = (managerid) => {
    return axios.get(`https://fantasy.premierleague.com/api/entry/${managerid}/history/`, header);
}

module.exports = {getLeagueDetails, getFixtures, getTeamDetails, getPlayerDetails, getManagerDetails};



