'use strict'

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_js__mysql',
});

function executeQuery(sql, callback){
 // connection.connect();
  connection.query(sql, callback);
  //connection.end();
}

module.exports = executeQuery;