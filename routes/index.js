const HttpControllers = require('../controllers/http');
const PostsControllers = require('../controllers/posts');

// Api Routes 處理
const routes = async (req, res) => {
  const { url, method } = req;

  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  // 取得全部文章
  if (url === '/posts' && method === 'GET') {
    PostsControllers.getPosts({ req, res });
    return;
  }

  // 新增文章
  if (url === '/post' && method === 'POST') {
    req.on('end', async () => PostsControllers.createPost({ req, res, body }));
    return;
  }

  // 刪除全部文章
  if (url === '/posts' && method === 'DELETE') {
    req.on('end', async () => PostsControllers.deleteAllPost({ req, res }));
    return;
  }

  // 刪除文章
  if (url.startsWith('/post/') && method === 'DELETE') {
    PostsControllers.deletePost({ req, res });
    return;
  }

  // 更新文章
  if (url.startsWith('/post/') && method === 'PATCH') {
    req.on('end', async () => PostsControllers.updatePost({ req, res, body }));
    return;
  }

  if (method === 'OPTIONS') {
    HttpControllers.cors(req, res);
    return;
  }

  HttpControllers.notFound(req, res);
};

module.exports = routes;
