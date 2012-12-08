/*
 * GET home page.
 */

var sqlite3 = require('sqlite3').verbose();

exports.home = function(req, res){
  messages = checkMessage()
  res.render('index', { page_title: 'Index Page of Chat' });
};
