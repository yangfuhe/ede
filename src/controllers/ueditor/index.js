const fs = require('fs')
const path = require('path')
const upload = require('./upload')
const config = require('./config')
const COS = require('cos-nodejs-sdk-v5')
const uuidv1 = require('uuid/v1')
const moment = require('moment')

// 同步遍历文件
function eachFileSync(dir, findOneFile) {
    const stats = fs.statSync(dir)
    if (stats.isDirectory()) {
        fs.readdirSync(dir).forEach(file => {
            eachFileSync(path.join(dir, file), findOneFile)
        })
    } else {
        findOneFile(dir, stats)
    }
}

// 处理Ueditor上传保存路径
function setFullPath(dest) {
    const date = new Date()
    const map = {
        't': date.getTime(), // 时间戳
        'm': date.getMonth() + 1, // 月份
        'd': date.getDate(), // 日
        'h': date.getHours(), // 时
        'i': date.getMinutes(), // 分
        's': date.getSeconds(), // 秒
    };

    dest = dest.replace(/\{([ymdhis])+\}|\{time\}|\{rand:(\d+)\}/g, function(all, t, r) {
        let v = map[t];
        if (v !== undefined) {
            if (all.length > 1) {
                v = '0' + v
                v = v.substr(v.length - 2)
            }
            return v;
        } else if (t === 'y') {
            return (date.getFullYear() + '').substr(6 - all.length);
        } else if (all === '{time}') {
            return map['t']
        } else if (r >= 0) {
            return Math.random().toString().substr(2, r)
        }
        return all
    });

    return dest
}

/**
 * ueditor上传方法
 * @param  {string/array} dir    静态目录，若是数组[dir, UEconfig]第2个为Ueditor配置
 * @param  {object} options      upload方法参数
 * @param  {object} cosConf      腾讯云对象储存配置
 * @return {function}            Ueditor Controller
 */
