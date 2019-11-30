let express = require('express');
let router = express.Router();
const { Parcel, Message, Customer, CustomerService, Storekeeper } = require('../model/db')

//注册客户
router.post("/customer_register" , async(req,res)=>{
    
    const customerData = {
        username : req.body.username,
        name : req.body.name,
        password : req.body.password
    }
    
    if(!customerData.username || customerData.username === 'undefined'){
        return res.json({
            code : 1000,
            msg : "请输入你的用户名"
        })
    }
    if(!customerData.name || customerData.name === 'undefined'){
        return res.json({
            code : 1001,
            msg : "请输入你的姓名"
        })
    }
    if(!customerData.password || customerData.password === 'undefined'){
        return res.json({
            code: 1002,
            msg : "请输入你的密码"
        })
    }

    await Customer.findOne({username : customerData.username }, (err,data)=>{
        if(data){
            return res.json({
                code : 1003,
                msg : "该用户名已经注册"
            })
        }else{
           Customer.create( customerData ,()=>{
               if(err) throw err;
               return res.send({
                   code: 1004,
                   msg : "注册成功"
               })
           })
        }
    })
})
//查询所有的客户
router.get('/all_customer',async(req,res)=>{
    const Customers = await Customer.find();
    if(Customers.length>=0){
        return res.send({
            code: 0,
            msg : "查找客户信息成功",
            Customers
        });
        
    }else{
        return res.json({
            code: 1000,
            msg : "查找客户信息失败"
        })
    }
})


//注册客服
router.post("/customerservice_register" , async(req,res)=>{
    
    const CustomerServiceData = {
        username : req.body.username,
        name : req.body.name,
        password : req.body.password
    }
    
    if(!CustomerServiceData.username || CustomerServiceData.username === 'undefined'){
        return res.json({
            code : 1000,
            msg : "请输入你的用户名"
        })
    }
    if(!CustomerServiceData.name || CustomerServiceData.name === 'undefined'){
        return res.json({
            code : 1001,
            msg : "请输入你的姓名"
        })
    }
    if(!CustomerServiceData.password || CustomerServiceData.password === 'undefined'){
        return res.json({
            code: 1002,
            msg : "请输入你的密码"
        })
    }

    await CustomerService.findOne({username : CustomerServiceData.username }, (err,data)=>{
        if(data){
            return res.json({
                code : 1003,
                msg : "该用户名已经注册"
            })
        }else{
            CustomerService.create( CustomerServiceData ,()=>{
               if(err) throw err;
               return res.send({
                   code: 1004,
                   msg : "注册成功"
               })
           })
        }
    })
})

//查询所有的客服人员
router.get('/all_customerservices',async(req,res)=>{
    const CustomerServices = await CustomerService.find();
    if(CustomerServices.length>=0){
        return res.send({
            code: 0,
            msg : "查找客户信息成功",
            CustomerServices
        });
        
    }else{
        return res.json({
            code: 1000,
            msg : "查找客户信息失败"
        })
    }
})


//注册仓库操作员
router.post("/storekeeper_register" , async(req,res)=>{
    
    const StorekeeperData = {
        storekeeper_name : req.body.storekeeper_name,
        name : req.body.name,
        password : req.body.password
    }
    
    if(!StorekeeperData.storekeeper_name || StorekeeperData.storekeeper_name === 'undefined'){
        return res.json({
            code : 1000,
            msg : "请输入你的用户名"
        })
    }
    if(!StorekeeperData.name || StorekeeperData.name === 'undefined'){
        return res.json({
            code : 1001,
            msg : "请输入你的姓名"
        })
    }
    if(!StorekeeperData.password || StorekeeperData.password === 'undefined'){
        return res.json({
            code: 1002,
            msg : "请输入你的密码"
        })
    }

    await Storekeeper.findOne({storekeeper_name : StorekeeperData.storekeeper_name }, (err,data)=>{
        if(data){
            return res.json({
                code : 1003,
                msg : "该用户名已经注册"
            })
        }else{
            Storekeeper.create( StorekeeperData ,()=>{
               if(err) throw err;
               return res.send({
                   code: 1004,
                   msg : "注册成功"
               })
           })
        }
    })
})

router.get('/all_Storekeepers',async(req,res)=>{
    const Storekeepers = await Storekeeper.find();
    if(Storekeepers.length>=0){
        return res.send({
            code: 0,
            msg : "查找客户信息成功",
            Storekeepers
        });
        
    }else{
        return res.json({
            code: 1000,
            msg : "查找客户信息失败"
        })
    }
})

module.exports = router;