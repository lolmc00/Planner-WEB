const { Plan } = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var response = function(res, err, row = undefined){
    this.res = res;
    this.err = err;
    this.row = row;
}

const dataFormat = (data => {
  return {
    
  }
});
module.exports = {  
  check: async function(id){
    return new Promise((resolve, reject) => {
        // Find id in DB
        Plan.findOne({
            where: {id: id}
        }).then(function(row){
          if(!row)
            return reject(new response(false, "해당 ID값을 가진 행이 존재하지 않습니다."));
          return resolve(new response(true, null, row));
        }).catch(function(error) {
          return reject(new response(false, error));
        });
    });
  },
  post: async function(data){
    return new Promise((resolve, reject) => {
      Plan.create(
        {
          author: data.author,
          title: data.title,
          exp: data.exp,
          date: data.date,
          type: data.type,
        }
      ).then((row) => {
        return resolve(new response(true, null, row));
      }).catch(err => {
        return reject(new response(false, err));
      });
    });
  },
  update: async function(data){
    let check_res = await this.check(data.id);
    return new Promise((resolve, reject) => {
      if(check_res.res === true){
        Plan.update(
          {
            ...data
          },
          { where : { id: data.id } }
        ).then(async () => {
          let check_res = await this.check(data.id);
          return resolve(new response(true, null, check_res.row));
        }).catch((err) => {
          return reject(new response(false, err));
        });
      }else{
        return reject(new response(false, "해당하는 행을 찾을 수 없습니다."));
      }
    });
  },
  delete: async function(data){
    let check_res = new response(false, null);
    if(data.id != undefined)
      check_res = await this.check(data.id);
    return new Promise((resolve, reject) => {
        if(check_res.res === true){
          Plan.destroy(
            { where : { id: data.id } }
          ).then(() => {
            return resolve(new response(true, null));
          }).catch((err) => {
            return reject(new response(false, err));
          });
        }else{
          return reject(new response(false, check_res.err));
        }
    });
  },
  getPlans: async function(data){
    return new Promise((resolve, reject) => {
      console.log({...data});
      // Find id in DB
      Plan.findAll({
          where: {
            author: data.author,
            type: data.type,
            date: { 
              [Op.between]: [data.dateStart, data.dateEnd]
            }
          }
      }).then(function(rows){
        return resolve(new response(true, null, rows));
      }).catch(function(error) {
        return reject(new response(false, error));
      });
  });
  }
};