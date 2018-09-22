function isArray(arr){
    return Object.prototype.toString.call(arr) === '[object Array]'
}
function isPlainObject(obj){
    return typeof(obj) == "object" && Object.getPrototypeOf(obj) == Object.prototype
}
const reg = new RegExp(/^(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/);
// 校验手机号码格式是否正确
function checkPhone(phone){
    if(!reg.test(+phone)) {
        return false
    }else{
        return true
    }
}

exports.validate = function(obj, format){
    // 确保obj是对象
    if(!isPlainObject(obj)) return false

    // 确保format是数组
    if(format && isArray(format)) {
        for(let item of format) {
            if(typeof item === 'string' && obj[item] !== undefined) {
                // format的元素是字符串的情况
            }else if(isPlainObject(item) && item.name && obj[item.name] !== undefined){
                // format的元素是对象的情况
                switch (item.type) {
                    case 'phone':
                        if(!checkPhone(obj[item.name])) {
                            return false
                        }
                        break;
                    default:

                }
            }else{
                return false
            }
        }
    }else{
        return false
    }

    return true
}
