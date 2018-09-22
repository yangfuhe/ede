const model = {
    name: 'session',
    schema: {
        sid: String,
        session: {},
        expireTime: Date
    }
}

module.exports = model