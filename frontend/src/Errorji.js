function dobiError(error) {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
}
export default dobiError;
