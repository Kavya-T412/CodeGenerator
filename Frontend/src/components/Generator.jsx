import React, { useState } from 'react';
import axios from 'axios';
import './Generator.css';

const Generator = ({ onGenerate }) => {
  const [type, setType] = useState('qrcode');
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!data.trim()) {
      setError('Please enter some data');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/generate', {
        type,
        data: data.trim()
      });

      if (response.data.success) {
        onGenerate(response.data);
        setData('');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generator-container">
      <div className="generator-card glass-effect">
        <div className="card-header">
          <h2 className="gradient-text">Generate Code</h2>
          <p className="subtitle">Create QR codes and barcodes instantly</p>
        </div>

        <form onSubmit={handleSubmit} className="generator-form">
          <div className="form-group">
            <label className="form-label">Select Type</label>
            <div className="type-selector">
              <button
                type="button"
                className={`type-btn ${type === 'qrcode' ? 'active' : ''}`}
                onClick={() => setType('qrcode')}
              >
                <span className="icon">📱</span>
                <span>QR Code</span>
              </button>
              <button
                type="button"
                className={`type-btn ${type === 'barcode' ? 'active' : ''}`}
                onClick={() => setType('barcode')}
              >
                <span className="icon">📊</span>
                <span>Barcode</span>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              {type === 'qrcode' ? 'Enter URL or Text' : 'Enter Data'}
            </label>
            <textarea
              className="form-input"
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder={type === 'qrcode' 
                ? 'https://example.com or any text...' 
                : 'Enter alphanumeric data...'}
              rows="4"
            />
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="generate-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Generating...
              </>
            ) : (
              <>
                <span className="btn-icon">✨</span>
                Generate {type === 'qrcode' ? 'QR Code' : 'Barcode'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Generator;
