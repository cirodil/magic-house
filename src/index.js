import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Регистрация сервис-воркера
serviceWorkerRegistration.register({
  onSuccess: (registration) => {
    console.log("PWA успешно зарегистрирован и готов к работе в офлайн-режиме");
  },
  onUpdate: (registration) => {
    console.log("Доступна новая версия приложения");
    // Здесь можно показать уведомление пользователю о доступном обновлении
  },
});
