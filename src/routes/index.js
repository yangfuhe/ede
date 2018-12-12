const Router = require("koa-router");

const course = require("./course");
const tag = require("./tag");
const video = require("./video");
const org = require("./org");
const stu = require("./stu");
const area = require("./area");
const ueditor = require("./ueditor");
const cos = require("./cos");
const history = require("./history");
const router = Router({
    prefix: '/api'
});

const routes = [
    course,
    tag,
    video,
    org,
    stu,
    area,
    ueditor,
    cos,
    history
];

for (route of routes) {
    router.use(route.routes(), route.allowedMethods());
}

module.exports = router;