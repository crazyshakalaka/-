const mongoose = require('mongoose');

// 仓库表的建立
const ParcelSchema = new mongoose.Schema({
    // express_id: { type: String },
    express_number : { type : Number,unique : true },
    express_company : { type: String },
    accept_time : { type: Date },
    storekeeper_id : { type: String },
    customer_name : { type: String },
    updatedAt : { type: Date },
    status : { type : Number }
})

const messagesSchema = new mongoose.Schema({
    express_id : { type : String, unique : true },
    customerservice_id : { type: String },
    messages_status : { type : Number }
})

const CustomerSchema = new mongoose.Schema({
    username : { type: String , unique : true },
    name : { type : String },
    password : { type : String }
})

const CustomerServiceSchema = new mongoose.Schema({
    username : { type : String , unique : true },
    name : { type : String },
    password : { type : String }
})

const StorekeeperSchema = new mongoose.Schema({
    storekeeper_name : { type : String , unique : true },
    name : { type : String },
    password : { type : String }
})

module.exports = { ParcelSchema, messagesSchema, CustomerSchema, CustomerServiceSchema , StorekeeperSchema};