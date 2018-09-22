//课程相关

let path = require('path');
let fs = require('fs');
let uuidv1 = require('uuid/v1');
const { getResponse } = require('../helpers');

const uploadImg = async ctx => {
    let file = ctx.request.files.file;
    let orgId = ctx.session.orgId;
    let url = path.join(__dirname, '../../') + 'temp/' + orgId;
    await fs.renameSync(file.path, url);
    ctx.body = getResponse(true);
};

const addCourse = async ctx => {
    let { name, fileName, type, tags } = ctx.request.body;
    if (!name || !fileName || !type || !tags || (type !== 1 && type !== 2)) {
        ctx.body = getResponse(false, 'e001');
    }
    let orgId = ctx.session.orgId;
    let suffix = fileName.substr(fileName.lastIndexOf('.'));
    let url = path.join(__dirname, '../../') + 'temp/' + orgId;
    let imgUrl = '/api/img/' + uuidv1() + suffix;
    let newUrl = path.join(__dirname, '../../') + 'static' + imgUrl;
    //let exist = fs.existsSync(address);
    let fag1 = fs.existsSync(path.join(__dirname, '../../') + 'static');
    if (!fag1) fs.mkdirSync(path.join(__dirname, '../../') + 'static');
    let fag2 = fs.existsSync(path.join(__dirname, '../../') + 'static/api');
    if (!fag2) fs.mkdirSync(path.join(__dirname, '../../') + 'static/api');
    let fag3 = fs.existsSync(path.join(__dirname, '../../') + 'static/api/img');
    if (!fag3) fs.mkdirSync(path.join(__dirname, '../../') + 'static/api/img');

    await fs.renameSync(url, newUrl);
    let org = await _videoModel.org.findOne({ _id: orgId }).lean()
    let course = await _videoModel.course.create({
        name,
        imgUrl,
        type,
        orgId,
        tags,
        createTime: new Date(),
        orgName: org.name,
        ...org,
        province: org.province
    });
    ctx.body = getResponse(true, course._id);
};

const queryCourse = async ctx => {
    let { name, type } = ctx.request.query;
    let orgId = ctx.session.orgId;
    let query = {};
    if (name) query.name = { $regex: name };
    if (type) query.type = type;
    query.orgId = orgId;
    let courses = await _videoModel.course.find(query);
    ctx.body = getResponse(true, courses);
};

const removeCourse = async ctx => {
    let { _id, name, type } = ctx.request.body;
    let orgId = ctx.session.orgId;
    await _videoModel.course.remove({ _id });
    let query = {};
    if (name) query.name = { $regex: name };
    if (type) query.type = type;
    query.orgId = orgId;
    let courses = await _videoModel.course.find(query);
    ctx.body = getResponse(true, courses);

}

const modifyCourseImg = async ctx => {
    let file = ctx.request.files.file;
    let orgId = ctx.session.orgId;
    let suffix = file.name.substr(file.name.lastIndexOf('.'));
    let fileName = 'modifyCourseImg' + orgId + suffix;
    let url = path.join(__dirname, '../../') + 'temp/' + fileName;
    await fs.renameSync(file.path, url);
    ctx.body = getResponse(true, fileName);
}

const modifyCourse = async ctx => {
    let { _id, name, fileName, type, tags } = ctx.request.body;
    let params = { name, type, tags }
    if (fileName) {
        let course = await _videoModel.course.findOne({ _id })
        let odlPath = path.join(__dirname, '../../') + 'temp/' + fileName;
        let suffix = fileName.substr(fileName.lastIndexOf('.'));
        let newPath = path.join(__dirname, '../../') + 'static/api/img/' + uuidv1() + suffix;
        await fs.renameSync(odlPath, newPath);
        let dataPth = path.join(__dirname, '../../') + 'static' + course.imgUrl
        fs.unlink(dataPth, () => {});
        params.imgUrl = "/api/img/" + fileName;
    }
    await _videoModel.course.update({ _id }, { $set: params })
    ctx.body = getResponse(true);
}

const courseDetail = async ctx => {
    let { _id } = ctx.request.query;
    let course = await _videoModel.course.findOne({ _id });
    ctx.body = getResponse(true, course);
}

