let express = require('express');
let router = express.Router();
const mongoose = require('mongoose');
const { Parcel, Message, Customer, CustomerService, Storekeeper } = require('../model/db')

//查询所有仓库包裹
router.get('/all_express',async(req,res)=>{
    const parcels = await Parcel.find();
    res.send( parcels );
})

// router.get('/all_express/count',async(req,res)=>{
//     const parcelscount = await Parcel.find().countDocuments()
//     res.send( parcelscount );
// })

//入库
router.post('/Warehousing',async(req,res)=>{
    const accept_time = new Date(); 
    const ParceData = {
        express_number : req.body.express_number,
        express_company : req.body.express_company,
        accept_time : accept_time,
        storekeeper_username : req.body.storekeeper_username,
        customer_username : req.body.customer_username,
        customerservice_username : req.body.customerservice_username,
        updatedAt: "",
        status : req.body.status
    };

    await Parcel.findOne({ express_number : ParceData.express_number }, (err,data)=>{
        if(data){
            return res.send(
                {
                    code: 0,
                    msg : "仓库已有此条快递的信息"
                });
        }else{
            Parcel.create(ParceData, ()=>{
                if(err) throw err;
                return res.send({
                    code: 1,
                    msg : "入库成功"
                });
            })
        }
    })
})

//存消息
router.post("/creat_messages",async(req,res)=>{
    
    const MessageData = {
        express_id : req.body.express_id,
        customerservice_username : req.body.customerservice_username,
        messages_status : 0 
    }

    if(!MessageData.express_id || MessageData.express_id === 'undefined') {
        return res.json({
            code: 1000,
            msg : "没有传入快递单号或者无效单号",
            data : ''
        })
    }
    if(!MessageData.customerservice_username || MessageData.customerservice_username == "undefined"){
        return res.json({
            code: 1001,
            msg : "没有客服或者客服id无效",
            data : ''
        })
    }else{
        await Message.findOne({ express_id : MessageData.express_id } ,(err,data)=>{
            if(data){
                return res.send({
                        code: 1000,
                        msg : "此消息已经存入消息库"
                    });
            }else{
                Message.create( MessageData, ()=>{
                    if(err) throw err;
                    return res.send({
                        code: 0,
                        msg : "创建消息成功"
                    });
                })
            }
        })
    }
})

//查看所有消息接口
router.get('/all_messages',async(req,res)=>{
    const Messages = await Message.find();
    res.send( Messages );
})


//发送消息
router.get("/send_message",async(req,res)=>{
    
    await Parcel.aggregate([
    {
        $lookup:
        {
            from: "messages",
            localField: "express_number",
            foreignField: "express_id",
            as: "xue"
        }
    }
    ],(err,data)=>{
        res.send(JSON.stringify(data));
    }) 
})

module.exports = router;