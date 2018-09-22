const Router = require('koa-router');

const course = require('../controllers/course');
//const Auth = require("../middleware/auth")
const router = Router({
    prefix: '/course',
});
router.post('/uploadImg', course.uploadImg);

router.post('/addCourse', course.addCourse);

router.post('/removeCourse', course.removeCourse);

router.get('/queryCourse', course.queryCourse);

router.get('/courseDetail', course.courseDetail);

router.post('/modifyCourseImg', course.modifyCourseImg);

router.post('/modifyCourse', course.modifyCourse);

router.get('/queryLunbo', course.queryLunbo);

router.get('/queryTuijianCourse', course.queryTuijianCourse);

router.post('/queryCourseList', course.queryCourseList);

router.get('/tokenn', course.checkToken);

module.exports = router;