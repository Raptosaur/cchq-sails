var https = require("https");

module.exports = function get(req, res) {

  sails.log.debug('Call to API v1 Invasions');

  var result = [];

  //
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

        // Add invasions
        result.push({
          invasions: parsedData
        });

        // Add success.
        result.push({
          success: true
        });

        result = parsedData;

      } catch (e) {

        result.push({
          success: false
        });

      }

      return res.send(result);

    });
  }).on('error', function(e){

    result.push({success: false});

    sails.log.debug('Error whilst connecting to TTCC API for update.');

    return res.send(result);

  });



};
