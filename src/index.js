const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const views = require('koa-views')
const session = require("koa-session")
const static = require('koa-static');
const koaBody = require('koa-body');
const router = require('./routes')
const MongoStore = require('../config/mongoStore')
const path = require('path')


const app = new Koa()
    // 服务器log文件
app.use(logger())
    //app.use(bodyParser({}))
app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, '../temp'),
        maxFileSize: 2 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
        // onFileBegin: (name, file) => {
        //     const dir = path.join(__dirname, `temp`);
        //     file.path = `${dir}/${name}`;
        // },
    }
}));
app.use(static(path.join(__dirname, '../static')))
app.use(views(process.env.NODE_ENV !== 'development' ? '' : __dirname + '/view', {
    map: {
        html: 'lodash'
    }
}));
app.use(session({
    key: 'koa_sess',
    store: new MongoStore(),
    maxAge: 1000 * 60 * 5,
    rolling: true,
    signed: false,
}, app))
global._videoModel = require('./model_video')
app.use(router.routes(), router.allowedMethods())



app.listen("6660", function() {
    console.log('监听6660端口')
})