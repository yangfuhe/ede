//课程相关

const {
    getResponse,
} = require('../helpers')


const queryTags = async ctx => {
    let orgId = ctx.session.orgId;
    let tags = await _videoModel.tag.find({ orgId })
    ctx.body = getResponse(true, tags)
}

const addCategory = async ctx => {
    let { category } = ctx.request.body
    let orgId = ctx.session.orgId;
    let tag = await _videoModel.tag.findOne({ orgId, category })
    if (tag) {
        ctx.body = getResponse(false, 'e101')
        return
    }
    await _videoModel.tag.create({ category, orgId })
    let tags = await _videoModel.tag.find({ orgId })
    ctx.body = getResponse(true, tags)
}
const removeCategory = async ctx => {
    let { _id } = ctx.request.body
    let orgId = ctx.session.orgId;
    let tag = await _videoModel.tag.findById(_id)
    await _videoModel.course.updateMany({ orgId }, { $pullAll: { tags: tag.tags } })
    await _videoModel.tag.remove({ _id })
    let tags = await _videoModel.tag.find({ orgId })
    ctx.body = getResponse(true, tags)
}
const modifyCategory = async ctx => {
    let { _id, category } = ctx.request.body
    let orgId = ctx.session.orgId;
    let tag = await _videoModel.tag.findOne({ category, orgId, _id: { $ne: _id } })
    if (tag) {
        ctx.body = getResponse(false, 'e101')
        return
    }
    await _videoModel.tag.update({ _id }, { $set: { category } })
    let tags = await _videoModel.tag.find({ orgId })
    ctx.body = getResponse(true, tags)
}
const addTag = async ctx => {
    let { _id, tag } = ctx.request.body
    let orgId = ctx.session.orgId;
    let result = await _videoModel.tag.findOne({ tags: tag, orgId })
    if (result) {
        ctx.body = getResponse(false, 'e101')
        return
    }
    await _videoModel.tag.update({ _id }, { $push: { tags: tag } })
    let tags = await _videoModel.tag.find({ orgId })
    ctx.body = getResponse(true, tags)
}

const removeTag = async ctx => {
    let { _id, tag } = ctx.request.body;
    let orgId = ctx.session.orgId;
    await _videoModel.course.updateMany({ orgId }, { $pull: { tags: tag } })
    await _videoModel.tag.update({ _id }, { $pull: { tags: tag } })
    let tags = await _videoModel.tag.find({ orgId })
    ctx.body = getResponse(true, tags)
}

const modifyTag = async ctx => {
    let { _id, oldTag, newTag } = ctx.request.body;
    let orgId = ctx.session.orgId;
    let result = await _videoModel.tag.findById(_id)
    for (let i in result.tags) {
        if (result.tags[i] === oldTag) {
            result.tags[i] = newTag
            break;
        }
    }
    await _videoModel.tag.update({ _id }, { $set: { tags: result.tags } })
    let courses = await _videoModel.course.find({ tags: oldTag, orgId }, { tag: 1 })
    for (let course of courses) {
        let tags = course.tags
        for (let i in tags) {
            if (tags[i] === oldTag) {
                tags[i] = newTag;
                break;
            }
        }
        _videoModel.course.update({ _id: course }, { $set: { tags } })
    }
    let tags = await _videoModel.tag.find({ orgId })
    ctx.body = getResponse(true, tags)

}
module.exports = {
    queryTags,
    addCategory,
    removeCategory,
    modifyCategory,
    addTag,
    removeTag,
    modifyTag

}