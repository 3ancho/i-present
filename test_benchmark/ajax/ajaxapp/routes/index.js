/*
 * GET home page.
 */

exports.home = function(req, res){
  messages = checkMessage()
  res.render('index', { page_title: 'Index Page of Chat' });
};
