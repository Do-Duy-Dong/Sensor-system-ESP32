const mongoose= require("mongoose")
const dataSchema= new mongoose.Schema({
    temperature: Number,
    humidity:Number,
    light: Number,
},{
    timestamps:true
});
const dataModel= mongoose.model("dataSensor", dataSchema,"dataSensor");
const streamFunc= async ()=>{
    const changeStream= dataModel.watch([], { fullDocument: 'updateLookup' });
    changeStream.on('change',(change)=>{
        console.log(change.operationType);
    })
    changeStream.on('error',(err)=>{
        console.log(err)
    })
}
module.exports= {dataModel,streamFunc};
