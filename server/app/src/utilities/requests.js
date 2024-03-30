const route = (parseInt(process.env.FETCH_WITH_PORT) == 1)
  ? `${process.env.WEB_PROTOCOL}://${process.env.SERVER_HOST}:${process.env.API_PORT}`
  : `${process.env.WEB_PROTOCOL}://${process.env.SERVER_HOST}`;

export function HttpPost(path, body, stringify=true, headers=true)
{
  EnableOrDisableButtons();
  return fetch(`${route}${path}`, {
    method: 'POST',
    headers: headers ? {'Content-Type': 'application/json'} : {},
    body: stringify ? JSON.stringify(body) : body,
  })
  .then((response) => {
    EnableOrDisableButtons(false);
    return response;
  })
  .catch((error) => {
    console.log(error);
  });
}

export function HttpGet(path)
{
  EnableOrDisableButtons();
  return fetch(`${route}${path}`, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  })
  .then((response) => {
    EnableOrDisableButtons(false);
    return response;
  })
  .catch((error) => {
    console.log(error);
  });
}

function EnableOrDisableButtons(disable=true)
{
  const buttons = document.querySelectorAll('button');
  const inputs = document.querySelectorAll('input[type="button"]');
  const elements = [...buttons, ...inputs];

  elements.forEach((element) => {
    element.disabled = disable;
  });
}