const validateResponse = (response) => {
  if (!response.ok) {
    throw Error(response);
  }

  return response;
};

export default validateResponse;