const github = require('./github.js');

const port = 3000;
const http = require('http');
const server = http.createServer(async function (req, res) {
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
      getRepos(body).then((data) => {
        res.end(JSON.stringify(data));
      });
    });
  } else {
    res.statusCode = 404;
    res.end('<h1>404 Страница не найдена</h1>');
  }
});

server.listen(port, '127.0.0.1', function () {
  console.log('Сервер начал прослушивание на порту ' + port);
});

// получить список репо из github по имени пользователя
function getRepos(username) {
  return new Promise((resolve, reject) => {
    github.getRepos(username, (err, repos) => {
      try {
        if (err) {
          return console.error(err.message);
        }

        repos.forEach((repo, index) => {
          console.log(`[${index + 1}]`, repo.name);
        });

        return resolve(repos);
      } catch (error) {
        console.log('Ошибка в файле app.js github.getRepos');
        console.error(error);
        console.error('Ошибка: ', err);
        reject(error);
      }
    });
  });
}
