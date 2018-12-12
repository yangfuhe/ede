const Router = require('koa-router')

const video = require('../controllers/video')
const { wxLogin } = require('../helpers');
//const Auth = require("../middleware/auth")
const router = Router({
    prefix: '/video'
})

router.get('/queryVideos', video.queryVideos)

router.post('/videoUpload', video.videoUpload)

router.post('/sortUp', video.sortUp)

router.post('/removeVideo', video.removeVideo)

router.post('/modifyVideo', video.modifyVideo)
module.exports = router