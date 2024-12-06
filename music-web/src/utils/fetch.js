const returnContentByType = (response) => {
  if (response.headers.get('content-type').includes('json')) {
    return response.json();
  }
  return response.text();
};

export const fetchData = async (url, param) => {
  try {
    const response = await fetch(url, param);
    const data = await returnContentByType(response);
    if (data?.status === 'error') {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
