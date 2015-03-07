/*
  server.js
    Retrieve data from Kinesis stream and draw realtime chart

    @author Hideyo Yoshida
    @version 1.0 2015/03/07

    Usage:
      node server.js <kinessis stream name>
 */

var aws = require('aws-sdk');
var fs = require('fs');

// Check arguments
if (process.argv.length < 3) {
  console.log('Error: Kinesis Stream Name is Missing.');
  console.log('Usage: node server.js <kinesis stream name>');
  return;
}

var stream = process.argv[2];
var region = 'ap-northeast-1';
var strategy = 'LATEST';
var kinesis = new aws.Kinesis({region:region});

// Load HTML file
var fs = require('fs');
var app = require('http').createServer(function(req, res) {
	res.writeHead(200, {'Content-Type':'text/html'});
	res.end(fs.readFileSync('dashboard.html'));
}).listen(9000);

// Create websocket and connect to javascript client
var io = require('socket.io').listen(app);
io.sockets.on('connection', function(socket) {
	socket.on('msg', function(data) {
		io.sockets.emit('msg'. data);
	});
});

// Get an kinesis iterator
kinesis.describeStream({StreamName:stream},function(err,result){

  if(err) {
    console.log("Error: Kinesis Stream (" + stream + ") is missing");
    process.exit();
  }

   var shards = result.StreamDescription.Shards;

   // Check shards ID and get records from all shards
   for(var i = 0; i < shards.length; i++){
       var shardId = shards[i].ShardId;
       var params = {
         ShardId: shardId,
         ShardIteratorType: strategy,
         StreamName: stream
       };
       // Get iterator from kinesis in order to specify record data
       kinesis.getShardIterator(params,function(err,result){
          if(err) console.log(err);
          else getRecords(kinesis,shardId,result.ShardIterator);
       });
   }
});

// Get a record
function getRecords(kinesis,shardId,shardIterator){
    kinesis.getRecords({ShardIterator: shardIterator, Limit: 10000},function(err,result){
        if(err) console.log(err);
        else {
            if(result.Records.length){
                for(var i = 0; i < result.Records.length; i++){
                    r = result.Records[i];
                   	io.sockets.emit('msg', String(r.Data));
                    console.log('shardID=' + shardId);
                    console.log('partitionKey=' + r.PartitionKey);
                    console.log('sequenceNumber=' + r.SequenceNumber);
                    console.log('data=' + r.Data);
                }
            }
            setTimeout(function() {
                getRecords(kinesis, shardId, result.NextShardIterator);
            },0);
        }
    })
}


