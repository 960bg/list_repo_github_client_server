main();

async function main() {
  // 0. инициализация приложения:
  //   а. добавить события на ввод пользователя
  initApp();
  // 1. запросить список репозиториев github по имени пользователя
  // 2. проверить ответ сервера github
  // 3. вывести список репо с github пользователя
}

// запрос серверу
function request(data = { username: '', page: 1 }) {
  return new Promise((resolve, reject) => {
    try {
      fetch('http://localhost:3000', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then((response) => {
          console.log('response', response);
          const text = response.text();
          console.log('response.text()', text);

          // return response;
          return text;
        })
        .then((done) => {
          resolve(done);
          console.log('resolve(done);', done);
        });
    } catch (error) {
      console.error('Ошибка запроса', error);
      reject(error);
    }
  });
}

function createLiElement(text) {
  const li = document.createElement('li');
  li.classList.add('listRepo__item');
  li.innerText = text;
  return li;
}

// 0. инициализация приложения:
//   а. добавить события на ввод пользователя
function initApp() {
  const inputUserNameHTML = document.querySelector('.inputUserName');
  // обработка имени пользователя в инпут по нажатию Enter
  inputUserNameHTML.addEventListener('keydown', inputKeydown);
}

// // ввод текста в поле для имени пользователя
function inputKeydown(event) {
  if (event.key === 'Enter') {
    inputKeydownEnter(event);
  }
}

// ввод имени пользователя в инпут и  нажатие Enter
async function inputKeydownEnter(event) {
  // проверить ввод прользователя
  if (!checkInputUsername(event.target.value)) {
    console.log('event');
    console.log(event);
    return;
  }

  // вставить список репо из гихаб по имени пользователя
  insertListRepoGithub(event.target.value);
}

// проверка введенных данных имени пользователя
function checkInputUsername(userInput) {
  if (userInput.trim() === '') {
    return false;
  }
  return true;
}

// получить  список репо из гитхаб
async function getListReposGithub(bodyRequest) {
  // запросить список репозиториев по имени пользователя
  const responseGit = JSON.parse(await request(bodyRequest));
  responseGit.repos = JSON.parse(responseGit.repos);
  // ...... responseGit = {
  // ......    statusCode: res.statusCode,
  // ......    statusMessage: res.statusMessage,
  // ......    repos: body, тут массив объектов репозиториев уложенных JSON.stringify()
  // ......  };

  console.log('responseGit.statusCode', responseGit.statusCode);

  return responseGit;
}

// вставить список репо из гихаб
async function insertListRepoGithub(username) {
  const bodyRequest = {
    username: username,
    page: 1,
  };

  const listRepoHTML = document.querySelector('.listRepo');
  // очистить список репо
  listRepoHTML.innerHTML = '';

  // запросить список репо из гитхаб
  const responseGit = await getListReposGithub(bodyRequest);

  // проверить ответ сервера gitHub
  if (!checkRequestGithub(responseGit)) {
    listRepoHTML.append(
      createLiElement(`Код ответа сервера gitHub: ${responseGit.statusCode}`)
    );
    listRepoHTML.append(
      createLiElement(
        `Сообщение ответа сервера gitHub: ${responseGit.statusMessage}`
      )
    );
    return;
  }

  // проверить содержимое листрепо на наличие репо и кол-во репо
  if (!checkListRepos(responseGit)) {
    listRepoHTML.append(createLiElement('Публичные репозитории не найдены'));
    console.log('Публичных репозиториев нет');
    return;
  }

  // добавление списка репозиториев на страницу
  addListRepoOnPage(responseGit, bodyRequest, listRepoHTML);
}

// проверить содержимое листрепо на наличие репо и кол-во репо
function checkListRepos(responseGit) {
  if (responseGit.repos.length === 0) {
    return false;
  }
  return true;
}

function checkRequestGithub(responseGit) {
  // проверить ответ сервера gitHub
  if (responseGit.statusCode !== 200) {
    return false;
  }
  return true;
}

// добавление списка репозиториев на страницу
function addListRepoOnPage(responseGit, bodyRequest, htmlEl) {
  console.log('responseGit');
  console.log(responseGit);
  console.log('responseGit.repos');
  console.log(responseGit.repos);

  // добавление списка репозиториев на страницу
  addListRepoInHTML(responseGit, htmlEl);

  // получение новых страниц (1 стр = 30 записям) репозиториев
  // если в первой стр вернулось 30 записей то может существовать и другие страницы
  // Частный случай если у пользователя всего 30 репо
  // тогда в первой странице вернется 30 репо а при
  // запросе на след страницу список будет пуст
  let lengthRepos = responseGit.repos.length;
  console.log('lengthRepos ===', lengthRepos);

  for (let i = 0; i < 4; i++) {
    if (lengthRepos === 30) {
      bodyRequest.page += 1;
      console.log('Страница', bodyRequest.page);

      let tempRepoResponseGit = getListReposGithub(bodyRequest);

      lengthRepos = tempRepoResponseGit.repos.length;
      console.log('tempRepoResponseGit.repos');
      console.log(tempRepoResponseGit.repos);

      console.log('lengthRepos', lengthRepos);

      // добавление списка репозиториев на страницу
      addListRepoInHTML(tempRepoResponseGit, htmlEl);
    }
  }
}

function addListRepoInHTML(responseGit, htmlEl) {
  responseGit.repos.forEach((repo, index) => {
    console.log(`[${index + 1}]`, repo.name);

    htmlEl.append(createLiElement(repo.name));
  });
}
