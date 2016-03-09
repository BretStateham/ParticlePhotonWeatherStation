// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';
var Promise = require('bluebird');
var EventHubClient = require('azure-event-hubs').Client;

// The Event Hubs SDK can also be used with an Azure IoT Hub connection string.
// In that case, the eventHubPath variable is not used and can be left undefined.
var connectionString = '[Event Hubs Connection String]';
var eventHubPath = '[Event Hub Name (Path)]';
var consumerGroup = '$Default';  //Change to specific group if desired


// Send the given eventBody to the Event Hub
var sendEvent = function (eventBody) {
  return function (sender) {
    console.log('Sending Event: ' + eventBody);
    return sender.send(eventBody);
  };
};

// Log a received message body out to the console
// See node_modules/azure-event-hubs/lib/eventdata.js
// for properties other than "body" that can be shown
// about a received event.  Other properties include
//   ehEvent.partitionKey
//   ehEvent.body
//   ehEvent.enqueuedTimeUtc
//   ehEvent.offset
//   ehEvent.properties
//   ehEvent.sequenceNumber
//   ehEvent.systemProperties 
var printEvent = function (ehEvent) {
  console.log('Event Received: ');
  console.log(JSON.stringify(ehEvent.body));
  console.log('');
};

// Log an error to the console
var printError = function (err) {
  console.error(err.message);
};

// Declare the Event Hub client for our event hub given the 
// Event Hub Connection String and Event Hub Name from above
var client = EventHubClient.fromConnectionString(connectionString, eventHubPath);

// Only receive messages after the current date/time (or five seconds before)
var receiveAfterTime = Date.now() - 5000;

// Open the client, this actually connects to the event hub
client.open()
  // Retrieve the partition information from the event hub
  .then(client.getPartitionIds.bind(client))
  // Then take those partitions
  .then(function (partitionIds) {
    // And for each one
    return partitionIds.map(function (partitionId) {
      // Create an Event Hub Reciever to listen for messages
      // On that partition, for the given consumerGroup
      // and only get messages after the receiveAfterTime from above 
      return client.createReceiver(
          consumerGroup,  
          partitionId, 
          { 'startAfterTime': receiveAfterTime }  
      // Then take that receiver and...
      ).then(function (receiver) {
          // Wire the "errorReceived" event to printError from above 
          receiver.on('errorReceived', printError);
          // Wire the "message" event to printEvent above 
          receiver.on('message', printEvent);
        });
    });
  })
  // The send commands have been commented out since we want to just receive
  // messages from the Photon sender, but you can see how you could use this code
  // to send messages as well..
  //   .then(client.createSender.bind(client))
  //   .then(sendEvent('foo'))
  // Otherwise, catch any errors, and print them
  .catch(printError);