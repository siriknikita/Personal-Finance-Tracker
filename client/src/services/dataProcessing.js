export async function fetchData(url, key) {
  const response = await fetch(
    `https://personal-finance-tracker-server.azurewebsites.net/api/${url}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache",
      },
      mode: "cors",
      credentials: "include",
    }
  );

  const returnedData = await response.json();
  return returnedData[key];
}

export async function sendPostData(url, data, key) {
  const response = await fetch(
    `https://personal-finance-tracker-server.azurewebsites.net/api/${url}`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache",
      },
      mode: "cors",
      credentials: "include",
    }
  );

  const returnedData = await response.json();
  return returnedData[key];
}
