const handleResponse = require('../helpers/handleResponse');
const Post = require('../models/post');

const posts = {
  // 取得全部文章
  async getPosts({ req, res }) {
    const posts = await Post.find();
    handleResponse(res, 200, posts, '取得成功');
  },
  // 新增文章
  async createPost({ req, res, body }) {
    try {
      const postData = JSON.parse(body);

      if (
        postData &&
        postData.name.trim() &&
        postData.title.trim() &&
        postData.content.trim()
      ) {
        const newPost = await Post.create(postData);
        handleResponse(res, 200, newPost, '新增成功');
      } else {
        throw new Error('請確認欄位是否填寫完整');
      }
    } catch (error) {
      console.error(error);
      handleResponse(res, 400, null, error.message, error);
    }
  },
  // 更新文章
  async updatePost({ req, res, body }) {
    try {
      const _id = req.url.split('/').pop();
      if (!_id) {
        throw new Error('ID is required');
      }

      const checkId = await Post.findById(_id);
      if (!checkId) {
        throw new Error('ID not found');
      }

      const postData = JSON.parse(body);

      if (
        postData &&
        postData.title &&
        postData.title.trim() &&
        postData.content &&
        postData.content.trim()
      ) {
        const updatePost = await Post.findByIdAndUpdate(_id, postData, {
          new: true
        });
        handleResponse(res, 200, updatePost, '更新成功');
      } else {
        throw new Error('「title」、「content」欄位是否填寫完整');
      }
    } catch (error) {
      console.error(error);
      handleResponse(res, 400, null, error.message, error);
    }
  },
  // 刪除文章
  async deletePost({ req, res }) {
    try {
      const _id = req.url.split('/').pop();
      if (!_id) {
        throw new Error('ID is required');
      }

      const checkId = await Post.findById(_id);
      if (!checkId) {
        throw new Error('ID not found');
      }

      await Post.findByIdAndDelete(_id);
      handleResponse(res, 200, [], '刪除成功');
    } catch (error) {
      console.error(error);
      handleResponse(res, 400, null, error.message, error);
    }
  },
  // 刪除全部文章
  async deleteAllPost({ req, res }) {
    await Post.deleteMany();
    handleResponse(res, 200, posts, '刪除成功');
  }
};

module.exports = posts;
