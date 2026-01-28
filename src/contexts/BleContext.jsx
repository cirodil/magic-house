import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import {
  connectToDevice,
  setBrightness,
  setColor,
  HOUSE_SERVICE_UUID,
  CHARACTERISTICS,
} from "../utils/bleUtils";

const BleContext = createContext(null);

export function BleProvider({ children }) {
  const [device, setDevice] = useState(null);
  const [characteristics, setCharacteristics] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  const reconnectToDevice = useCallback(async (deviceId) => {
    setIsConnecting(true);
    setConnectionStatus("connecting");

    try {
      const bleDevice = await navigator.bluetooth.requestDevice({
        filters: [{ services: [HOUSE_SERVICE_UUID] }],
        optionalServices: [HOUSE_SERVICE_UUID],
      });

      if (bleDevice.id !== deviceId) {
        throw new Error("Connected to wrong device");
      }

      await connectAndSetup(bleDevice);
    } catch (error) {
      console.error("Reconnection failed:", error);
      setConnectionStatus("error");
      setConnectionError("Не удалось переподключиться к домику");
      localStorage.removeItem("lastConnectedDevice");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  useEffect(() => {
    const savedDeviceId = localStorage.getItem("lastConnectedDevice");
    if (savedDeviceId) {
      reconnectToDevice(savedDeviceId);
    }
  }, [reconnectToDevice]);

  const connect = useCallback(async () => {
    if (isConnecting) return;

    setIsConnecting(true);
    setConnectionStatus("connecting");
    setConnectionError(null);

    try {
      const { device: bleDevice, characteristics: chars } =
        await connectToDevice();

      setDevice(bleDevice);
      setCharacteristics(chars);
      setConnectionStatus("connected");
      localStorage.setItem("lastConnectedDevice", bleDevice.id);

      bleDevice.ongattserverdisconnected = () => {
        setDevice(null);
        setCharacteristics(null);
        setConnectionStatus("disconnected");
        setConnectionError("Подключение к домику потеряно");
      };
    } catch (error) {
      console.error("Connection failed:", error);
      setConnectionStatus("error");

      let errorMessage = "Не удалось подключиться к домику";
      if (error.message.includes("Bluetooth не поддерживается")) {
        errorMessage = "Bluetooth не поддерживается в этом браузере";
      } else if (error.message.includes("Домик не найден")) {
        errorMessage = "Домик не найден. Включите его и попробуйте снова";
      } else if (error.message.includes("Разрешите доступ")) {
        errorMessage = "Разрешите доступ к Bluetooth в настройках браузера";
      }

      setConnectionError(errorMessage);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting]);

  const connectAndSetup = async (bleDevice) => {
    try {
      const server = await bleDevice.gatt.connect();
      const service = await server.getPrimaryService(HOUSE_SERVICE_UUID);

      const chars = {};
      for (const [key, uuid] of Object.entries(CHARACTERISTICS)) {
        chars[key] = await service.getCharacteristic(uuid);
      }

      setDevice(bleDevice);
      setCharacteristics(chars);
      setConnectionStatus("connected");

      bleDevice.ongattserverdisconnected = () => {
        setDevice(null);
        setCharacteristics(null);
        setConnectionStatus("disconnected");
        setConnectionError("Подключение к домику потеряно");
      };
    } catch (error) {
      console.error("Setup failed:", error);
      setConnectionStatus("error");
      throw error;
    }
  };

  // Обновленная функция для установки цвета
  const updateColor = async (room, color) => {
    if (!device || !characteristics || !characteristics[room]) {
      throw new Error("Устройство не подключено");
    }

    try {
      await setColor(characteristics[room], color);
    } catch (error) {
      console.error("Update failed:", error);

      if (
        error.message.includes("GATT operation failed") ||
        error.message.includes("device disconnected")
      ) {
        setDevice(null);
        setCharacteristics(null);
        setConnectionStatus("disconnected");
        setConnectionError("Подключение потеряно. Переподключитесь к домику");
        throw new Error("Подключение потеряно. Пожалуйста, переподключитесь.");
      }

      throw error;
    }
  };

  // Функция для установки яркости (режим совместимости)
  const updateLight = async (room, value) => {
    if (!device || !characteristics || !characteristics[room]) {
      throw new Error("Устройство не подключено");
    }

    try {
      await setBrightness(characteristics[room], value);
    } catch (error) {
      console.error("Update failed:", error);

      if (
        error.message.includes("GATT operation failed") ||
        error.message.includes("device disconnected")
      ) {
        setDevice(null);
        setCharacteristics(null);
        setConnectionStatus("disconnected");
        setConnectionError("Подключение потеряно. Переподключитесь к домику");
        throw new Error("Подключение потеряно. Пожалуйста, переподключитесь.");
      }

      throw error;
    }
  };

  const disconnect = useCallback(() => {
    if (device) {
      try {
        device.gatt.disconnect();
      } catch (error) {
        console.warn("Disconnect warning:", error);
      }
      setDevice(null);
      setCharacteristics(null);
      setConnectionStatus("disconnected");
      localStorage.removeItem("lastConnectedDevice");
    }
  }, [device]);

  return (
    <BleContext.Provider
      value={{
        device,
        characteristics,
        connectionError,
        isConnecting,
        connectionStatus,
        connect,
        disconnect,
        updateLight,
        updateColor,
      }}
    >
      {children}
    </BleContext.Provider>
  );
}

export const useBle = () => useContext(BleContext);
