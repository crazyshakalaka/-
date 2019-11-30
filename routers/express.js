let express = require('express');
let router = express.Router();
const { Parcel } = require('../model/db')


router.get('/all_express',async(req,res)=>{
    const parcels = await Parcel.find();
    res.send( parcels );
})

router.get('/all_express/count',async(req,res)=>{
    const parcelscount = await Parcel.find().countDocuments()
    res.send( parcelscount );
})

router.post('/Warehousing',async(req,res)=>{
    const accept_time = new Date(); 
    const ParceData = {
        express_number : req.body.express_number,
        express_company : req.body.express_company,
        accept_time : accept_time,
        storekeeper_id : req.body.storekeeper_id,
        customer_name : req.body.customer_name,
        status : req.body.status
    };

    Parcel.findOne({ express_number : ParceData.express_number },(err,data)=>{
        if(data){
            res.send("仓库已有此条快递的信息");
        }else{
            Parcel.create(ParceData, ()=>{
                if(err) throw err;
                res.send("入库成功");
            })
        }
    })
})

router.post

module.exports = router;