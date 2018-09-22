const model = {
    name: 'org',
    schema: {
        province: String,
        provincePinyin: String,
        city: String,
        cityPinyin: String,
        area: String,
        areaPinyin: String,
        address: String,
        userName: String,
        password: String,
        name: String,
        master: String,
        masterTel: String,
        createTime: Date,
        tuiJian: { index: Number, start: Date, end: Date },
    }
}

module.exports = model