import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './History.css';

const History = ({ refreshTrigger }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/history');
      if (response.data.success) {
        setHistory(response.data.history.reverse());
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (item) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/image/${item.filename}`,
        { responseType: 'blob' }
      );
      const imageUrl = URL.createObjectURL(response.data);
      setSelectedImage({ ...item, url: imageUrl });
    } catch (err) {
      console.error('Failed to load image:', err);
    }
  };

  const handleDownload = async (filename) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/download/${filename}`,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to download:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/delete/${id}`);
      fetchHistory();
      if (selectedImage?.id === id) {
        setSelectedImage(null);
      }
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter(item => item.type === filter);

  if (loading) {
    return (
      <div className="history-container">
        <div className="loading-spinner">
          <div className="spinner-large"></div>
          <p>Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header glass-effect">
        <h2 className="gradient-text">Generation History</h2>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'qrcode' ? 'active' : ''}`}
            onClick={() => setFilter('qrcode')}
          >
            QR Codes
          </button>
          <button
            className={`filter-btn ${filter === 'barcode' ? 'active' : ''}`}
            onClick={() => setFilter('barcode')}
          >
            Barcodes
          </button>
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="empty-state glass-effect">
          <span className="empty-icon">📭</span>
          <h3>No items yet</h3>
          <p>Generate your first {filter === 'all' ? 'code' : filter} to see it here!</p>
        </div>
      ) : (
        <div className="history-grid">
          {filteredHistory.map((item) => (
            <div key={item.id} className="history-item glass-effect">
              <div className="item-header">
                <span className={`item-type ${item.type}`}>
                  {item.type === 'qrcode' ? '📱 QR Code' : '📊 Barcode'}
                </span>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item.id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
              
              <div className="item-data">
                <p className="data-label">Data:</p>
                <p className="data-value">{item.data}</p>
              </div>

              <div className="item-footer">
                <span className="item-date">{formatDate(item.timestamp)}</span>
                <div className="item-actions">
                  <button
                    className="action-btn view-btn"
                    onClick={() => handleView(item)}
                  >
                    👁️ View
                  </button>
                  <button
                    className="action-btn download-btn"
                    onClick={() => handleDownload(item.filename)}
                  >
                    💾 Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content glass-effect" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <div className="modal-header">
              <h3>{selectedImage.type === 'qrcode' ? 'QR Code' : 'Barcode'}</h3>
              <span className="modal-date">{formatDate(selectedImage.timestamp)}</span>
            </div>
            <div className="modal-image">
              <img src={selectedImage.url} alt={selectedImage.type} />
            </div>
            <div className="modal-data">
              <p><strong>Data:</strong></p>
              <p className="data-text">{selectedImage.data}</p>
            </div>
            <div className="modal-actions">
              <button
                className="modal-btn download"
                onClick={() => handleDownload(selectedImage.filename)}
              >
                💾 Download
              </button>
              <button
                className="modal-btn close"
                onClick={() => setSelectedImage(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
