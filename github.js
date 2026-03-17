const https = require('https');

exports.getRepos = getRepos;

function getRepos(username, fnDone) {
  const option = {
    hostname: 'api.github.com',
    path: `/users/${username}/repos`,
    headers: {
      'User-Agent': 'github-app',
    },
  };

  if (!username) {
    return fnDone(
      new Error('Не указано имя пользователя в аргументах при вызове программы')
    );
  }

  console.log('username', username);

  try {
    const request = https.get(option, (res) => {
      console.log('Код ответа сервера:', res.statusCode);

      if (res.statusCode !== 200) {
        // return fnDone(new Error('Ошибка работы с сервером'));
        fnDone(new Error('Ошибка работы с сервером: statusCode !== 200 '));

        return process.exit(0);
      }

      res.setEncoding('utf-8');

      let body = '';

      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        // console.log('body', body);
        fnDone(null, JSON.parse(body));
      });
    });

    request.on('error', (error) => {
      fnDone(
        new Error(`Ошибка в работе сервера: ${error.name} \n ${error.message}`)
      );
    });
  } catch (error) {
    fnDone(
      new Error(`Ошибка работы сервера: ${error.name} \n ${error.message}`)
    );
  }
}
