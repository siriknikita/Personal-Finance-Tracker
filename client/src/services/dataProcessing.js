async function fetchData(url, key) {
  const response = await fetch(
    `${process.env.REACT_APP_API_BASE_URL}/api/${url}`,
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

async function sendPostData(url, data, key) {
  const response = await fetch(
    `${process.env.REACT_APP_API_BASE_URL}/api/${url}`,
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

module.exports = {
  fetchData,
  sendPostData,
};
