const dataController = require("./controller/dataSensor");
const historyController = require("./controller/historyController");
module.exports= (app)=>{
    app.get("/api/getDataSensor",dataController.getData);
    app.get("/api/getHistory",historyController.getHistory);
    app.get("/api/getStatus",historyController.getLedStatus);
}