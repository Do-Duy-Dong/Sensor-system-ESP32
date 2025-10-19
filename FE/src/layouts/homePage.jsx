import React, { useState, useEffect, useRef } from 'react';
import * as Chart from 'chart.js';
import {io} from 'socket.io-client';
import ChartTmp from "../components/chartLine"
// import ChartLight from "../components/chartLight";
import NavBar from '../components/navbar';
import Loading from '../components/loading';
import '../assets/SmartHomeDashboard.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const socket= io("http://localhost:3000");
const SmartHomeDashboard = () => {
  const [devices, setDevices] = useState(()=>{
    const localS= localStorage.getItem("deviceStatus");
    return localS ? JSON.parse(localS):
    {
    led1: { status: false },
    led2: { status: false},
    led3: { status: false }
  }
  });
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [light, setLight] = useState('');
  const [loading, setLoading] = useState(false);
  const [timestamp,setTimestamp]= useState('');
  const [alert,setAlert]= useState(false);
  const timeoutRef = useRef(null);

  const toggleDevice = (deviceName) => {
    setDevices(prev => ({
      ...prev,
      [deviceName]: {
        ...prev[deviceName],
        status: !prev[deviceName].status
      }
    }));
  };

  const StatCard = ({ icon, label, value, unit, color, trend,className }) => (
    <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="stat-header">
        <span className="stat-icon" style={{ color }}>{icon}</span>
      </div>
      <div className="stat-content">
        <h3 className={className}>{value}<span>{unit}</span></h3>
        <p>{label}</p>
      </div>
    </div>
  );

  const DeviceCard = ({ device, name, icon, title, isActive, onToggle, children }) => (
    <div className={`device-card ${isActive ? 'active' : ''}`}>
      <div className="device-header">
        <div className="device-info">
          <span className="device-icon">{icon}</span>
          <span className="device-title">{title}</span>
        </div>
        <label className="switch">
          <input type="checkbox" checked={isActive} onChange={() => {
            setLoading(true);
            socket.emit("ledReq",{
              name: name,
              status: !isActive
            })

            timeoutRef.current= setTimeout(()=>{
              setLoading(false);
              toast.error("Lỗi kết nối với thiết bị!")
            },5000); 
            }} />
          <span className="slider round"></span>
        </label>
      </div>
      {children && (
        <div className="device-controls">
          {children}
        </div>
      )}
    </div>
  );

  const getStatusClass = (type,value) => {

    if (type === "temperature") {
      if (value < 10) return "level-1";
      if (value < 20) return "level-2";
      if (value < 30) return "level-3";
      if (value < 40) return "level-4";
      return "level-5";
    }
  
    if (type === "humidity") {
      if (value < 20) return "level-1";
      if (value < 40) return "level-2";
      if (value < 70) return "level-3";
      if (value < 80) return "level-4";
      return "level-5";
    }
  
    if (type === "light") {
      if (value < 20) return "level-5";      // 0 – 809
      if (value < 40) return "level-4";     // 810 – 1619
      if (value < 60) return "level-3";     // 1620 – 2429
      if (value < 80) return "level-2";     // 2430 – 3239
      return "level-1";                       // 3240 – 4050+
    }
    
  
    return "";
    }                   

  useEffect(() => {
    socket.on("dataSensor",(data)=>{
      setHumidity(data.humidity);
      setTemperature(data.temperature);
      setLight(data.light);
      setTimestamp(new Date().toISOString());

    })
  },[]);
  useEffect(() => {
    socket.on("ledStatus",(data)=>{
      if( data.msg == 1){
        console.log(data.name)
        clearTimeout(timeoutRef.current)
        toast.success(`${data.action==1 ? "Bật" : "Tắt"} đèn thành công`)
        setLoading(false);
        toggleDevice(data.name)
      }else{
        setDevices(prev => {
          const arr={}
          for(let key in prev){
            arr[key]={
              status: false
            }
          }
          return arr;
        });
        toast.alert("Hệ thống đã tắt")
      }
    })
  },[]);
  useEffect(() => {
    localStorage.setItem("deviceStatus", JSON.stringify(devices));
  }, [devices]);
  return (
    <div className="smart-home-dashboard">

      {loading && <Loading isLoading={loading}/>}
      <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      <NavBar />
      <div className="main-content">
      <div>
        <div className="stats-grid">
          <StatCard 
            icon="🌡️" 
            label="Nhiệt độ" 
            value={temperature} 
            
            unit="°C" 
            color="#4ECDC4"
            trend={2}
            className={getStatusClass("temperature",temperature)}
          />
          <StatCard 
            icon="💧" 
            label="Độ ẩm" 
            value={humidity} 
           
            unit="%" 
            color="#4ECDC4"
            trend={-5}
            className={getStatusClass("humidity",humidity)}
          />
          <StatCard 
            icon="💡" 
            label="Ánh sáng" 
            value={light} 
            // value={40}
            unit="lux" 
            color="#4ECDC4"
            trend={-12}
            className={getStatusClass("light",light)}
          />
        </div>

        <div className="content-grid">
          <div className="chart-section">
            <div className="chart-card">
              <div className="chart-header">
                <h3>Nhiệt độ và độ ẩm </h3>
                <span className="chart-period">Trong 24 giờ</span>
              </div>
              <div className="chart-container">
                <ChartTmp 
                  humiditi={humidity}
                  temp={temperature}
                  lights={light}
                  timestamp={timestamp}
                />
              </div>
            </div>

            {/* <div className="chart-card">
              <div className="chart-header">
                <h3>Ánh sáng</h3>
                <span className="chart-period">Trong 24 giờ</span>
              </div>
              <div className="chart-container">
                 <ChartLight 
                 light={light}
                 />

              </div>
            </div> */}
          </div>

        </div>
      </div>
        <div className="devices-section">
            <div className="devices-grid">
              <DeviceCard
                device={devices.led1}
                name="led1"
                icon="💡"
                title="Đèn 1"
                isActive={devices.led1.status}
                onToggle={toggleDevice}
              >
                <div className="temp-control">
                  {/* <span>Bật</span> */}
                </div>
              </DeviceCard>

              <DeviceCard
                device={devices.led2}
                name="led2"
                icon="💡"
                title="Đèn 2"
                isActive={devices.led2.status}
                onToggle={toggleDevice}
              >
                <div className="brightness-control">
                  {/* <span>Bật</span> */}
                </div>
              </DeviceCard>

              <DeviceCard
                device={devices.led3}
                name="led3"
                icon="💡"
                title="Đèn 3"
                isActive={devices.led3.status}
                onToggle={toggleDevice}
              ><div className="brightness-control">
              {/* <span>Bật</span> */}
            </div>
          </DeviceCard>

              
            </div>
          </div>
      </div>
    </div>
  );
};

export default SmartHomeDashboard;