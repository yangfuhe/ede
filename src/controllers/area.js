const { getResponse } = require('../helpers');

const queryArea = async ctx => {
    let { query } = ctx.request.body;
    let area = await _videoModel.area.find(query)
    ctx.body = getResponse(true, area)
}

module.exports = {
    queryArea
}