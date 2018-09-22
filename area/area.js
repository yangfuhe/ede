let mysql = require("mysql");
let _videoModel = require('../src/model_video')
let pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'wanlian2018',
    database: 'test',
    port: 3306
});

let query = sql => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, conn) {
            conn.query(sql, function(err, vals) {
                conn.release();
                resolve(vals)
            });
        });
    })
};

let initArea = async() => {
    let sheng = await query(`select * from district where parent_id=0`)
    for (let s of sheng) {
        let sh = await _videoModel.area.create({...s, level: 1 })
        let city = await query(`select * from district where parent_id=${s.id}`)
        for (let c of city) {
            let ct = await _videoModel.area.create({...c, parent_id: sh._id, level: 2 })
            let area = await query(`select * from district where parent_id=${c.id}`)
            for (let a of area) {
                await _videoModel.area.create({...a, parent_id: ct._id, level: 3 })
            }
        }
    }
    console.log("success")
}
initArea()