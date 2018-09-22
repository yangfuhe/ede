const Router = require('koa-router')

const stu = require('../controllers/stu')
    //const Auth = require("../middleware/auth")
const router = Router({
    prefix: '/stu'
})
router.get('/queryOpenid', stu.queryOpenid)

router.post('/wxLogin', stu.wxLogin)


module.exports = router