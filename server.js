const http = require('http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const headers = require('./helpers/headers');
const handleResponse = require('./helpers/handleResponse');
const Post = require('./models/post');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

// 連接資料庫
mongoose
  .connect(DB)
  .then(() => console.log('資料庫連接成功'))
  .catch((err) => console.error('資料庫連接失敗: ', err.message));

// Api 處理
const requestListener = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  // 取得全部文章
  if (req.url === '/posts' && req.method === 'GET') {
    const posts = await Post.find();
    handleResponse(res, 200, posts, '取得成功');
    return;
  }

  // 新增文章
  if (req.url === '/post' && req.method === 'POST') {
    req.on('end', async () => {
      try {
        const postData = JSON.parse(body);

        if (postData && postData.title && postData.content) {
          const newPost = await Post.create(postData);
          handleResponse(res, 200, newPost, '新增成功');
        } else {
          throw new Error('請確認欄位是否填寫完整');
        }
      } catch (error) {
        console.error(error);
        handleResponse(res, 400, null, error.message, error);
      }
    });

    return;
  }

  // 刪除單一文章
  if (req.url.startsWith('/post/') && req.method === 'DELETE') {
    try {
      const _id = req.url.split('/').pop();
      if (!_id) {
        throw new Error('ID is required');
      }

      await Post.findByIdAndDelete(_id);
      handleResponse(res, 200, [], '刪除成功');
    } catch (error) {
      console.error(error);
      handleResponse(res, 400, null, error.message, error);
    }
    return;
  }

  // 更新單一文章
  if (req.url.startsWith('/post/') && req.method === 'PATCH') {
    req.on('end', async () => {
      try {
        const _id = req.url.split('/').pop();
        if (!_id) {
          throw new Error('ID is required');
        }

        const postData = JSON.parse(body);
        const updatePost = await Post.findByIdAndUpdate(_id, postData);
        handleResponse(res, 200, { _id: updatePost._id }, '更新成功');
      } catch (error) {
        console.error(error);
        handleResponse(res, 400, null, error.message, error);
      }
    });

    return;
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
    return;
  }

  handleResponse(res, 404, null, 'Not Found');
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3001);
