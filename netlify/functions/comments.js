const fs = require("fs");
const path = require("path");

const commentsFile = path.join(__dirname, "comments.json");

// 确保 JSON 文件存在
if (!fs.existsSync(commentsFile)) {
  fs.writeFileSync(commentsFile, JSON.stringify([]));
}

exports.handler = async (event) => {
  if (event.httpMethod === "GET") {
    // 读取留言列表
    const comments = JSON.parse(fs.readFileSync(commentsFile, "utf-8"));
    return {
      statusCode: 200,
      body: JSON.stringify(comments),
      headers: { "Content-Type": "application/json" },
    };
  }

  if (event.httpMethod === "POST") {
    try {
      const { name, message } = JSON.parse(event.body);
      if (!name || !message) {
        return { statusCode: 400, body: "Name and message are required!" };
      }

      // 读取旧留言
      const comments = JSON.parse(fs.readFileSync(commentsFile, "utf-8"));
      const newComment = { id: Date.now(), name, message, time: new Date().toISOString() };
      comments.push(newComment);

      // 写入 JSON 文件
      fs.writeFileSync(commentsFile, JSON.stringify(comments, null, 2));

      return {
        statusCode: 201,
        body: JSON.stringify(newComment),
        headers: { "Content-Type": "application/json" },
      };
    } catch (error) {
      return { statusCode: 500, body: "Server error!" };
    }
  }

  return { statusCode: 405, body: "Method Not Allowed" };
};
