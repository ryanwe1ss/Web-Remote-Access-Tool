import RequestQueue from './request-queue.js';

const requestQueue = new RequestQueue();
const route = (parseInt(process.env.FETCH_WITH_PORT) == 1)
  ? `${process.env.WEB_PROTOCOL}://${process.env.SERVER_HOST}:${process.env.API_PORT}`
  : `${process.env.WEB_PROTOCOL}://${process.env.SERVER_HOST}`;

export function HttpPost(path, body, stringify = true, headers = true) {
  return new Promise((resolve, reject) => {
    const requestFn = async () => {
      EnableOrDisableButtons();
      try {
        const response = await fetch(`${route}${path}`, {
          method: 'POST',
          headers: headers ? { 'Content-Type': 'application/json' } : {},
          body: stringify ? JSON.stringify(body) : body,
        });
        EnableOrDisableButtons(false);
        resolve(response);
      } catch (error) {
        EnableOrDisableButtons(false);
        console.log(error);
        reject(error);
      }
    };

    requestQueue.enqueue(requestFn);
  });
}

export function HttpGet(path, headers = true) {
  return new Promise((resolve, reject) => {
    const requestFn = async () => {
      EnableOrDisableButtons();
      try {
        const response = await fetch(`${route}${path}`, {
          method: 'GET',
          headers: headers ? { 'Content-Type': 'application/json' } : {},
        });
        EnableOrDisableButtons(false);
        resolve(response);
      } catch (error) {
        EnableOrDisableButtons(false);
        console.log(error);
        reject(error);
      }
    };

    requestQueue.enqueue(requestFn);
  });
}

function EnableOrDisableButtons(disable=true)
{
  const buttons = document.querySelectorAll('button');
  const selects = document.querySelectorAll('select');
  const inputs = document.querySelectorAll('input[type="button"]');
  const elements = [...buttons, ...inputs, ...selects];

  elements.forEach((element) => {
    element.disabled = disable;
  });
}