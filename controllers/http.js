const headers = require('../helpers/headers');
const handleResponse = require('../helpers/handleResponse');

const http = {
  cors(req, res) {
    res.writeHead(200, headers);
    res.end();
  },
  notFound(req, res) {
    handleResponse(res, 404, null, 'Not Found! 找不到此頁面!');
  }
};

module.exports = http;
