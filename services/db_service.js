var Connection = require('tedious').Connection;  
var config = {  
    server: 'DESKTOP-O3GDEMN\SQLEXPRESS',  
    authentication: {
        type: 'default',
        options: {
            userName: 'fpladmin', 
            password: 'fpladmin'  
        }
    },
    options: {
        database: 'MyFPLBot'  
    }
};  
var connection = new Connection(config);  
connection.on('connect', function(err) {  
    console.log("Connected");  
});

connection.connect();