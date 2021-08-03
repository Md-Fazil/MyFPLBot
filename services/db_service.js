var mysql = require('mysql');
require('dotenv').config();

var con = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  port: 1433
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});