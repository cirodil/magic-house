# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Копируем зависимости
COPY package*.json ./
RUN npm ci --only=production

# Копируем исходный код и собираем
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем собранный проект
COPY --from=build /app/build /usr/share/nginx/html

# Порт для веб-сервера
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]