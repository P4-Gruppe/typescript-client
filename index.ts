const API_URL = 'http://sg4os4okwcs00s8sowww0wco.138.2.151.42.sslip.io';

async function fetchData(): Promise<void> {
  try {
    const response = await fetch(API_URL);
    const text = await response.text();
     
    console.log('API Response:', text);
  } catch (error) {
     
    console.error('Error fetching data:', error);
  }
}

fetchData();