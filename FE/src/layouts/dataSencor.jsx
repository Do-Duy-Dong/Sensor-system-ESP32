import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/dataSencor.scss';
import NavBar from '../components/navbar';
import Pagination from '../components/pagination';
const DataSensor = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchItem, setSearchItem] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('');
  const [searchBool, setSearchBool] = useState(false);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortIcon, setSortIcon] = useState('↕️');
  const [sensorData, setSensorData] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const handleSort = (field) => {

    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    setSortField(field);
    getSortIcon(field);
    

  };
  const getSortIcon = (field) => {
    if (sortField == field) {

      if (sortDirection === 'asc') {
        return ('↑');
      } else {
        return ('↓');
      }
    }
    return ('↕️');
  }
  // Call api
  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get(`${import.meta.env.VITE_API_URL}/getDataSensor?filter=${filter}&keyword=${searchTerm ? searchTerm : ""}&page=${currentPage}&frequent=${itemsPerPage}&sortKey=${sortField}&sortValue=${sortDirection === 'asc' ? 1 : -1}`);
      setSensorData(data.data?.doc);
      setTotalPage(data.data?.totalPage);
      // setCurrentPage(1);
    }
    fetchData();
  }, [currentPage,itemsPerPage,sortDirection,searchItem,searchBool]);

  // Search
  async function hanldeSearch() {
    try {
      setSearchItem(searchTerm);
      setSearchBool(!searchBool)
      // const data = await axios.get(`${import.meta.env.VITE_API_URL}/getDataSensor?filter=${filter}&keyword=${searchTerm ? searchTerm : ""}&frequent=${itemsPerPage}&page=${currentPage}&sortKey=${sortField}&sortValue=${sortDirection === 'asc' ? 1 : -1}`);
      // setSensorData(data?.data?.doc);
      // setTotalPage(data?.data?.totalPage);
    } catch (error) {
      console.log(error);
      setSensorData([]);
      setTotalPage(1);
    }
  }

  // Filter
  async function handleFilter(target) {
    setFilter(target.value);
  }


  // Pagination

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const deleteSearch=()=>{
    window.location.reload();
  }
  return (
    <div className="data-sensor-page">
      {/* Navigation Bar */}
      <NavBar />

      {/* Main Content */}
      <div className="content">
        <div className="page-header">
          <h1>Dữ liệu cảm biến</h1>
        </div>

        {/* Search and Filter Section */}
        <div className="wrapper-bar">
          <div className="filter-bar">
            <select onChange={(e) => handleFilter(e.target)}>
              <option value="all">Tất cả thiết bị</option>
              <option value="temperature">Nhiệt độ</option>
              <option value="humidity">Độ ẩm</option>
              <option value="light">Ánh sáng</option>
              <option value="createdAt">Thời gian</option>
            </select>
          </div>
          <div className="search-section">
            <div className="search-container">
              <input
                type="text"
                placeholder="Tìm kiếm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key == 'Enter' && hanldeSearch()}
                className="search-input"
              />
              
            <button className='deleteButton' onClick={()=>deleteSearch()}>X</button>
            </div>
            <button className="search-btn" onClick={(e) => hanldeSearch()}>
              🔍 Tìm kiếm
            </button>
          </div>

        </div>

        {/* Data Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')}>
                  ID         </th>
                <th onClick={() => handleSort('temperature')}>
                  Nhiệt độ (°C)
                  <span className="sort-icon">{getSortIcon("temperature")}</span>
                </th>
                <th onClick={() => handleSort('humidity')}>
                  Độ ẩm (%)
                  <span className="sort-icon">{getSortIcon("humidity")} </span>
                </th>
                <th onClick={() => handleSort('light')}>
                  Ánh sáng (lux)
                  <span className="sort-icon">{getSortIcon("light")} </span>
                </th>
                <th onClick={() => handleSort('createdAt')}>
                  Thời gian
                  <span className="sort-icon">{getSortIcon("createdAt")} </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sensorData.map((item,index) => (
                <tr key={item.id}>
                  <td>{index+1}</td>
                  <td>{item.temperature}</td>
                  <td>{item.humidity}</td>
                  <td>{item.light}</td>
                  <td>
                    <span className="status-indicator"></span>
                    {item.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='wrapper-pagi'>
          <Pagination
            handlePageChange={handlePageChange}
            currentPage={currentPage}
            totalPages={totalPage} />
          <div className="items-per-page">
            <label>Hiển thị: </label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value));
                setCurrentPage(1); // reset về page 1 khi thay đổi limit
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span> bản ghi / trang</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DataSensor;