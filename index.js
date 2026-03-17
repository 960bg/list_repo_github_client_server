main();

async function main() {
  const inputUserNameHTML = document.querySelector('.inputUserName');
  const listRepoHTML = document.querySelector('.contanerListRepo');
  console.log('inputUserNameHTML', inputUserNameHTML);

  inputUserNameHTML.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
      // console.log('event', event);
      console.log('inputUserNameHTML.textContent', inputUserNameHTML.value);

      const req = await request([inputUserNameHTML.value]);
      listRepoHTML.textContent = req;
    }
  });
}

function request(data = [{}]) {
  return new Promise((resolve, reject) => {
    try {
      console.log('JSON.stringify(data)', JSON.stringify(data));

      fetch('http://localhost:3000', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then((response) => {
          console.log('response', response);
          return response.json();
        })
        .then((done) => {
          console.log('done', done);
          resolve(done);
        });
    } catch (error) {
      console.error('Ошибка запроса', error);
      reject(error);
    }
  });
}
