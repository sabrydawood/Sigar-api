

const setHeaders = (app) => {
app.use(function(req, res, next) {
  res.header('charset', 'UTF-8')
	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Content-Security-Policy-Report-Only', 'default-src: https:');
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT POST PATCH DELETE GET');
      return res.status(200).json({});
		}
  next();
	
});
	
}
module.exports =  setHeaders;