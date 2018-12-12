/**
 * LOCAL 本地开发
 */

const mongoUri = "mongodb://127.0.0.1:27017";
module.exports = {
    cosBucket: 'kaifa',
    mongoUri,
    mongoUriParam: "authSource=admin",
    // 存放session的库和表配置
    session: {
        url: mongoUri,
        db: 'video',
        collection: "session",
        // 这里设置的是数据库session定期清除的时间，与cookie的过期时间应保持一致，cookie由浏览器负责定时清除，需要注意的是索引一旦建立修改的时候需要删除旧的索引。此处的时间是秒为单位，cookie的maxAge是毫秒为单位
        maxAge: 1000 * 60 * 5,
        options: { useNewUrlParser: true }
    },
};