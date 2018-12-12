const { getResponse } = require('../helpers');

const updateHistory = async ctx => {
    let { stuId, courseId, videoId, initTime } = ctx.request.body;
    let course = await _videoModel.course.findOne({ _id: courseId })
    let video = await _videoModel.video.findOne({ _id: videoId })
    await _videoModel.history.update({ courseId, stuId }, {
        $set: {
            stuId,
            courseId,
            courseName: course.name,
            courseImg: course.imgUrl,
            videoId: video._id,
            videoName: video.name,
            initTime,
            updateTime: new Date()
        }
    }, { upsert: true })
    ctx.body = getResponse(true);
}
module.exports = {
    updateHistory
}