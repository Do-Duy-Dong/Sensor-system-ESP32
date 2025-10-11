const mongoose= require("mongoose");
const historySchema= new mongoose.Schema({
    device:String,
    action:String,
},{
    timestamps:true 
});
const historyModel= mongoose.model("history", historySchema,"history");
module.exports= historyModel;