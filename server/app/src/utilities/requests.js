const route = (parseInt(process.env.FETCH_WITH_PORT) == 1)
  ? `${process.env.WEB_PROTOCOL}://${process.env.SERVER_HOST}:${process.env.API_PORT}`
  : `${process.env.WEB_PROTOCOL}://${process.env.SERVER_HOST}`;

export function HttpPost(path, body, stringify=true, headers=true)
{
  return fetch(`${route}${path}`, {
    method: 'POST',
    headers: headers ? {'Content-Type': 'application/json'} : {},
    body: stringify ? JSON.stringify(body) : body,
  })
  .catch((error) => {
    console.log(error);
  });
}

export function HttpGet(path)
{
  return fetch(`${route}${path}`, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  })
  .catch((error) => {
    console.log(error);
  });
}