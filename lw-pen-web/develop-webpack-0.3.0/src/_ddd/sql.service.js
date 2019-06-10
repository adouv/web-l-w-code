import Vue from 'vue'
// const path = window.require('path');
// const sqlite3 = window.require('sqlite3').verbose();
// let local = `${path.resolve()}${process.env.NODE_ENV==='production'?'\\resources\\app\\':''}\\lwpen.db`;
// const db = new sqlite3.Database(local);
/** 
 * 数据库操作类（sqlite3）
 */
export default {
    /**
     * 将where（a=1 and b=2）转换为 对象
     * @param {*} where 
     */
    parseWhere(where = "") {
        let whereList = [];
        let find = {};
        if (where !== "") {
            whereList = where.split("and");
            whereList.forEach(element => {
                if (element !== "") {
                    let args = element.split("=");
                    find[args[0]] = args[1];
                }
            });
        }
        return whereList.length > 0 ? find : {};
    },
    /**
     * 数据修改
     * @param {*} tableName
     * @param {*} model
     */
    update(tableName, model, where = "") {
        let find = this.parseWhere(where);
        find.tableName = tableName;

        let set = {};
        set.$set = model;

        let response = {};

        return new Promise((resolve, reject) => {
            Vue.db.update(find, set, (error, result) => {
                if (error) {
                    response.Data = null;
                    response.Message = error;
                    response.Status = 500;
                    reject(response);
                    throw error;
                } else {
                    response.Data = result;
                    response.Message = "ok";
                    response.Status = 200;
                    resolve(response);
                }
            });
        });
    },
    // update(tableName, model, where = "") {
    //   let response = {};
    //   let keys = "";
    //   let values = [];
    //   Object.keys(model).forEach(param => {
    //     if (keys !== "") {
    //       keys += ",";
    //     }
    //     keys += `${param}=?`;
    //     values.push(model[param]);
    //   });
    //   return new Promise((resolve, reject) => {
    //     db.serialize(() => {
    //       db.run(`update ${tableName} set ${keys} where 1=1 ${where?'and '+where:''}`, values, (err, res) => {
    //         if (err) {
    //           response.Data = null;
    //           response.Message = err;
    //           response.Status = 500;
    //           reject(response);
    //         } else {
    //           response.Data = true;
    //           response.Message = "ok";
    //           response.Status = 200;
    //           resolve(response);
    //         }
    //       });
    //     });
    //   });
    // },
    /**
     * 数据添加
     * @param {*} tableName 表名称
     * @param {*} model json对象同时会映射成数据库查询结构
     */
    insert(tableName, model) {

        model.tableName = tableName;

        let response = {};

        return new Promise((resolve, reject) => {
            Vue.db.insert(model, (error, result) => {
                if (error) {
                    response.Data = null;
                    response.Message = error;
                    response.Status = 500;
                    reject(response);
                    throw error;
                } else {
                    response.Data = result;
                    response.Message = "ok";
                    response.Status = 200;
                    resolve(response);
                }
            });
        });
    },
    // insert(tableName, model) {
    //   let response = {};
    //   let keys = "";
    //   let placeholders = "";
    //   let values = [];
    //   Object.keys(model).forEach(param => {
    //     if (keys !== "") {
    //       keys += ",";
    //     }
    //     keys += `'${param}'`;
    //     if (placeholders !== "") {
    //       placeholders += ",";
    //     }
    //     placeholders += "?";
    //     values.push(model[param]);
    //   });
    //   return new Promise((resolve, reject) => {
    //     db.serialize(() => {
    //       db.run(`insert into ${tableName} (${keys}) values(${placeholders})`, values, (err, res) => {
    //         if (err) {
    //           response.Data = null;
    //           response.Message = err;
    //           response.Status = 500;
    //           reject(response);
    //         } else {
    //           response.Data = true;
    //           response.Message = "ok";
    //           response.Status = 200;
    //           resolve(response);
    //         }
    //       });
    //     });
    //   });
    // },
    /**
     * 数据查询
     * @param {*} tableName 表名称
     * @param {*} [where={}] 查询条件，通过json对象进行传递
     * @returns
     */
    select(tableName, where = "") {
        let find = this.parseWhere(where);
        find.tableName = tableName;

        let response = {};

        return new Promise((resolve, reject) => {
            Vue.db.find(find, (error, result) => {
                if (error) {
                    response.Data = null;
                    response.Message = error;
                    response.Status = 500;
                    reject(response);
                    throw error;
                } else {
                    response.Data = result;
                    response.Message = "ok";
                    response.Status = 200;
                    resolve(response);
                }
            });
        });
    }
    // select(tableName, where = "") {
    //   let response = {};
    //   return new Promise((resolve, reject) => {
    //     db.serialize(() => {
    //       db.all(`select * from ${tableName} where 1=1 ${where?'and '+where:''} `, (err, res) => {
    //         if (err) {
    //           response.Data = null;
    //           response.Message = err;
    //           response.Status = 500;
    //           console.log(response);
    //           reject(response);
    //         } else {
    //           response.Data = res;
    //           response.Message = "ok";
    //           response.Status = 200;
    //           resolve(response);
    //         }
    //       });
    //     });
    //   });
    // }
}