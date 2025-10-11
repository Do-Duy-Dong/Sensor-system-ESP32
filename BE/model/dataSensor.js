const mongoose= require("mongoose")
const dataSchema= new mongoose.Schema({
    temperature: Number,
    humidity:Number,
    light: Number,
},{
    timestamps:true
});
const dataModel= mongoose.model("dataSensor", dataSchema,"dataSensor");
module.exports= dataModel;