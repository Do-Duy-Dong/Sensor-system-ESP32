const DataSensor = require('../model/dataSensor');
const moment = require('moment');
const configTime = require('../time');
module.exports.getData = async (req, res) => {
    try {
        // await DataSensor.deleteMany({});
        let { keyword, sortKey, sortValue, page, filter,frequent } = req.query;
        let limit= frequent ? frequent : 10;
        let find = {};
        let sort = {};
        if (sortKey && sortValue) sort[sortKey] = parseInt(sortValue)
        else sort['createdAt'] = -1
        if(filter){
            keyword = keyword ? keyword.trim() : "";
            let arr=[]
            if (filter == "all") {
                if(!isNaN(parseFloat(keyword))){
                arr=[
                    { temperature: parseFloat(keyword) },
                    { humidity: parseFloat(keyword) },
                    { light: parseFloat(keyword) }
                ]}
                if(isNaN(keyword)){
                    
                    const { start, end } = configTime(keyword);
                    arr.push({
                        createdAt: {
                            $gte: start,
                            $lte: end
                        }
                    })
                }
                find = {
                    $or: arr
                }
            } else if (filter == "createdAt") {
                const { start, end } = configTime(keyword);
                find['createdAt'] = {
                    $gte: start,
                    $lte: end
                }
            }
            else {
                find = {
                    [filter]: parseFloat(keyword)
                }
            }
        }
        const totalDoc = await DataSensor.countDocuments(find);
        const skipPage = page ? (page - 1) * limit : 0;

        var data = await DataSensor.find(
            find
        ).sort(sort).skip(skipPage).limit(limit).lean();

        data.map(item => {
            item['createdAt'] = moment(item.createdAt).format("HH:mm:ss DD/MM/YYYY");
        })
        res.status(200).json({
            doc: data,
            totalPage: Math.ceil(totalDoc / limit),
            currentPage: page ? parseInt(page) : 1
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

