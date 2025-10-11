import React, { useEffect, useState } from 'react';
import '../assets/dataSencor.scss';
import axios from 'axios';
import NavBar from '../components/navbar';
import Pagination from '../components/pagination';

const History = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchItem,setSearchItem]= useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const [sensorData, setSensorData] = useState([]);
  const [filter, setFilter] = useState('');

  // ===== Sort handling =====
  const handleSort = (field) => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    setSortField(field);
  };

  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? '↑' : '↓';
    }
    return '↕️';
  };

  // ===== Fetch API =====
  useEffect(() => {
    const fetchData = async () => {
      const record = await axios.get(
        `${import.meta.env.VITE_API_URL}/getHistory?page=${currentPage}&limit=${itemsPerPage}&sortKey=${sortField}&sortValue=${sortDirection === 'asc' ? 1 : -1}&filter=${filter}&keyword=${searchItem}&frequent=${itemsPerPage}&filterStatus=${filterStatus}`
      );
      setSensorData(record.data?.doc);
      setCurrentPage(record.data?.currentPage);
      setTotalPage(record.data?.totalPage);
    };
    fetchData();
  }, [currentPage, itemsPerPage, sortDirection, sortField, filter,searchItem,filterStatus]);

  // ===== Search =====
  async function handleSearch() {
    try {
      setSearchItem(searchTerm);
      // searchItem= searchTerm;
      // const record = await axios.get(
      //   `${import.meta.env.VITE_API_URL}/getHistory?filter=${filter}&keyword=${searchTerm}&page=${currentPage}&limit=${itemsPerPage}&sortKey=${sortField}&sortValue=${sortDirection === 'asc' ? 1 : -1}`
      // );
      // setSensorData(record.data?.doc);
      // setTotalPage(record.data?.totalPage);
    } catch (error) {
      console.log(error);
      setSensorData([]);
      setTotalPage(1);
    }
  }

  // ===== Filter =====
  async function handleFilter(target) {
    setFilter(target.value);
    setCurrentPage(1);
  }

  // ===== Pagination =====
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
          <h1>Lịch sử</h1>
        </div>

        {/* Search + Filter */}
        <div className='wrapper-filter'>
          {/* Filter device */}
          <div className="filter-bar">
            <div>Thiết bị </div>
            <select name="device" onChange={(e) => handleFilter(e.target)}>
              <option value="">Tất cả</option>
              <option value="led1">Đèn 1</option>
              <option value="led2">Đèn 2</option>
              <option value="led3">Đèn 3</option>
            </select>
          </div>
    {/* Filter status */}
          <div className="filter-bar">
          <div>Trạng thái</div>
            <select name="status" onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">Tất cả</option>
              <option value="OFF">Tắt</option>
              <option value="ON">Bật</option>
            </select>
          </div>
        </div>
        <div className="wrapper-bar">
          

          {/* Search */}
          
          <div className="search-section">
            <div className="search-container">
              <input
                type="text"
                placeholder="Tìm kiếm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key == 'Enter' && handleSearch()}
                className="search-input"
              />
              <button className='deleteButton' onClick={()=>deleteSearch()}>X</button>
            </div>
            <button className="search-btn" onClick={handleSearch}>
              🔍 Tìm kiếm
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>
                  ID 
                </th>
                <th>
                  Thiết bị 
                </th>
                <th>
                  Hành động
                </th>
                <th onClick={() => handleSort('createdAt')}>
                  Thời gian <span className="sort-icon">{getSortIcon('createdAt')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sensorData.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{index + 1}</td>
                  <td>{item.device}</td>
                  <td>{item.action === 'ON' ? 'Bật' : 'Tắt'}</td>
                  <td>
                    <span className="status-indicator"></span>
                    {item.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination + Items per page */}
        <div className="wrapper-pagi">
          <Pagination
            handlePageChange={handlePageChange}
            currentPage={currentPage}
            totalPages={totalPage}
          />
          <div className="items-per-page">
            <label>Hiển thị: </label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value));
                setCurrentPage(1);
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

export default History;
