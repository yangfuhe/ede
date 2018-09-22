const Router = require('koa-router')

const tag = require('../controllers/tag')
    //const Auth = require("../middleware/auth")
const router = Router({
    prefix: '/tag'
})
router.post('/queryTags', tag.queryTags)

router.post('/addCategory', tag.addCategory)

router.post('/removeCategory', tag.removeCategory)

router.post('/modifyCategory', tag.modifyCategory)

router.post('/addTag', tag.addTag)

router.post('/removeTag', tag.removeTag)

router.post('/modifyTag', tag.modifyTag)


module.exports = router