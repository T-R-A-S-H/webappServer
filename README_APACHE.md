# Настройка Apache с HTTPS для Telegram Web App

## Шаги настройки на сервере 91.229.90.203

### 1. Установка Apache и модулей
```bash
sudo apt update
sudo apt install apache2
sudo a2enmod ssl proxy proxy_http rewrite
sudo systemctl restart apache2
```

### 2. Создание self-signed SSL сертификата
```bash
sudo mkdir -p /etc/ssl/private /etc/ssl/certs
sudo openssl req -x509 -newkey rsa:4096 -keyout /etc/ssl/private/selfsigned.key -out /etc/ssl/certs/selfsigned.crt -days 365 -nodes -subj "/C=RU/ST=Moscow/L=Moscow/O=WebApp/CN=62.113.111.50"
```
Следуйте инструкциям. Apache автоматически настроит HTTPS.

### 3. Настройка Apache
Скопируйте `apache.conf` в `/etc/apache2/sites-available/webapp.conf`

```bash
sudo cp apache.conf /etc/apache2/sites-available/webapp.conf
sudo a2ensite webapp
sudo a2dissite 000-default
sudo systemctl reload apache2
```

### 4. Запуск Express сервера
```bash
cd /path/to/server
npm install
npm start  # Или pm2 start server.js
```

### 5. Проверка
- HTTP://91.229.90.203 должен redirect to HTTPS
- HTTPS://91.229.90.203/api/posts должен работать
- Telegram Web App должен загружать данные

## Примечания
- Express сервер должен слушать localhost:3001
- Apache проксирует /api/ к Express
- SSL сертификат обновляется автоматически Certbot