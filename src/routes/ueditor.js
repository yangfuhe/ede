const Router = require('koa-router')
const ueditorTool = require('ueditor')
const path = require('path');
//const ueditor = require('koa2-ueditor-cos')
const ueditor = require('../controllers/ueditor')
    //const Auth = require("../middleware/auth")
const router = Router({
    prefix: '/ueditor'
})
router.all('/upload', ueditor('public', {
    "imageAllowFiles": [".png", ".jpg", ".jpeg"],
    "imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}" // 保存为原文件名
}, {
    Url: 'https://sts.api.qcloud.com/v2/index.php',
    Domain: 'sts.api.qcloud.com',
    SecretId: 'AKIDJYcVDvUq591jJlb95sTzKUkrwtftfmRu',
    SecretKey: 'Pky0ylNQRJFCya1HanpfJm39C6DByZ3N',
    AppId: 'YYYYYYYYYY',
    Bucket: 'kaifa-1257359776',
    Region: 'ap-shanghai'
}))


module.exports = router