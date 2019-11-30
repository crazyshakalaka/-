const mongoose = require('mongoose');
const { ParcelSchema, messagesSchema, CustomerSchema, CustomerServiceSchema , StorekeeperSchema } = require('./schema')

mongoose.connect('mongodb://localhost:27017/Warehouse-management',{
    useNewUrlParser: true,
    useCreateIndex : true,
    useUnifiedTopology: true
});


const Parcel = mongoose.model("Parcel", ParcelSchema);

const Message = mongoose.model("Message", messagesSchema);

const Customer = mongoose.model("Customer", CustomerSchema);

const CustomerService = mongoose.model("CustomerService", CustomerServiceSchema);

const Storekeeper = mongoose.model("Storekeeper", StorekeeperSchema);
// Parcel.db.dropCollection('parcels') //删除数据库表

module.exports = { Parcel, Message, Customer, CustomerService, Storekeeper };