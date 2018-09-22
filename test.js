let fs = require('fs')


let test = async() => {
    var writeStream = fs.createWriteStream('./file/区块链.pdf');

    var aname = ['upload_677649630cad9b8dfa86d3ef146659c5', 'upload_dcdd377479d462b38ca4603b660b4a2e'];
    for (let a of aname) {
        let url = './temp/' + a;
        let data = await new Promise(function(resolve, reject) {
            fs.readFile(url, function(error, data) {
                if (error) reject(error);
                resolve(data);
            });
        });
        //把数据写入流里
        writeStream.write(data);
        //删除生成临时bolb文件              
        //fs.unlink(url, () => {});
    }
    writeStream.end();
}

//test();

let getSuffix = str => {
    return str.substr(str.lastIndexOf)
}