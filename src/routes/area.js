const Router = require('koa-router');

const area = require('../controllers/area');
//const Auth = require("../middleware/auth")
const router = Router({
    prefix: '/area',
});


router.post('/queryArea', area.queryArea);


module.exports = router;