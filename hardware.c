#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

// ===== WiFi Config =====

const char* ssid = "hien";
const char* password = "19145746" ;
const char* mqtt_user = "tripled";    
const char* mqtt_pass = "842004"; 
const char* mqtt_server = "10.191.68.129";  
const int mqtt_port = 1883;


// ===== DHT Config =====
#define DHTPIN 32
#define DHTTYPE DHT11
#define LED1 18           
#define LED2 19          
#define LED3 21            
#define DO 25
#define AO 34

DHT dht(DHTPIN, DHTTYPE);

WiFiClient espClient;
PubSubClient mqttClient(espClient);

unsigned long previousMillis = 0;
const long interval = 2000;  
int ledState1 = LOW;
int ledState2 = LOW;
int ledState3 = LOW;

void setup_wifi() {
  Serial.begin(115200);
  delay(10);
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!mqttClient.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (mqttClient.connect("ESP32_DHT_Client",mqtt_user, mqtt_pass,"home/status", 0, true, "offline")) {
      Serial.println("connected");
      mqttClient.subscribe("home/sensor");
      mqttClient.subscribe("home/led1");
      mqttClient.subscribe("home/led2");
      mqttClient.subscribe("home/led3");
      mqttClient.publish("home/status", "online", true);


    } else {
      Serial.print("failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 2 seconds");
      delay(2000);
    }
  }
}
void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  if (String(topic) == "home/led1") {
    if (message == "ON") {
      digitalWrite(LED1, HIGH);
      ledState1=HIGH;
    } else if (message == "OFF") {
      digitalWrite(LED1, LOW);
      ledState1=LOW;
    }
    if (digitalRead(LED1) == ledState1){
      char payload[100];
      snprintf(payload,sizeof(payload),"{\"led1\": %d}",ledState1);
      mqttClient.publish("home/ledStatus",payload
      );
    }
  } else if (String(topic) == "home/led2") {
    if (message == "ON") {
      digitalWrite(LED2, HIGH);
      ledState2=HIGH;
    } else if (message == "OFF") {
      digitalWrite(LED2, LOW);
      ledState2=LOW;
    }
    if (digitalRead(LED2) == ledState2){
      char payload[100];
      snprintf(payload,sizeof(payload),"{\"led2\": %d}",ledState2);
      mqttClient.publish("home/ledStatus",payload
      );
    }
  } else if (String(topic) == "home/led3") {
    if (message == "ON") {
      digitalWrite(LED3, HIGH);
      ledState3=HIGH;
    } else if (message == "OFF") {
      digitalWrite(LED3, LOW);
      ledState3=LOW;
    }
    if (digitalRead(LED3) == ledState3){
      char payload[100];
      snprintf(payload,sizeof(payload),"{\"led3\": %d}",ledState3);
      mqttClient.publish("home/ledStatus",payload
      );
    }
  } 
}

void setup() {
  setup_wifi();
  mqttClient.setServer(mqtt_server, mqtt_port);
  mqttClient.setKeepAlive(5);
  mqttClient.setCallback(callback);
  dht.begin();

  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(LED3, OUTPUT);
  pinMode(DO, INPUT);
  digitalWrite(LED3, LOW);
  digitalWrite(LED2, LOW);
  digitalWrite(LED1, LOW);

}
float readLux(int analogValue) {
  const float Vmax = 5.0;
  const int ADC_MAX = 4095;
  const float R = 10000.0;
  const float A = 500000.0;
  const float B = 1.4;

  float V0 = ((float) analogValue / ADC_MAX) * Vmax;
  
  if (V0 <= 0.0) return 0.0;

  float Rldr = R * (((float) Vmax/V0 ) - 1.0);

  return pow((A / Rldr), (1.0 / B));
}

void loop() {
  if (!mqttClient.connected()) {
    reconnect();
  }
  mqttClient.loop();

  unsigned long currentMillis = millis();


  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    int digitalValue = digitalRead(DO);  // 0 hoặc 1
    int analogValue  = readLux(4095-analogRead(AO));   // 0 - 4095 (ESP32 ADC 12-bit)

    if (isnan(temperature)) temperature = 0;
    if (isnan(humidity)) humidity = 0;

    char payload[100];
    snprintf(payload, sizeof(payload), "{\"temperature\": %.2f, \"humidity\": %.2f, \"light\": %d}", temperature, humidity,analogValue);
    mqttClient.publish("home/sensor", (uint8_t*)payload, strlen(payload), true); // QoS 1

    // Serial.println(payload);
  }
}