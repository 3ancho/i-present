path = require('path')
/*
 * GET home page.
 */

exports.home = function(req, res){
  res.sendfile(path.join(__dirname, '../public/index.html'));
};

exports.chat = function(req, res){
  res.render('chat', { page_title: 'Chat room' });
};

