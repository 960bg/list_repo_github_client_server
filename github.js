const https = require('https');

exports.getRepos = getRepos;

function getRepos(username, fnDone, page = '') {
  const option = {
    hostname: 'api.github.com',
    path: `/users/${username}/repos${page}`,
    // path: `/users/${username}/repos?page=2`,
    headers: {
      'User-Agent': 'github-app',
    },
  };

  console.log(`option`);
  console.log(`${option.path}конец`);

  if (!username) {
    return fnDone(
      new Error('Не указано имя пользователя в аргументах при вызове программы')
    );
  }

  console.log('username', username);

  try {
    const request = https.get(option, (res) => {
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
