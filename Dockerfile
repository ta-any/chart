FROM ubuntu:latest
LABEL authors="namer"

# Используем официальный образ Node.js
FROM node:18

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /CHART

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта
COPY . .

# Собираем приложение
RUN npm run build

# Указываем порт, который будет использовать приложение
EXPOSE 3000

# Запускаем приложение
CMD [ "npm", "start" ]