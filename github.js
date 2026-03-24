const https = require('https');

exports.getRepos = getRepos;
exports.getRepos2 = getRepos2;

// запрос репозиториев написан с использованием  https.get и коллбеков
function getRepos(username, fnDone, page = '') {
  const options = {
    hostname: 'api.github.com',
    path: `/users/${username}/repos${page}`,
    // path: `/users/${username}/repos?page=2`,
    headers: {
      'User-Agent': 'github-app',
    },
  };

  console.log(`options`);
  console.log(`${options.path}конец`);

  if (!username) {
    return fnDone(
      new Error('Не указано имя пользователя в аргументах при вызове программы')
    );
  }

  console.log('username', username);

  try {
    const request = https.get(options, (res) => {
      res.setEncoding('utf-8');

      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        console.log('Код ответа сервера api.github.com:', res.statusCode);
        console.log(
          'Сообщение сервера api.github.com statusMessage:',
          res.statusMessage
        );
        const responseGit = {
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          repos: body,
        };

        // console.log('body');
        // console.log(body);

        fnDone(null, JSON.stringify(responseGit));
      });
    });

    request.on('error', (error) => {
      fnDone(
        new Error(
          `Ошибка в работе api.github.com сервера: ${error.name} \n ${error.message}`
        )
      );
    });
  } catch (error) {
    fnDone(
      new Error(
        `Ошибка работы api.github.com сервера: ${error.name} \n ${error.message}`
      )
    );
  }
}

// запрос репозиториев написан с использованием  fetch
async function getRepos2(username, page = '') {
  const options = {
    hostname: 'api.github.com',
    path: `/users/${username}/repos${page}`,
    // path: `/users/${username}/repos?page=2`,
    headers: {
      'User-Agent': 'github-app',
    },
  };

  const URL = `https://${options.hostname}${options.path}`;

  if (!username) {
    console.error(
      'Не указано имя пользователя в аргументах при вызове программы'
    );
  }

  try {
    // const response = await fetch(URL);
    const response = await fetch(URL, options);

    const repos = await response.text();

    const responseGit = {
      statusCode: response.status,
      statusMessage: response.statusText,
      repos: repos,
    };
    return JSON.stringify(responseGit);
  } catch (error) {
    console.error(
      `Ошибка работы api.github.com сервера: ${error.name} \n ${error.message}`
    );
  }
}
