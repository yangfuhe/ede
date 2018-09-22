const development = require('./development');
const production = require('./production');
const opts = process.env.NODE_ENV === 'production' ? production : development;
const { url, db, collection, maxAge, options } = opts.session
const { MongoClient } = require("mongodb");
const log = console.log;
class MongoStore {
    constructor() {
        this.init();
    }

    async init() {
        try {
            this.client = await MongoClient.connect(url, options);
            this.db = await this.client.db(db);
            this.coll = await this.db.collection(collection)
            try {
                // 查看是否创建过索引
                await this.coll.indexExists(["session__idx"]);
                log('索引存在')
            } catch (e) {
                // 如果没有创建新的索引
                log('索引不存在')
                await this.coll.createIndex({ "expireTime": 1 }, { name: "session__idx", expireAfterSeconds: 0 });
            }
        } catch (e) {
            log(e.message);
        }
    }

    async get(key) {
        log('获取' + key)
        try {
            let doc = await this.coll.findOne({ sid: key });
            return doc ? doc.session : undefined;
        } catch (e) {
            log(e.message);
        }
    }

    async set(key, sess) {
        log('设置')
        var expireTime = new Date();
        var t_s = expireTime.getTime();

        expireTime.setTime(t_s + maxAge);
        try {
            await this.coll.updateOne({ "sid": key }, {
                $set: {
                    "sid": key,
                    "session": sess,
                    expireTime,
                }
            }, { upsert: true });
        } catch (e) {
            log(e.message);
        }
        return key;
    }

    async destroy(sid) {
        try {
            await this.coll.deleteOne({ sid: sid });
        } catch (e) {
            log(e.message);
        }
    }
}

module.exports = MongoStore;