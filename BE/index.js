const express= require('express');
const mqtt= require('mqtt');
const {createServer} = require('http');
const {Server }= require('socket.io');
const app= express();
const cors= require('cors');
const httpServer= createServer(app);
const route= require('./route');
const dataSensor= require("./model/dataSensor");
const History= require("./model/History");
const { default: mongoose } = require('mongoose');

const io= new Server(httpServer, {
    cors:{
        origin:"*"
    }
});
app.use(cors());
const mqttUrl= "mqtt:// 192.168.244.129:1883";
const user='tripled'
const password= '842004'
const mqttClient= mqtt.connect(mqttUrl,{
    username: user,
    password: password  
});

// Connect to Database
mongoose.connect("mongodb://localhost:27017/iot")
.then(()=>{
    console.log('Connected to MongoDB');
})
.catch(err=>{
    console.log('Failed to connect to MongoDB', err);
})
// Route
route(app);
// Connect to Socket
io.on('connection',(socket)=>{
    console.log('Connetted client');
    socket.on('ledReq',(data)=>{
        let topic= `home/${data.name}`
        let msg= data.status ? "ON":"OFF";
        mqttClient.publish(topic,msg, err=>{
            if (err){
                console.log('Failed to publish message', err);
            }
        });
    })
    // socket.emit('dataSensor',{
    //     temperature: 25.5,
    //     humidity: 52,
    //     light: 3
    // })
});

mqttClient.on('connect',()=>{
    console.log('Connected to MQTT broker');
    mqttClient.subscribe('home/sensor',(err)=>{
        if(!err){
            console.log('Subscribed to topic home/sensor');
        }else{
            console.error('Failed to subscribe:', err);
        }
    })
    mqttClient.subscribe('home/ledStatus',(err)=>{
        if(!err){
            console.log('Subscribed to topic home/ledStatus');
        }else{
            console.error('Failed to subscribe:', err);
        }
    })
    mqttClient.subscribe("home/status");
})
mqttClient.on('message',async (topic,message)=>{
    if(topic=="home/status"){
        const msg= message.toString();
        if(msg=="ON") console.log("System is ON");
        else{
            let devices= ["led1","led2","led3"];
            for(let i in devices){
                const led= await History.findOne({device: devices[i]}).sort({createdAt: -1});
                if(led.action=="ON"){
                const record= new History({
                    device: devices[i],
                    action: "OFF"
                })
                await record.save();
            }}
            io.emit('ledStatus',{
                name: "all",
                msg: 0
            })
        }
    }
    if(topic == "home/sensor"){
        // Lưu DB
        const tmpData= JSON.parse(message.toString());
        try {
            const record= new dataSensor({
                temperature: tmpData.temperature,
                light: tmpData.light,
                humidity: tmpData.humidity  
            });
            await record.save();
        } catch (error) {
            console.log(error);
        }
        // Gửi msg đi
        io.emit('dataSensor', tmpData);
    }
    if(topic == "home/ledStatus"){
        // Lưu DB
        try {
            const tmpLed=JSON.parse(message.toString());
            let keyLed="";
            let valueLed=0;
            for(key in tmpLed){
                keyLed= key;
                valueLed= tmpLed[key];
                break;
            }
            const record= new History({
                device: keyLed,
                action: valueLed == 1 ? "ON":"OFF"
            });
            await record.save();
            io.emit('ledStatus',{
                name: keyLed,
                msg: 1
            })
        } catch (error) {
            console.log(error);
        }
    }
});

httpServer.listen(3000,()=>{
    console.log('Server is running on port 3000');
})
