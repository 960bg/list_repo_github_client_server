main();

async function main() {
  const inputUserNameHTML = document.querySelector('.inputUserName');
  const listRepoHTML = document.querySelector('.listRepo');
  console.log('inputUserNameHTML', inputUserNameHTML);

  inputUserNameHTML.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
      // console.log('event', event);
      console.log('inputUserNameHTML.textContent', inputUserNameHTML.value);

      const repos = JSON.parse(await request(inputUserNameHTML.value));
      listRepoHTML.innerHTML = '';
      repos.forEach((repo, index) => {
        console.log(`[${index + 1}]`, repo.name);
        const li = addItemList(repo.name);
        listRepoHTML.append(li);
      });
    }
  });
}

function request(data = '') {
  return new Promise((resolve, reject) => {
    try {
      console.log('JSON.stringify(data)', data);

      fetch('http://localhost:3000', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
      })
        .then((response) => {
          console.log('response', response);

          // return response;
          return response.text();
        })
        .then((done) => {
          console.log('done');
          console.dir(done);
          resolve(done);
        });
    } catch (error) {
      console.error('Ошибка запроса', error);
      reject(error);
    }
  });
}

function addItemList(text) {
  const li = document.createElement('li');
  li.classList.add('listRepo__item');
  li.innerText = text;
  return li;
}
