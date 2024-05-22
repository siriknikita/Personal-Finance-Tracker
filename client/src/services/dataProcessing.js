export async function fetchData(url, key) {
  const response = await fetch(
    `https://personal-finance-tracker-server.azurewebsites.net/api/${url}`
  );
  const data = await response.json();
  console.log("Fetched Data:", data);
  return data[key];
}

export async function sendPostData(url, data, key) {
  console.log("URL:", url);
  console.log("Data:", data);
  console.log("Key:", key);
  
  const response = await fetch(
    `https://personal-finance-tracker-server.azurewebsites.net/api/${url}`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    }
  );

  console.log("Response:", response);

  const returnedData = await response.json();
  return returnedData[key];
}
