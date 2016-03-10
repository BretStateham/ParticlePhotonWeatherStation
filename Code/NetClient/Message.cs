using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NetClient
{
  public class Message
  {

    private string eventName;

    public string Event
    {
      get { return eventName; }
      set { eventName = value; }
    }

    private DateTime publishedAt;

    public DateTime PublishedAt
    {
      get { return publishedAt; }
      set { publishedAt = value; }
    }

    private string coreId;

    public string CoreID
    {
      get { return coreId; }
      set { coreId = value; }
    }

    private string subject;

    public string Subject
    {
      get { return subject; }
      set { subject = value; }
    }

    private string unitOfMeasure;

    public string UnitOfMeasure
    {
      get { return unitOfMeasure; }
      set { unitOfMeasure = value; }
    }

    private string measureName;

    public string MeasureName
    {
      get { return measureName; }
      set { measureName = value; }
    }

    private float value;

    public float Value
    {
      get { return value; }
      set { this.value = value; }
    }

    private string organization;

    public string Organization
    {
      get { return organization; }
      set { organization = value; }
    }

    private string displayName;

    public string DisplayName
    {
      get { return displayName; }
      set { displayName = value; }
    }

    private string location;

    public string Location
    {
      get { return location; }
      set { location = value; }
    }

    private DateTime timeCreated;

    public DateTime TimeCreated
    {
      get { return timeCreated; }
      set { timeCreated = value; }
    }

    private string guid;

    public string Guid
    {
      get { return guid; }
      set { guid = value; }
    }

  }
}
