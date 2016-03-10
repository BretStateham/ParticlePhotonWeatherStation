// This #include statement was automatically added by the Spark IDE.
#include "Adafruit_DHT/Adafruit_DHT.h"

#define DHTPIN 2    // what pin we're connected to

// Uncomment whatever type you're using!
#define DHTTYPE DHT11		// DHT 11 
//#define DHTTYPE DHT22		// DHT 22 (AM2302)
//#define DHTTYPE DHT21		// DHT 21 (AM2301)

// Connect pin 1 (on the left) of the sensor to +5V
// Connect pin 2 of the sensor to whatever your DHTPIN is
// Connect pin 4 (on the right) of the sensor to GROUND
// Connect a 10K resistor from pin 2 (data) to pin 1 (power) of the sensor

DHT dht(DHTPIN, DHTTYPE);

char Org[] = "ORGANIZATION_NAME";
char Disp[] = "DISPLAY_NAME";
char Locn[] = "LOCATION";

//The amount of time (in milliseconds) to wait between each 
//publication of data via the Particle WebHook
//Particle webhooks are rate limited to a maximum of 10/minute/device
//if we can only send 10 times a minute, that means we can send on average
//about once every six seconds, or 6000 milliseconds.  So to avoid any 
//rate limits by the particle cloud, keep the sendDelay at at least 6000.
int sendDelay = 6000;

void setup()
{
  dht.begin();
  Serial.begin(9600);
  delay(10000);
}

 
void loop()
{

  // Reading temperature or humidity takes about 250 milliseconds!
  // Sensor readings may also be up to 2 seconds 'old' (its a 
  // very slow sensor)
  float h = dht.getHumidity();
  // Read temperature as Celsius
  float t = dht.getTempCelcius();
  // Read temperature as Farenheit
  float f = dht.getTempFarenheit();
  
  // Check if any reads failed. If any did, emit details to serial port for monitoring
  // and exit the loop early (to try again).
  if (isnan(h) || isnan(t) || isnan(f)) {
    Serial.println("");
    Serial.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    Serial.println("Failed to read from DHT sensor!");
    Serial.println("h=" + String(h) + " t=" + String(t) + " f=" + String(f));
    Serial.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    Serial.println("");
    return;
  } 
  
  // Emit the sensor values to the Serial port for monitoring
  Serial.println();
  Serial.println("----------");
  Serial.println();
  Serial.println("h=" + String(h) + " t=" + String(t) + " f=" + String(f));

  // Generate the temperature data payload
  char payload[255];
  snprintf(payload, sizeof(payload),"{\"s\":\"Weather\",\"u\":\"F\",\"m\":\"Temperature\",\"v\": %f,\"o\":\"%s\",\"d\":\"%s\",\"l\":\"%s\"}",f,Org,Disp,Locn);
  //Emit the payload to the serial port for monitoring purposes
  Serial.println(payload);
  
       
  // Send the temperature data payload
  Particle.publish("PublishToEventHub", payload);
  //Wait for the specified "sendDelay" before sending the humidity data...    
  delay(sendDelay);
    
  // Generate the humidity data payload
  snprintf(payload, sizeof(payload),"{\"s\":\"Weather\",\"u\":\"%%\",\"m\":\"Humidity\",\"v\": %f,\"o\":\"%s\",\"d\":\"%s\",\"l\":\"%s\"}",h,Org,Disp,Locn);
  // Emit the payload to the serial port for monitoring purposes
  Serial.println(payload);

  // Send the humidity data payload
  Particle.publish("PublishToEventHub", payload);
  // wait for the specified "sendDelay" before looping...
  delay(sendDelay);
}

