import React from 'react';
import '../assets/loading.scss';

const FullScreenLoading = ({ isLoading, message = "Đang xử lý..." }) => {
  if (!isLoading) return null;
  
  return (
    <div className="fullscreen-loading">
      <div className="loading-content">
        <div className="spinner"></div>
        <p className="loading-text">{message}</p>
      </div>
    </div>
  );
};

export default FullScreenLoading;
