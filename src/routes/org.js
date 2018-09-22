const Router = require('koa-router')

const org = require('../controllers/org')
    //const Auth = require("../middleware/auth")
const router = Router({
    prefix: '/org'
})
router.get('/checkUserName', org.checkUserName)

router.get('/checkTel', org.checkTel)

router.post('/register', org.register)

router.post('/login', org.login)

router.get('/querySmsCode', org.querySmsCode)
module.exports = router