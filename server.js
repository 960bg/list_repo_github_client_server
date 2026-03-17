const port = 3000;
const http = require('http');
const server = http.createServer(function (req, res) {
  //   res.end('Hello NodeJS! and Mike!');

  // 1. Указываем разрешенный источник (порт, с которого идет запрос)
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');

  // 2. Разрешаем необходимые методы
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  // 3. Разрешаем необходимые заголовки (если нужно)
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 4. Обработка preflight-запроса (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Устанавливаем заголовки ответа
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // Обработка разных URL и методов
  if (req.url === '/' && req.method === 'GET') {
    res.statusCode = 200;
    res.end('<h1>Главная страница</h1>');
  } else if (req.url === '/' && req.method === 'POST') {
    // Чтение данных POST-запроса
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
      console.log('[server]:  body', body);
    });
    req.on('end', () => {
      res.statusCode = 200;
      console.log(`Получены данные: ${body}`);

      res.end(`Получены данные: ${body}`);
    });
  } else {
    res.statusCode = 404;
    res.end('<h1>404 Страница не найдена</h1>');
  }
});

server.listen(port, '127.0.0.1', function () {
  console.log('Сервер начал прослушивание на порту ' + port);
});
