export const HOUSE_SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
export const CHARACTERISTICS = {
  room1: "beb5483e-36d1-4b8d-9d5f-8a3b3c9d4e5f",
  room2: "9e2c4a1d-8f7b-4c6a-b5d3-2e1f0a9c8b7d",
  room3: "7a1e6b3c-5d4f-4a2e-8c9b-0d1e2f3a4b5c",
  yard: "3c6d9a2b-1e8f-4d7c-9b5a-6e0f8d1c7b3a",
};

export async function connectToDevice() {
  if (!navigator.bluetooth) {
    throw new Error("Bluetooth не поддерживается в этом браузере");
  }

  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [
        { namePrefix: "WaldorfHouse" },
        { services: [HOUSE_SERVICE_UUID] },
      ],
      optionalServices: [HOUSE_SERVICE_UUID],
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(HOUSE_SERVICE_UUID);

    const characteristics = {};
    for (const [key, uuid] of Object.entries(CHARACTERISTICS)) {
      characteristics[key] = await service.getCharacteristic(uuid);
    }

    return { device, characteristics };
  } catch (error) {
    console.error("BLE Connection failed:", error);

    if (error.name === "NotFoundError") {
      throw new Error(
        "Домик не найден. Пожалуйста, включите его и попробуйте снова.",
      );
    }

    if (error.name === "SecurityError") {
      throw new Error("Разрешите доступ к Bluetooth в настройках браузера.");
    }

    throw error;
  }
}

// Функция для установки яркости (режим совместимости)
export async function setBrightness(characteristic, value) {
  if (value < 0 || value > 255) {
    throw new Error("Brightness value must be between 0 and 255");
  }

  const buffer = new Uint8Array([value]);
  await characteristic.writeValue(buffer);
}

// Новая функция для установки цвета
export async function setColor(characteristic, color) {
  const { r, g, b } = color;

  if ([r, g, b].some((val) => val < 0 || val > 255)) {
    throw new Error("Color values must be between 0 and 255");
  }

  const buffer = new Uint8Array([r, g, b]);
  await characteristic.writeValue(buffer);
}
