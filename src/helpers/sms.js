const SMSClient = require('@alicloud/sms-sdk')
const accessKeyId = 'LTAIPXMMLQ9lYWFA'
const secretAccessKey = 'cnjH0zgQE2NnACEIs4xBUGUQgvyDmO'
let smsClient = new SMSClient({ accessKeyId, secretAccessKey })

let smsCode = (tel) => {
    return new Promise((resolve, reject) => {
        let code = Math.random().toString().substr(-4)
        smsClient.sendSMS({
            PhoneNumbers: tel,
            SignName: '易得宝',
            TemplateCode: 'SMS_145495691',
            TemplateParam: `{"code":"${code}"}`
        }).then(res => {
            let { Code } = res
            if (Code === 'OK') {
                resolve(code)
            } else {
                resolve("")
            }
        }, (err) => {
            resolve("")
        })
    })
}
module.exports = {
    smsCode
}