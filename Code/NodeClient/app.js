// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';
var Promise = require('bluebird');
var EventHubClient = require('azure-event-hubs').Client;
var moment = require('moment');

// The Event Hubs SDK can also be used with an Azure IoT Hub connection string.
// In that case, the eventHubPath variable is not used and can be left undefined.
var connectionString = '[Event Hub Connection String]';
var eventHubPath = '[Event Hub Name (Path)]';
var client = EventHubClient.fromConnectionString(connectionString, eventHubPath);

// Set the consumer group and start time offset for the event hub receivers
// If you have created a consumer group for your node app to use, enter it here
var consumerGroup = '$Default';  
// Set the consumer up to receive only new messages, not all the old ones as well
// set receiveAfterTime to null to read all of the messages from the beginning 
var receiveAfterTime = Date.now() - 5000;

// Log a received message body out to the console
var printEvent = function (ehEvent) {
  var body = ehEvent.body
  var created = moment(body.timecreated);
  var val = Number(body.value);
  console.log(created.format("hh:mm:ss a") + " - " + body.measurename + ": " + val.toFixed(2) + body.unitofmeasure);
};

// Log an error to the console
var printError = function (err) {
  console.error(err.message);
};

// Send the given eventBody to the Event Hub
var sendEvent = function (eventBody) {
  return function (sender) {
    console.log('Sending Event: ' + eventBody);
    return sender.send(eventBody);
  };
};

client.open()
  .then(client.getPartitionIds.bind(client))
  .then(function (partitionIds) {
    return partitionIds.map(function (partitionId) {
      return client.createReceiver(
          consumerGroup,  
          partitionId, 
          { 'startAfterTime': receiveAfterTime }  
      ).then(function (receiver) {
          receiver.on('errorReceived', printError);
          receiver.on('message', printEvent);
        });
    });
  })
  // The send commands have been commented out since we want to just receive
  // messages from the Photon sender, but you can see how you could use this code
  // to send messages as well..
  //   .then(client.createSender.bind(client))
  //   .then(sendEvent('foo'))
  .catch(printError);
