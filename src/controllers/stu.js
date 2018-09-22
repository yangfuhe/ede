const {
    getResponse,
    getOpenid
} = require('../helpers')

const queryOpenid = async ctx => {
    let { code } = ctx.request.query;
    let result = await getOpenid(code);
    ctx.body = getResponse(true, result.data);
}

const wxLogin = async ctx => {
    let { userInfo, code } = ctx.request.body;
    let { data } = await getOpenid(code);
    let { openid } = data;
    let stu = await _videoModel.stu.findOne({ openid });
    if (stu) {
        ctx.session.stuId = stu._id;
        ctx.body = getResponse(true, stu._id)
    } else {
        let sd = await _videoModel.stu.create({ userInfo, openid })
        ctx.session.stuId = sd._id;
        ctx.body = getResponse(true, sd._id)
    }

}
module.exports = {
    queryOpenid,
    wxLogin
}