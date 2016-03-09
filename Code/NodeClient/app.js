// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';
var Promise = require('bluebird');
var EventHubClient = require('azure-event-hubs').Client;

// The Event Hubs SDK can also be used with an Azure IoT Hub connection string.
// In that case, the eventHubPath variable is not used and can be left undefined.
var connectionString = '[Event Hubs Connection String]';
var eventHubPath = '[Event Hub Path]';

var sendEvent = function (eventBody) {
  return function (sender) {
    console.log('Sending Event: ' + eventBody);
    return sender.send(eventBody);
  };
};

var printEvent = function (ehEvent) {
  console.log('Event Received: ');
  console.log(JSON.stringify(ehEvent.body));
  console.log('');
};

var printError = function (err) {
  console.error(err.message);
};

var client = EventHubClient.fromConnectionString(connectionString, eventHubPath);
var receiveAfterTime = Date.now() - 5000;

client.open()
      .then(client.getPartitionIds.bind(client))
      .then(function (partitionIds) {
        return partitionIds.map(function (partitionId) {
          return client.createReceiver(
              '$Default',  //Consumer Group Name
              partitionId, //Current Partition ID being setup
              { 'startAfterTime': receiveAfterTime }  //Start offset
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
