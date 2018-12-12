const mongoose = require('mongoose')
const { mongoUri, mongoUriParam } = require('../../config')

mongoose.Promise = global.Promise

mongoose.connect(`${mongoUri}/video?${mongoUriParam}`, { useNewUrlParser: true })

const db = {}

let video = require('./video')
let course = require('./course')
let org = require('./org')
let tag = require('./tag')
let session = require('./session')
let stu = require('./stu')
let area = require('./area')
let history = require('./history')
let ueditor = require('./ueditor')
let models = [
    course,
    video,
    org,
    tag,
    session,
    stu,
    area,
    history,
    ueditor
]

for (let model of models) {
    let schema = new mongoose.Schema(model.schema)
    db[model.name] = mongoose.model(model.name, schema, model.name)
}

module.exports = db