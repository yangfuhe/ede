// 视频历史记录
const model = {
    name: 'history',
    schema: {
        stuId: String,
        courseId: String,
        courseName: String,
        courseImg: String,
        videoId: String,
        videoName: String,
        initTime: Number,
        updateTime: Date
    }
}

module.exports = model