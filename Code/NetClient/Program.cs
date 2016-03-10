using Microsoft.ServiceBus.Messaging;
using System;


namespace NetClient
{
  class Program
  {
    static void Main(string[] args)
    {
      string eventHubConnectionString = "[Event Hub Connection String]";
      string eventHubName = "[Event Hub Name (Path)]";
      string consumerGroupName = EventHubConsumerGroup.DefaultGroupName;

      string storageAccountName = "[Storage Account Name]";
      string storageAccountKey = "[Storage Account Key]";
      string storageConnectionString = string.Format("DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1}", storageAccountName, storageAccountKey);

      string eventProcessorHostName = Guid.NewGuid().ToString();
      EventProcessorHost eventProcessorHost = new EventProcessorHost(eventProcessorHostName, eventHubName, consumerGroupName, eventHubConnectionString, storageConnectionString);

      Console.WriteLine("Registering EventProcessor...");
      EventProcessorOptions processorOptions = new EventProcessorOptions()
      {
        //Start reading messages from now, ingore any previous messages in the hub
        InitialOffsetProvider = (name) => DateTime.UtcNow
      };
      eventProcessorHost.RegisterEventProcessorAsync<SimpleEventProcessor>(processorOptions).Wait();

      Console.WriteLine("Receiving.  Press enter key to stop worker.");
      Console.ReadLine();
      eventProcessorHost.UnregisterEventProcessorAsync().Wait();
    }
  }
}
