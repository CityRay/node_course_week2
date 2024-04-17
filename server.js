const http = require('http');
const routes = require('./routes');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// 連接 MongoDB
require('./connections/mongoose');

// Api 處理
const requestListener = async (req, res) => {
  routes(req, res);
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3001);
