//课程相关

const {
    getResponse,
    smsCode
} = require('../helpers')

const login = async ctx => {
    let { userName, password } = ctx.request.body;
    let org = await _videoModel.org.findOne({ $or: [{ userName }, { masterTel: userName }], password })
    if (org) {
        ctx.session.orgId = org._id;
        ctx.body = getResponse(true)
    } else {
        ctx.body = getResponse(false, 'e003')
    }
}

const checkUserName = async ctx => {
    let { userName } = ctx.request.query;
    let org = await _videoModel.org.findOne({ userName })
    if (org) {
        ctx.body = getResponse(true, { flag: true })
    } else {
        ctx.body = getResponse(true, { flag: false })
    }
}
const checkTel = async ctx => {
    let { tel } = ctx.request.query;
    let org = await _videoModel.org.findOne({ tel })
    if (org) {
        ctx.body = getResponse(true, { flag: true })
    } else {
        ctx.body = getResponse(true, { flag: false })
    }
}

const querySmsCode = async ctx => {
    let { tel } = ctx.request.query;
    let code = await smsCode(tel);
    if (code) {
        ctx.session.tel = tel;
        ctx.session.code = code;
        ctx.body = getResponse(true, code)
    } else {
        ctx.body = getResponse(false, 'e004')
    }
}


const register = async ctx => {
    let {
        province,
        provincePinyin,
        city,
        cityPinyin,
        area,
        areaPinyin,
        address,
        userName,
        password,
        name,
        master,
        masterTel,
    } = ctx.request.body;
    if (!province || !provincePinyin || !city || !cityPinyin || !address || !userName || !password || !name || !master || !masterTel) {
        ctx.body = getResponse(false, 'e101')
        return
    }
    await _videoModel.org.create({
        province,
        provincePinyin,
        city,
        cityPinyin,
        area,
        areaPinyin,
        address,
        userName,
        password,
        name,
        master,
        masterTel,
        createTime: new Date()
    })
    ctx.body = getResponse(true)
}

module.exports = {
    login,
    checkUserName,
    checkTel,
    register,
    querySmsCode
}