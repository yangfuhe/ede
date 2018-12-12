const { getResponse, cosSign } = require('../helpers');

const querySign = async ctx => {
    let result = await cosSign()
    if (result.err) {
        ctx.body = getResponse(false, 'e004')
    } else {
        ctx.body = getResponse(true, result.body)
    }
}
module.exports = {
    querySign
}