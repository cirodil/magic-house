#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <NeoPixelBus.h>

#define LED_COUNT 4
#define LED_PIN 8

NeoPixelBus<NeoGrbFeature, Neo800KbpsMethod> strip(LED_COUNT, LED_PIN);

// UUID сервиса и характеристик
#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define ROOM1_UUID   "beb5483e-36d1-4b8d-9d5f-8a3b3c9d4e5f"
#define ROOM2_UUID   "9e2c4a1d-8f7b-4c6a-b5d3-2e1f0a9c8b7d"
#define ROOM3_UUID   "7a1e6b3c-5d4f-4a2e-8c9b-0d1e2f3a4b5c"
#define YARD_UUID    "3c6d9a2b-1e8f-4d7c-9b5a-6e0f8d1c7b3a"

BLECharacteristic *pRoom1Char, *pRoom2Char, *pRoom3Char, *pYardChar;

class MyCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) override {
    if (pCharacteristic->getLength() == 0) return;

    uint8_t brightness = ((uint8_t*)pCharacteristic->getData())[0];

    if (pCharacteristic == pRoom1Char) {
      strip.SetPixelColor(0, RgbColor(brightness, brightness, brightness));
    } else if (pCharacteristic == pRoom2Char) {
      strip.SetPixelColor(1, RgbColor(brightness, brightness, brightness));
    } else if (pCharacteristic == pRoom3Char) {
      strip.SetPixelColor(2, RgbColor(brightness, brightness, brightness));
    } else if (pCharacteristic == pYardChar) {
      strip.SetPixelColor(3, RgbColor(brightness, brightness, brightness));
    }
    strip.Show();
  }
};

void setup() {
  // Отладка (опционально)
  Serial.begin(115200);
  Serial.println("Starting WaldorfHouse BLE...");

  // 1. Сначала инициализируем BLE
  BLEDevice::init("WaldorfHouse");
  BLEServer *pServer = BLEDevice::createServer();

  BLEService *pService = pServer->createService(SERVICE_UUID);

  pRoom1Char = pService->createCharacteristic(ROOM1_UUID, BLECharacteristic::PROPERTY_WRITE);
  pRoom2Char = pService->createCharacteristic(ROOM2_UUID, BLECharacteristic::PROPERTY_WRITE);
  pRoom3Char = pService->createCharacteristic(ROOM3_UUID, BLECharacteristic::PROPERTY_WRITE);
  pYardChar = pService->createCharacteristic(YARD_UUID, BLECharacteristic::PROPERTY_WRITE);

  MyCallbacks *callbacks = new MyCallbacks(); // один экземпляр для всех
  pRoom1Char->setCallbacks(callbacks);
  pRoom2Char->setCallbacks(callbacks);
  pRoom3Char->setCallbacks(callbacks);
  pYardChar->setCallbacks(callbacks);

  pService->start();

  BLEAdvertising *pAdvertising = pServer->getAdvertising();
  pAdvertising->start();

  Serial.println("BLE advertising started");

  // 2. Только ПОСЛЕ BLE инициализируем NeoPixel
  strip.Begin();
  strip.Show(); // выключить все светодиоды
}

void loop() {
  delay(2000);
}