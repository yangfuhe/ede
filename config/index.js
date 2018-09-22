// 本地开发
var development = require('./development');
//6401a3369d201853d00f6031879fd337
// 正式环境
var production = require('./production');

var env = process.env.NODE_ENV || 'development';

console.log('运行环境：' + env)
var configs = {
    development,
    production,
};

var defaultConfig = {
    env,

}

const config = Object.assign({}, defaultConfig, configs[env])

module.exports = config;