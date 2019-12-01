let express = require('express');
let router = express.Router();
const mongoose = require('mongoose');
const { Parcel, Message, Customer, CustomerService, Storekeeper } = require('../model/db')

//查询所有仓库包裹
router.get('/all_express',async(req,res)=>{
    const parcels = await Parcel.find();
    res.send( parcels );
})

router.get('/all_express/count',async(req,res)=>{
    const parcelscount = await Parcel.find();
    // const DataCount = parcelscount.count();
    res.json(parcelscount.length);
})

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
    
    const Data = await Parcel.aggregate([
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
        $match: { 
            "msg": { $ne: [] }, 
            "updatedBy": { $ne: [] },
            "relativeCustomer": { $ne: [] },
            "relativeStaffOfCustomer": { $ne: [] },
            "msg.messages_status" : 0
        }
     },
    //  { $project : {
    //     weight: 1 ,
    //     name : 1 
    //     }
    // }
    ],(err,data)=>{
        // const Data = JSON.stringify(data);
        // console.log(data[0]._id);
        const messagesData = {
            relativeStaffOfCustomer:{
                username: data[0].relativeStaffOfCustomer[0].username,
                name: data[0].relativeStaffOfCustomer[0].name
            },
            relativeCustomer: {
                username: data[0].relativeCustomer[0].username,
                name: data[0].relativeCustomer[0].name
            },
            updatedBy: {
                username: data[0].updatedBy[0].storekeeper_name,
                name: data[0].updatedBy[0].name
            },
            updatedAt: data[0].updatedAt,
            targetObjectType: "Parcel",
            actionType: "Receive",
            object: data[0].msg
            }
     return res.send(messagesData) 
    })

})

router.get("/time_express",async(req,res)=>{

    const time1 = req.body.time1;
    const time2 = req.body.time2;
    let stime = {};
    if((!time1 || time1==='undefined')&&(!time2||time2=='undefined')){

        return res.json({
            code: 1001,
            msg : "请输入查询参数！"
        })

    }  
    if(( time1 || time1!='undefined')&&(!time2||time2 === 'undefined')){ 
        
        stime = {"accept_time":{"$gte": new Date(time1)}}

    }else if(( !time1 || time1 === 'undefined')&&( time2 || time2!=='undefined')){ 
        
        stime = {"accept_time":{"$lte":new Date(time2)}}

    }else if(( time1 || time1 !== 'undefined')&&(time2|| time2!== 'undefined')){ 
        
        stime = {"accept_time":{"$gte":new Date( time1 ),"$lte":new Date( time2 )}}

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
    }
    
})

//根据订单号查询数据库
router.get("/express_number",async(req,res)=>{
    
    const express_number  = req.body.express_number
    if(!express_number || express_number === 'undefined'){
        return res.json({
            code : 1000,
            msg : "请输入查询的包裹单号参数"
        })
    }

    const parcelData = await Parcel.find({express_number: express_number});
    if(parcelData.length>=0){
        return res.send({
            code: 0,
            msg : "查找包裹单号成功",
            parcelData
        });
    }else{
        return res.json({
            code : 0,
            msg : "查找失败"
        })
    }

})

//把消息设置为已读
router.get("/read_message",async(req,res)=>{
    
    const id = req.body._id;
    if(!id || id === 'undefined' ){
        return res.json({
            code : 1000,
            msg : "请输入参数"
        })
    }
    
    // const UpdateMessage = await Message.find({"express_id" : id});

    // res.send(UpdateMessage);

    // if(UpdateMessage.length>0){
        
    //     if(UpdateMessage.messages_status === 1){
    //         return res.json({
    //             code : 1001,
    //             msg : "这条消息之前已经读过"
    //         })
    //     }
    
    Message.updateOne(
        { "_id" : id },
        { "messages_status" : 1 },
        (err,data)=>{
            if(err){
                return res.json({
                    code : 1002,
                    msg : "状态改变失败"
                })
            }
            return res.json({
                code : 0,
                msg : "这条消息已经设置为已读"
            })
        });
})


module.exports = router;