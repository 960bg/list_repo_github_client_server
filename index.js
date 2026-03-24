// todo

// - проработать проверку ввода имени пользователя
// - создание карточек с именем пользователя и списком репо
// - фото пользователя на карточке
// - рейтинг по кол-ву репо среди запрошенных пользователей гитхаб
// - авторизация
// - авторизация с капчей
// - сохранение запрошенных пользователей гитхаб и их репо
// - оплата картой

//

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
async function request(data = { username: '', page: 1 }) {
  const URL = 'http://localhost:3000';
  const OPTIONS = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };
  // return new Promise( async (resolve, reject) => {
  try {
    const response = await fetch(URL, OPTIONS);

    if (!response.ok) {
      throw new Error(
        `Ошибка запроса на наш сервер: ${response.status},  headers: ${response.headers}`
      );
    }
    const repos = await response.text();
    return repos;
  } catch (error) {
    console.error('Ошибка запроса на наш сервер', error);
  }
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

/**
 * вставить список репо из гихаб
 * @param {string} username - имя пользлвателя гитхаб
 */
async function insertListRepoGithub(username) {
  /**
   * @typedef {Object} bodyRequest - объект для запроса на сервер, передает имя пользователя и номер нужной страницы
   * @property {string} username - username,
   * @property {number} page - номер страницы,
   */
  const bodyRequest = {
    username: username,
    page: 1,
  };

  const listRepoHTML = document.querySelector('.listRepo');
  // очистить список репо
  listRepoHTML.innerHTML = '';

  // добавление списка репозиториев на страницу
  addListRepoOnPage(bodyRequest, listRepoHTML);
}

// проверить содержимое листрепо на наличие репо и кол-во репо
function checkListRepos(responseGit) {
  try {
    if (responseGit.repos.length === 0) {
      return false;
    }
    return true;
  } catch (err) {
    console.error('Ошибка при провеоке содержимого списка репозиториев', err);

    return false;
  }
}

function checkRequestGithub(responseGit) {
  // проверить ответ сервера gitHub
  if (responseGit.statusCode !== 200) {
    return false;
  }
  return true;
}

/**
 * Получение и Добавление списка репозиториев на страницу
 * @param {bodyRequest} bodyRequest - объект для запроса на сервер, передает имя пользователя и номер нужной страницы
 * @param {HTMLElement} htmlEl - html элемент куда вставить список репозиториев
 */
async function addListRepoOnPage(bodyRequest, htmlEl) {
  // получение новых страниц (1 стр = 30 записям) репозиториев
  // если в первой стр вернулось 30 записей то может существовать и другие страницы
  // Частный случай если у пользователя всего 30 репо
  // тогда в первой странице вернется 30 репо а при
  // запросе на след страницу список будет пуст
  // console.log('lengthRepos ===', lengthRepos);

  // let lengthRepos = responseGit.repos.length;
  let lengthRepos;
  do {
    // запросить список репо из гитхаб
    let responseGit = await getListReposGithub(bodyRequest);
    lengthRepos = responseGit.repos.length;

    console.log('Страница', bodyRequest.page);
    console.log('lengthRepos', lengthRepos);

    // проверить ответ сервера gitHub
    if (!checkRequestGithub(responseGit)) {
      htmlEl.append(
        createLiElement(`Код ответа сервера gitHub: ${responseGit.statusCode}`)
      );
      htmlEl.append(
        createLiElement(
          `Сообщение ответа сервера gitHub: ${responseGit.statusMessage}`
        )
      );
      return;
    }

    // проверить содержимое листрепо на наличие репо и кол-во репо
    if (!checkListRepos(responseGit) && bodyRequest.page === 1) {
      htmlEl.append(createLiElement('Публичные репозитории не найдены'));
      console.log('Публичных репозиториев нет');
      return;
    }

    // добавление списка репозиториев на страницу
    addListRepoInHTML(responseGit, htmlEl);
    bodyRequest.page += 1;
  } while (lengthRepos === 30);
}

function addListRepoInHTML(responseGit, htmlEl) {
  responseGit.repos.forEach((repo, index) => {
    console.log(`[${index + 1}]`, repo.name);

    htmlEl.append(createLiElement(repo.name));
  });
}
