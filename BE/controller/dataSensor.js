const {dataModel} = require('../model/dataSensor');
const moment = require('moment');
const configTime = require('../time');
module.exports.getData = async (req, res) => {
    try {
        let { keyword, sortKey, sortValue, page, filter, frequent } = req.query;
        let limit = frequent ? parseInt(frequent) : 10; 
        let find = {};
        let sort = {};

        if (sortKey && sortValue) {
            sort[sortKey] = parseInt(sortValue);
        } else {
            sort['createdAt'] = -1;
        }
        
        if (filter && keyword && keyword.trim() !== "") {
            keyword = keyword.trim();

            if (filter === "all") {
                const searchConditions = [];
                if (!isNaN(keyword)) {
                    const numericKeyword = parseFloat(keyword);
                    searchConditions.push(
                        { temperature: numericKeyword },
                        { humidity: numericKeyword },
                        { light: numericKeyword }
                    );
                } 
                
                else {
                    const { start, end } = configTime(keyword);
                    if (start && end) {
                        searchConditions.push({
                            createdAt: { $gte: start, $lte: end }
                        });
                    }
                }

                if (searchConditions.length > 0) {
                    find.$or = searchConditions;
                }

            } else if (filter === "createdAt") {
                const { start, end } = configTime(keyword);
                 if (start && end) {
                    find.createdAt = { $gte: start, $lte: end };
                }
                
            } else {

                if (!isNaN(keyword)) {
                    console.log(parseFloat(keyword));
                    find[filter] = parseFloat(keyword);
                }else{
                    find[filter]= null;
                }
            }
        }

        const totalDoc = await dataModel.countDocuments(find);
        const skipPage = page ? (parseInt(page) - 1) * limit : 0;

        var data = await dataModel.find(find)
            .sort(sort)
            .skip(skipPage)
            .limit(limit)
            .lean();

        data.forEach(item => { 
            item['createdAt'] = moment(item.createdAt).format("HH:mm:ss DD/MM/YYYY");
        });

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

