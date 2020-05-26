const express = require('express');
const app = express();
app.listen(3000);
app.use(express.urlencoded({extended: true}));

// set up cassandra and load data models from models directory
const models = require('express-cassandra');
models.setDirectory( __dirname + '/models').bind(
  {
    clientOptions: {
      contactPoints: ['127.0.0.1'],
      protocolOptions: { port: 9042 },
      keyspace: 'WaterGridSense',
      queryOptions: {consistency: models.consistencies.one}
    },
    ormOptions: {
      defaultReplicationStrategy : {
        class: 'SimpleStrategy',
        replication_factor: 1
      },
      migration: 'safe'
    }
  },
  function(err) {
    if(err) throw err;
  }
);

// start requests
app.get('/', (req, res) => {
  if (req.query.uid) {
    models.instance.WGS_Measurements.findOneAsync({uid: models.uuidFromString(req.query.uid)})
      .then(function(data) {
        res.send(
          "uid: "       + data.uid       + "\n" +
          "type: "      + data.type      + "\n" +
          "sensorid: "  + data.sensorid  + "\n" +
          "timestamp: " + data.timestamp + "\n" +
          "location: "  + data.location  + "\n" +
          "rawValue: "  + data.rawValue  + "\n" +
          "conValue: "  + data.conValue  + "\n"
        );
      })
      .catch(function(err) {
        console.log(err);
      });
  } else {
    res.send('Usage: GET [ip]:3000?uid=[uid]\n')
  }
});

app.post('/', (req, res) => {

  // type conversions
  var requestUUID = req.body.uid ? models.uuidFromString(req.body.uid) : null;
  var requestRawValue = req.body.rawValue ? +req.body.rawValue : null;
  var requestConValue = req.body.conValue ? +req.body.conValue : null;

  // create dummy data
  var data = new models.instance.WGS_Measurements({
    uid:       requestUUID        || models.uuid(),
    type:      req.body.type      || "sensor",
    sensorid:  req.body.sensorid  || "S-1234",
    timestamp: req.body.timestamp || "2020-03-30  12:15",
    location:  req.body.location  || "Berlin",
    rawValue:  requestRawValue    || 1,
    conValue:  requestConValue    || 1.2,
  });

  // save to cassandra
  data.save(function(err){
    if(err) {
      console.log(err);
      return;
    }
    console.log("Data saved to cassandra\n");
  });

  res.send(data.uid + " saved to cassandra\n");
});
