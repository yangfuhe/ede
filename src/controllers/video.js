//课程相关

let path = require('path');
let fs = require('fs');
let uuidv1 = require('uuid/v1');
const { getResponse } = require('../helpers');


const queryVideos = async ctx => {
    let { courseId } = ctx.request.query;
    let videos = await _videoModel.video.find({ courseId }).sort({ sort: 1 })
    ctx.body = getResponse(true, videos);
}

const videoUpload = async ctx => {
    let file = ctx.request.files.file;
    let { name, total, index, uuid, courseId, size } = ctx.request.body;
    let tempUrl = path.join(__dirname, '../../') + 'temp/' + uuid;
    await fs.renameSync(file.path, tempUrl + index);
    if (index === total) {
        let fag = fs.existsSync(path.join(__dirname, '../../') + 'static/api/video');
        if (!fag) fs.mkdirSync(path.join(__dirname, '../../') + 'static/api/video');
        let url = '/api/video/' + uuid + name.substr(name.lastIndexOf('.'));
        let pathname =
            path.join(__dirname, '../../') +
            'static' + url;
        var writeStream = fs.createWriteStream(pathname);
        for (let i = 1; i <= total; i++) {
            let readPath = tempUrl + i;
            let data = await new Promise(function(resolve, reject) {
                fs.readFile(readPath, function(error, data) {
                    if (error) reject(error);
                    resolve(data);
                });
            });
            writeStream.write(data);
            fs.unlink(readPath, () => {});
        }
        writeStream.end();
        let sort = 1;
        let video = await _videoModel.video.find({ courseId }).sort({ sort: -1 }).limit(1)
        if (video.length) {
            sort = video[0].sort + 1
        }
        await _videoModel.video.create({
            courseId,
            sort,
            name: name.substr(0, name.lastIndexOf('.')),
            url,
            size,
            createTime: new Date(),
        })
        ctx.body = getResponse(true, { code: 2, msg: '成功' });
    } else {
        ctx.body = getResponse(true, { code: 1, msg: '继续上传' });
    }
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
    for (let r of result) {
        let pathname = path.join(__dirname, '../../') + 'static' + r.url;
        fs.unlink(pathname);
    }
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