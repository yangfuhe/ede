const model = {
    name: 'course',
    schema: {
        name: String,
        imgUrl: String,
        type: Number, //1免费课程 2会员课程
        orgId: String,
        orgName: String,
        tags: [String],
        createTime: Date,
        province: String,
        provincePinyin: String,
        city: String,
        cityPinyin: String,
        area: String,
        areaPinyin: String,
        lunbo: { index: Number, start: Date, end: Date },
        upload: { type: Boolean, default: false }
    },
};

module.exports = model;