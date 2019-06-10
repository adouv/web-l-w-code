import Vue from 'vue'
/** 
 * mongoDB数据库操作类
 */
export default {
    /**
     * 插入数据
     *
     * @param {*} tableName
     * @param {*} object
     * @returns
     */
    insert(tableName, object) {
        let response = {};

        return new Promise((resolve, reject) => {
            Vue.mdb.then(db => {
                var dbo = db.db('runoob');
                dbo.collection(tableName).insertOne(object, (err, ret) => {
                    if (err) {
                        response.Data = null;
                        response.Message = err;
                        response.Status = 500;
                        reject(response);
                        throw err;
                    }
                    response.Data = ret;
                    response.Message = "ok";
                    response.Status = 200;
                    resolve(response);
                });
            });
        });
    },
    /**
     * 查询数据
     *
     * @param {*} tableName
     * @param {*} [where={}]
     * @returns
     */
    select(tableName, where = {}) {
        let response = {};

        return new Promise((resolve, reject) => {
            Vue.mdb.then(db => {
                var dbo = db.db('runoob');
                dbo.collection(tableName).find(where).toArray((err, ret) => {
                    if (err) {
                        response.Data = [];
                        response.Message = err;
                        response.Status = 500;
                        reject(response);
                        throw err;
                    } else {
                        response.Data = ret;
                        response.Message = "ok";
                        response.Status = 200;
                        resolve(response);
                    }
                });
            });
        });
    }
}