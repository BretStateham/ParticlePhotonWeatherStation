using Microsoft.ServiceBus.Messaging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using System.Threading.Tasks;


namespace NetClient
{
  class SimpleEventProcessor : IEventProcessor
  {

    Stopwatch checkpointStopwatch;

    public async Task CloseAsync(PartitionContext context, CloseReason reason)
    {
      Console.WriteLine("Processor Shutting Down. Partition: '{0}', Reason: '{1}'", context.Lease.PartitionId, reason);
      if (reason == CloseReason.Shutdown)
      {
        await context.CheckpointAsync();
      }
    }

    public Task OpenAsync(PartitionContext context)
    {
      Console.WriteLine("SimpleEventProcessor initialized. Partition: '{0}', Offset: '{1}'", context.Lease.PartitionId, context.Lease.Offset);
      checkpointStopwatch = new Stopwatch();
      checkpointStopwatch.Start();
      return Task.FromResult<object>(null);
    }

    public async Task ProcessEventsAsync(PartitionContext context, IEnumerable<EventData> messages)
    {

      foreach (EventData eventData in messages)
      {
        try
        {
          Message message;
          string data = Encoding.UTF8.GetString(eventData.GetBytes());
          message = JsonConvert.DeserializeObject<Message>(data);
          Console.WriteLine(string.Format("{0:hh:mm:ss tt} - {1}: {2:0.00}{3}", message.TimeCreated.ToLocalTime(), message.MeasureName, message.Value, message.UnitOfMeasure));
        }
        catch (Exception ex)
        {
          string exMessage = string.Format("\n!!!!!!!!!!\nA {0} occurred when deserializing the message: \n{1}\n!!!!!!!!!!\n", ex.GetType().Name, ex.Message);
          Console.WriteLine(exMessage);
          Debug.WriteLine(exMessage);
        }

        //Call checkpoint every five minutes, so that worker can resume processing from 5 minutes back if it restarts.
        if (this.checkpointStopwatch.Elapsed > TimeSpan.FromMinutes(5))
        {
          await context.CheckpointAsync();
          this.checkpointStopwatch.Restart();
        }
      }
    }
  }
}
