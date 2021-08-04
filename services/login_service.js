const request = require('superagent');
const agent = request.agent();

const login = (username, password, managerid) => {
    return agent.post('https://users.premierleague.com/accounts/login/').type('form')
                .send({login: username})
                .send({password: password})
                .send({redirect_uri: 'https://fantasy.premierleague.com/'})
                .send({app: 'plfpl-web'})
                .then(() =>{return agent.get(`https://fantasy.premierleague.com/api/my-team/${managerid}/`).then(res => {return res.body})});
}

//login('fuzyll10598@gmail.com', 'S9815467a28136', '2389247').then(data => console.log(data));

module.exports = {login};