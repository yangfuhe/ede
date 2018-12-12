//课程相关

let path = require('path');
let fs = require('fs');
let uuidv1 = require('uuid/v1');
const { getResponse } = require('../helpers');


const queryVideos = async ctx => {
    let { courseId, stuId } = ctx.request.query;
    let videos = await _videoModel.video.find({ courseId }).sort({ sort: 1 });
    let history = await _videoModel.history.findOne({ courseId, stuId });
    let playing = 0;
    let initTime = 0;
    if (history && videos.length) {
        for (let i in videos) {
            let v = videos[i]
            if (history.videoId == v._id) {
                playing = +i;
                console.log(v)
                initTime = history.initTime;
            }
        }
    }
    ctx.body = getResponse(true, { videos, playing, initTime });
}

const videoUpload = async ctx => {
    let { name, url, courseId, size, duration } = ctx.request.body;
    let sort = 1;
    let video = await _videoModel.video.find({ courseId }).sort({ sort: -1 }).limit(1)
    if (video.length) {
        sort = video[0].sort + 1
    }
    url = 'https://' + url;
    await _videoModel.video.create({
        courseId,
        sort,
        name,
        url,
        size,
        duration,
        createTime: new Date(),
    })
    await _videoModel.course.update({ _id: courseId }, { $set: { upload: true } })
    let videos = await _videoModel.video.find({ courseId }).sort({ sort: 1 })
    ctx.body = getResponse(true, videos);
};

const sortUp = async ctx => {
    let { _id, courseId } = ctx.request.body;
    let downVideo = await _videoModel.video.findOne({ _id })
    let video = await _videoModel.video.find({ sort: { $lt: downVideo.sort } }).sort({ sort: -1 }).limit(1)
    if (video.length) {
        let upVideo = video[0]
        await _videoModel.video.update({ _id }, { $set: { sort: upVideo.sort } })
        await _videoModel.video.update({ _id: upVideo._id }, { $set: { sort: downVideo.sort } })
    }
    let videos = await _videoModel.video.find({ courseId }).sort({ sort: 1 })
    ctx.body = getResponse(true, videos);
}

const removeVideo = async ctx => {
    let { _ids, courseId } = ctx.request.body;
    let result = await _videoModel.video.find({ _id: { $in: _ids } });
    await _videoModel.video.remove({ _id: { $in: _ids } });
    let videos = await _videoModel.video.find({ courseId }).sort({ sort: 1 })
    ctx.body = getResponse(true, videos);
}

const modifyVideo = async ctx => {
    let { _id, name, courseId } = ctx.request.body;
    await _videoModel.video.update({ _id }, { $set: { name } });
    let videos = await _videoModel.video.find({ courseId }).sort({ sort: 1 })
    ctx.body = getResponse(true, videos);
}
module.exports = {
    queryVideos,
    videoUpload,
    sortUp,
    removeVideo,
    modifyVideo
};