const ueditor = function(dir, options, cosConf) {
    const publicDir = path.resolve(dir)
    const conf = Object.assign({}, config, options || {}) //ueditor配置
    const uploadType = {
        [conf.imageActionName]: 'image',
        [conf.scrawlActionName]: 'scrawl',
        [conf.catcherActionName]: 'catcher',
        [conf.videoActionName]: 'video',
        [conf.fileActionName]: 'file',
    }
    const listType = {
        [conf.imageManagerActionName]: 'image',
        [conf.fileManagerActionName]: 'file',
    }

    // Ueditor Controller
    return async(ctx, next) => {
        let { action, start = 0 } = ctx.query
        start = parseInt(start)
            // 上传文件
        if (Object.keys(uploadType).includes(action)) {
            let pathFormat = setFullPath(conf[uploadType[action] + 'PathFormat']).split('/')
            let filename = pathFormat.pop()
            let key = '';
            let FilePath = ''
            let fileRes = {}

            //try {
            // 涂鸦类型图片
            if (action === conf.scrawlActionName) {
                const base64Data = ctx.request.body[conf[uploadType[action] + 'FieldName']]
                if (base64Data.length > conf[uploadType[action] + 'MaxSize']) {
                    throw new Error('File too large')
                }
                ctx.req.file = upload.base64Image(base64Data, publicDir, {
                    destination: path.join(publicDir, ...pathFormat),
                    filename: filename
                })
                key = 'img/' + moment().format("YYYY-MM-DD") + "/" + uuidv1() + upload.getSuffix(ctx.req.file.filename)
                const { AppId, SecretId, SecretKey, Bucket, Region } = cosConf
                const cos = new COS({ SecretId, SecretKey })
                await new Promise((resolve, reject) => {
                    cos.sliceUploadFile({
                        Bucket,
                        Region,
                        FilePath: ctx.req.file.path,
                        Key: key
                            // Key: filename
                    }, function(err, data) {
                        if (err) {
                            //resolve("")
                        } else {
                            resolve('https://' + data.Location)
                                //fileRes.url = 'https://' + data.Location
                        }
                    })
                })

                let response = Object.assign({ state: 'SUCCESS' }, upload.fileFormat(ctx.req.file))
                response.url = 'https://kaifa-1257359776.cos.ap-shanghai.myqcloud.com/' + key
                _videoModel.ueditor.create({
                    orgId: ctx.session.orgId,
                    url: response.url,
                    type: 1,
                    mtime: new Date()
                })
                fs.unlink(ctx.req.file.path)
                ctx.body = response;
            } else {
                await upload(publicDir, {
                    storage: upload.diskStorage({
                        destination: path.join(publicDir, ...pathFormat),
                        filename(req, file, cb) {
                            if (filename === '{filename}') {
                                filename = file.originalname
                                key = 'img/' + uuidv1() + upload.getSuffix(file.originalname)
                            } else {
                                filename += upload.getSuffix(file.originalname)
                                key = 'video/' + uuidv1() + upload.getSuffix(file.originalname)
                            }
                            FilePath = filename
                            cb(null, filename)
                        }
                    }),
                    limits: {
                        fileSize: conf[uploadType[action] + 'MaxSize']
                    },
                    allowfiles: conf[uploadType[action] + 'AllowFiles']
                }, options || {}).single(conf[uploadType[action] + 'FieldName'])(ctx, next)
                fileRes = upload.fileFormat(ctx.req.file);

                if (cosConf && typeof cosConf === 'object') {
                    const { AppId, SecretId, SecretKey, Bucket, Region } = cosConf
                    FilePath = path.join(publicDir, ...pathFormat) + '/' + FilePath;

                    const cos = new COS({ SecretId, SecretKey })
                    await new Promise((resolve, reject) => {
                            cos.sliceUploadFile({
                                Bucket,
                                Region,
                                FilePath,
                                Key: key
                                    // Key: filename
                            }, function(err, data) {
                                if (err) {
                                    resolve("")
                                } else {
                                    resolve('https://' + data.Location)
                                        //fileRes.url = 'https://' + data.Location
                                }
                            })
                        })
                        // .then(() => {
                        //     fileRes.url = 'https://kaifa-1257359776.cos.ap-shanghai.myqcloud.com/' + key
                        //     ctx.body = Object.assign({ state: 'SUCCESS' }, fileRes)
                        // })
                    fs.unlink(FilePath)
                }
                fileRes.url = 'https://kaifa-1257359776.cos.ap-shanghai.myqcloud.com/' + key
                _videoModel.ueditor.create({
                    orgId: ctx.session.orgId,
                    url: fileRes.url,
                    type: 1,
                    mtime: new Date()
                })
                ctx.body = Object.assign({ state: 'SUCCESS' }, fileRes)
            }

            // } catch (err) {
            //     ctx.body = { state: err.message }
            // }
        }
        // 获取图片/文件列表
        else if (Object.keys(listType).includes(action)) {
            // let files = []
            // eachFileSync(path.join(publicDir, conf[listType[action] + 'ManagerListPath']), (file, stat) => {
            //     if (conf[listType[action] + 'ManagerAllowFiles'].includes(upload.getSuffix(file))) {
            //         const url = file.replace(publicDir, '').replace(/\\/g, '\/')
            //         const mtime = stat.mtimeMs
            //         files.push({ url, mtime })
            //     }
            // })
            let list = await _videoModel.ueditor.find({ orgId: ctx.session.orgId }).sort({ _id: -1 })
            ctx.body = {
                list,
                //list: files.slice(start, start + conf[listType[action] + 'ManagerListSize']),
                start: start,
                total: list.length,
                state: 'SUCCESS'
            }
        }
        // 返回Ueditor配置给前端
        else if (action === 'config') {
            ctx.body = conf
        } else {
            ctx.body = { state: 'FAIL' }
        }
    }
}

exports = module.exports = ueditor
exports.eachFileSync = eachFileSync
exports.setFullPath = setFullPath