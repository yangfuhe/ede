const Router = require('koa-router');

const cos = require('../controllers/cos')
    //const Auth = require("../middleware/auth")
const router = Router({
    prefix: '/cos',
});


router.get('/querySign', cos.querySign);


module.exports = router;