# Настройка Nginx с HTTPS для Telegram Web App

## Шаги настройки на сервере 91.229.90.203

### 1. Установка Nginx
```bash
sudo apt update
sudo apt install nginx
```

### 2. Получение SSL сертификата Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d 91.229.90.203
```

### 4. Настройка Nginx конфига
Скопируйте `nginx.conf` в `/etc/nginx/sites-available/default` или создайте новый файл.

```bash
sudo cp nginx.conf /etc/nginx/sites-available/webapp
sudo ln -s /etc/nginx/sites-available/webapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Запуск Express сервера
```bash
cd /path/to/your/server
npm install
npm start
# Или для production: pm2 start server.js --name webapp
```

### 6. Проверка
- HTTP://91.229.90.203 должен redirect to HTTPS
- HTTPS://91.229.90.203/api/posts должен работать
- Telegram Web App должен загружать данные

## Примечания
- Express сервер должен слушать localhost:3001
- Nginx проксирует /api/ к Express
- SSL сертификат обновляется автоматически Certbot