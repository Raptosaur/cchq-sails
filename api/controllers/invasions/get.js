var https = require("https"),
    fs    = require("fs"),
    util  = require("util");

var updateInfo = function(){
  var result = {};
  var options = {
    host: 'corporateclash.net',
    port: 443,
    path: '/api/v1/districts/'
  };
  https.get(options, function(resp){

    let rawData = '';

    resp.on('data', (chunk) => { rawData += chunk; });
    resp.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        fs.writeFile("./temp/latestData.json", JSON.stringify(parsedData), "utf8", function(){} );
      } catch (e) {
        throw "Error storing updated information";
      }
    });
  }).on('error', function(e2){
    sails.log.debug('Error whilst connecting to TTCC API for update.');
  });
  return result;
};

module.exports = function get(req, res) {

  var result = {};
  var latestUpdate = [];

  var stats = null;

  try{
    stats = fs.statSync("./temp/latestData.json");
  }catch(e){
    console.log(e);
    latestUpdate = updateInfo();
  }

  if(stats != null){
    var mtime = new Date(stats.mtime);
    if(new Date() - mtime > 10000){
      latestUpdate = updateInfo();
    }
    result.last_update = Math.floor(mtime/1000);
  }else{
    result.last_update = Math.floor(new Date() / 1000);
  }

  var latestUpdate = JSON.parse(
    fs.readFileSync("./temp/latestData.json")
  );
  result.invasions = latestUpdate;

  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');

  return res.send(result);

};
