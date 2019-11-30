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
            as: "msg"
        }
    },
     {
        $lookup:
        {
            from: "storekeepers",
            localField: "storekeeper_username",
            foreignField: "storekeeper_name",
            as: "updatedBy"
        }
    },
    {
        $lookup:
        {
            from: "customers",
            localField: "customer_username",
            foreignField: "username",
            as: "relativeCustomer"
        }
    },
    {
        $lookup:
        {
            from: "customerservices",
            localField: "customerservice_username",
            foreignField: "username",
            as: "relativeStaffOfCustomer"
        }
    },
    {
        $match: { "msg": { $ne: [] }, "updatedBy": { $ne: [] },"relativeCustomer": { $ne: [] },"relativeStaffOfCustomer": { $ne: [] }}
     },
    //  {
    //  $project:
    //     {
    //         _id: 0,
    //         express_number: 1,
    //         express_company : 1,
    //         accept_time : 1,
    //         status : 1,
    //         storekeeper_username : 0,
    //         customer_username : 0,
    //         customerservice_username : 0,
    //         updatedAt : 1,
    //         // "signInstitutionsData.unit_name": 1,
    //         // "signInstitutionsData.institutions": 1
    //     }
    // }
    ],(err,data)=>{
        res.send(JSON.stringify(data));
    }) 
})

router.get("/time_express",async(req,res)=>{
    let stime = {};
    if((req.body.time1!=null&&req.body.time1!=undefined)&&(req.body.time1==null||req.body.time1==undefined)){ 
        stime = {"accept_time":{"$gte": mongoose.ISODate(req.body.time1)}}
    }else 
    if((req.body.time1==null||req.body.time1==undefined)&&(req.body.time1!=null&&req.body.time1!=undefined)){ 
        stime = {"accept_time":{"$lte":mongoose.ISODate(req.body.time2)}}
    }else 
    if((req.body.time1!=null&&req.body.time1!=undefined)&&(req.body.time1!=null&&req.body.time1!=undefined)){ 
        stime = {"accept_time":{"$gte":mongoose.ISODate(req.body.time1),"$lte":mongoose.ISODate(req.body.time2)}}
    }  
    if(stime!={}){
        const TimeDatas = await Parcel.find(stime);
        if(TimeDatas.length>=0){
            return res.send({
                code: 0,
                msg : "查找成功",
                TimeDatas
            });
            
        }else{
            return res.json({
                code: 1000,
                msg : "查找失败"
            })
        }
    }else{
        return res.json({
            code: 1001,
            msg : "请输入查询参数！"
        })
    }
    
})

module.exports = router;