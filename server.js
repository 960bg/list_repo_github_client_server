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
    let bodyRequest = '';
    //  const bodyRequest = {
    //   username: inputUserNameHTML.value,
    //   page: 1,
    // };
    req.on('data', (chunk) => {
      bodyRequest += chunk.toString();
      console.log('[server]:  body', bodyRequest);
    });
    req.on('end', async () => {
      res.statusCode = 200;
      console.log(`Получены данные: ${bodyRequest}`);

      // getRepos(body).then((data) => {
      //   res.end(JSON.stringify(data));
      // });

      // const repos = await getRepos(bodyRequest);
      const repos = await getRepos2(bodyRequest);
      // const countPage = 1;
      // const reposArr = JSON.parse(repos);

      res.end(repos);
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
function getRepos(body) {
  return new Promise((resolve, reject) => {
    function callbackGetRepos(err, repos) {
      try {
        if (err) {
          return console.error(err.message);
        }

        return resolve(repos);
      } catch (error) {
        console.log('Ошибка в файле app.js github.getRepos');
        console.error(error);
        console.error('Ошибка: ', err);
        reject(error);
      }
    }

    // разбор тела запроса на имя пользователя и страницу для пагинации
    let { username, page } = JSON.parse(body);
    let pathPage;
    console.log('username', username);
    console.log('ДО page', page);

    if (page !== 1) {
      pathPage = `?page=${page}`;
    } else {
      pathPage = '';
    }
    console.log('После pathPage', pathPage);

    // получить список репо из github по имени пользователя
    github.getRepos(username, callbackGetRepos, pathPage);
  });
}

// получить список репо из github по имени пользователя
async function getRepos2(body) {
  // разбор тела запроса на имя пользователя и страницу для пагинации
  let { username, page } = JSON.parse(body);
  let pathPage;
  console.log('username', username);
  console.log('ДО page', page);

  if (page !== 1) {
    pathPage = `?page=${page}`;
  } else {
    pathPage = '';
  }
  console.log('После pathPage', pathPage);

  // получить список репо из github по имени пользователя
  try {
    return await github.getRepos2(username, pathPage);
  } catch (error) {
    console.log('Ошибка в файле app.js github.getRepos');
    console.error(error);
  }
}
