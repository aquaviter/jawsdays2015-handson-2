/*
	edison.js
		Collect sensor data and put the data into Amazon Kinesis Stream.

 */

var m = require('mraa');
var AWS = require('aws-sdk');
var deviceName = 'edison1';
var partisionKey = deviceName;
var streamName = 'jawsdays2015-handson-track2';
var intervalmsec = 5000;
//var streamName = process.argv[2];

var cognitoParams = {
	AccountId: "",
	RoleArn: "",
	IdentityPoolId: ""
};

var analogPin0 = m.Aio(0);

AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials(cognitoParams);
AWS.config.credentials.get(function(err) {
	if (!err) {
		console.log("Cognito Identity Id: " + "AWS.config.credentils.identityId");
	}
});

AWS.config.region = 'ap-northeast-1';
var kinesis = new AWS.Kinesis();

// loop: put sensor data
setInterval( function() {
	var value = analogPin0.read();
	var record = {
		devicename: deviceName,
		time: (new Date).getTime()/1000,
		value: value
	}
	console.log("sensor data: " + data);

	// Define kinesis parameters
	var kinesisParams = {
		Data: JSON.stringify(record),
		PartitionKey: partitionKey,
		StreanMane: streamName
	};

	// Put sensor data into kinesis stream
	kinesis.putRecord(kinesisParams, function(err, data) {
		if (err) {
			console.log(err, err.stack);
		} else {
			console.log data;
		}
	});
}, intervalmsec);


