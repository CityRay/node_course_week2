const headers = require('./headers');

const handleResponse = (
  res,
  status = 200,
  data,
  message = '',
  error = null
) => {
  let response = {};
  if (error) {
    response = JSON.stringify({
      message,
      error
    });
  } else {
    response = JSON.stringify({
      data,
      message
    });
  }

  res.writeHead(status, headers);
  res.write(response);
  res.end();
};

module.exports = handleResponse;
