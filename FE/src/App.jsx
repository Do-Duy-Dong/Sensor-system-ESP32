import {Route,Routes} from 'react-router-dom';
import SmartHomeDashboard from './layouts/homePage';
import DataSensor from './layouts/dataSencor';
import History from './layouts/history';
import Profile from './layouts/profile';
function App(){
  return (
    <Routes>
      <Route path="/" element ={<SmartHomeDashboard />} />
      <Route path="/data" element={<DataSensor />} />
      <Route path="/history" element={<History />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}
export default App;