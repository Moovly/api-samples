const validateResponse = (response) => {
  if (!response.ok) {
    throw new Error('Bad');
  }

  return response;
};

export default validateResponse;