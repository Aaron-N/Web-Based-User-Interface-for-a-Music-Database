var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_nesbita',
  password        : '3334',
  database        : 'cs340_nesbita'
});
module.exports.pool = pool;