const queryLunbo = async ctx => {
    let { province, city } = ctx.request.query;
    let date = new Date()
    let course = await _videoModel.course.find({
        upload: true,
        provincePinyin: province.toLocaleLowerCase(),
        cityPinyin: city.toLocaleLowerCase(),
        'lunbo.start': { $lt: date },
        'lunbo.end': { $gt: date }
    }).sort({ 'lunbo.index': 1 })
    let length = course.length;
    if (length < 5) {
        let _ids = []
        course.forEach(c => {
            _ids.push(c._id)
        });
        let courseCity = await _videoModel.course.find({
            upload: true,
            provincePinyin: province.toLocaleLowerCase(),
            cityPinyin: city.toLocaleLowerCase(),
            _id: { $nin: _ids }
        })
        for (let i = length; i < 5; i++) {
            let len = courseCity.length;
            if (!len) break;
            let j = parseInt(Math.random() * courseCity.length)
            course.push(courseCity.splice(j, 1)[0])
        }
        length = course.length;
        if (length < 5) {
            course.forEach(c => {
                _ids.push(c._id)
            });
            let courseNoCity = await _videoModel.course.find({ upload: true, _id: { $nin: _ids } })
            for (let i = length; i < 5; i++) {
                let len = courseNoCity.length;
                if (!len) break;
                let j = parseInt(Math.random() * courseNoCity.length)
                course.push(courseNoCity.splice(j, 1)[0])
            }
        }
    }
    ctx.body = getResponse(true, course);
}

const queryTuijianCourse = async ctx => {
    let { province, city } = ctx.request.query;
    let date = new Date()
    let org = await _videoModel.org.find({
        provincePinyin: province.toLocaleLowerCase(),
        cityPinyin: city.toLocaleLowerCase(),
        'tuiJian.start': { $lt: date },
        'tuiJian.end': { $gt: date }
    }).sort({ 'lunbo.5index': 1 })
    let _ids = []
    org.forEach(c => {
        _ids.push(c._id)
    });
    let length = _ids.length;
    if (length < 5) {
        let orgCity = await _videoModel.org.find({
            provincePinyin: province.toLocaleLowerCase(),
            cityPinyin: city.toLocaleLowerCase(),
            _id: { $nin: _ids }
        })
        for (let i = length; i < 5; i++) {
            let len = orgCity.length;
            if (!len) break;
            let j = parseInt(Math.random() * orgCity.length)
            _ids.push(orgCity.splice(j, 1)[0]._id)
        }
        length = _ids.length;
        if (length < 5) {
            let orgNoCity = await _videoModel.org.find({ _id: { $nin: _ids } })
            for (let i = length; i < 5; i++) {
                let len = orgNoCity.length;
                if (!len) break;
                let j = parseInt(Math.random() * orgNoCity.length)
                _ids.push(orgNoCity.splice(j, 1)[0]._id)
            }
        }
    }
    let course = []
    for (let orgId of _ids) {
        let c = await _videoModel.course.find({ orgId, upload: true })
        course.push(c)
    }
    ctx.body = getResponse(true, course);
}


const queryCourseList = async ctx => {
    let { province, city, skip, thisCity } = ctx.request.body;
    let course = []
    let end = false;
    if (thisCity) {
        let cs = await _videoModel.course.find({ province, city, upload: true }).skip(+skip).limit(20);
        let len = cs.length
        if (len < 20) {
            thisCity = false;
            let ce = await _videoModel.course.find({
                $or: [
                    { province, city: { $nin: [city] } },
                    { province: { $nin: [province] }, city },
                    { province: { $nin: [province] }, city: { $nin: [city] } }
                ],
                upload: true
            }).limit(20 - len)
            course = [...cs, ...ce]
            if (course.length < 20) {
                end = true
            } else {
                skip = ce.length;
            }
        } else {
            course = cs;
            skip += 20
        }
    } else {
        course = await _videoModel.course.find({
            $or: [
                { province, city: { $nin: [city] } },
                { province: { $nin: [province] }, city },
                { province: { $nin: [province] }, city: { $nin: [city] } }
            ],
            upload: true
        }).skip(+skip).limit(20)
        if (course.length < 20) {
            end = true
        } else {
            skip += 20
        }
    }
    ctx.body = getResponse(true, { skip, thisCity, end, course });
}

const checkToken  = async ctx=>{
    let {signature,timestamp,nonce,echostr} = ctx.request.query;
    console.log(8888,signature,timestamp,nonce,echostr)
	ctx.body = echostr;//getResponse(true, "ddddddd");
}
module.exports = {
    uploadImg,
    queryCourse,
    removeCourse,
    modifyCourseImg,
    modifyCourse,
    courseDetail,
    addCourse,
    queryLunbo,
    queryTuijianCourse,
    queryCourseList,
	checkToken
};