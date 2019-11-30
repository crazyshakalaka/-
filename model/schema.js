const mongoose = require('mongoose');

// 仓库表的建立
const ParcelSchema = new mongoose.Schema({
    // express_id: { type: String },
    express_number : { type : Number,unique : true },
    express_company : { type: String },
    accept_time : { type: Date },
    storekeeper_username : { type: String },/**仓库管理员用户名 */
    customer_username : { type: String },/**客户用户名 */
    customerservice_username : { type : String },
    updatedAt : { type: Date },
    status : { type : Number }
})

const messagesSchema = new mongoose.Schema({
    express_id : { type: Number, unique : true },/**快递单号，不是id */
    customerservice_username : { type: String },
    messages_status : { type : Number }
})

const CustomerSchema = new mongoose.Schema({
    username : { type: String , unique : true },
    name : { type : String },
    password : { 
        type : String,
        set(val){
            return require('bcrypt').hashSync(val,10)
        }
    }
})

const CustomerServiceSchema = new mongoose.Schema({
    username : { type : String , unique : true },
    name : { type : String },
    password : { 
        type : String,
        set(val){
            return require('bcrypt').hashSync(val,10)
        }
    }
})

const StorekeeperSchema = new mongoose.Schema({
    storekeeper_name : { type : String , unique : true },
    name : { type : String },
    password : { 
        type : String,
        set(val){
            return require('bcrypt').hashSync(val,10)
        }
    }
})

module.exports = { ParcelSchema, messagesSchema, CustomerSchema, CustomerServiceSchema , StorekeeperSchema};