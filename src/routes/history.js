const Router = require('koa-router');

const history = require('../controllers/history');
//const Auth = require("../middleware/auth")
const router = Router({
    prefix: '/history',
});

router.post('/updateHistory', history.updateHistory);

module.exports = router;