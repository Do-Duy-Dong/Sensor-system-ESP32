const History = require('../model/History');
const moment= require('moment');
const configTime= require('../time');
module.exports.getHistory = async (req,res)=>{
    try {
        const {page,filter,keyword,sortKey,sortValue, frequent,filterStatus}= req.query;
        let find={};
        let limit= frequent ? frequent : 10;
        let sort={};
    // Sort
        if(sortKey && sortValue) sort[sortKey]= parseInt(sortValue)
        else sort['createdAt']= -1;
    
    // Filter
        if(filter){
            find.device=filter;
        }
        if(filterStatus){
            find.action= filterStatus;
        }
    // search
        if(keyword){
            const {start,end}= configTime(keyword);
            find.createdAt={
                $gte: start,
                $lte: end
            }
        }
    // Pagination
    const totalDoc= await History.countDocuments(find);
    const skipPage= (page-1)*limit;
    const totalPage= Math.ceil(totalDoc/limit);
    // Query DB
        let history= await History.find(find).skip(skipPage).limit(limit).sort(sort).lean();
        history.forEach(item=>{
            item.createdAt= moment(item.createdAt).format('HH:mm:ss DD/MM/YYYY');
        })
        res.status(200).json({
            doc:history,
            totalPage:totalPage,
            currentPage: page ? parseInt(page) :1
        });
    } catch (error) {
        console.log(error)
    }
}

module.exports.getLedStatus= async (req,res)=>{
    try {
        const arr=["led1","led2","led3"];
        let arr1=[]
        for( i in arr){
            const latestData= await History.findOne({device:arr[i]}).sort({createdAt:-1}).lean();
            arr1.push({
                device: arr[i],
                status: latestData ? latestData.action : "OFF"
            })
        }
        res.status(200).json(arr1);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}