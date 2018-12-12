const errors = require('./errors')
let axios = require('axios')
exports.getUuid = function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4();
};

exports.getResponse = function(success, e) {
    if (success) {
        return {
            data: e || {},
            success: true
        };
    } else {
        return {
            success: false,
            error: e || '',
            errorMsg: errors[e] || '未知错误！'
        };
    }
};

exports.wxLogin = async(ctx, next) => {
    let stuId = ctx.session.stuId;
    console.log(1111, stuId)
    if (!stuId) {
        console.log(ctx)
        ctx.session.stuId = ctx.request.body.stuId || ctx.request.query.stuId
        console.log(2222, ctx.session.stuId)
    }
    await next()
}

// 校验手机号码格式是否正确
exports.checkPhone = function(phone) {
    if (!phone) return false
    const reg = new RegExp(/^(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/);
    if (!reg.test(+phone)) {
        return false
    } else {
        return true
    }
}

exports.getOpenid = async function(code) {
    return axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=wx48308d893fbd4551&secret=6401a3369d201853d00f6031879fd337&js_code=${code}&grant_type=authorization_code`);
}
exports.smsCode = require('./sms').smsCode
exports.cosSign = require('./cosSign')