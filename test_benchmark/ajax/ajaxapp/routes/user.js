
/*
 * GET home page.
 */

exports.list = function(req, res){
  res.render('hello', { page_title: 'Express' });
};
