import React from 'react';
import './Preview.css';

const Preview = ({ image, type, data, onDownload, onClear }) => {
  if (!image) {
    return null;
  }

  return (
    <div className="preview-container">
      <div className="preview-card glass-effect">
        <div className="preview-header">
          <h3 className="gradient-text">
            {type === 'qrcode' ? '📱 QR Code Generated' : '📊 Barcode Generated'}
          </h3>
          <button className="close-btn" onClick={onClear} title="Close">
            ✕
          </button>
        </div>

        <div className="preview-image">
          <img src={image} alt={type} />
        </div>

        <div className="preview-data">
          <p className="data-label">Encoded Data:</p>
          <p className="data-value">{data}</p>
        </div>

        <div className="preview-actions">
          <button className="action-btn download-btn" onClick={onDownload}>
            <span className="btn-icon">💾</span>
            Download Image
          </button>
        </div>

        <div className="success-message">
          <span className="success-icon">✅</span>
          Successfully generated!
        </div>
      </div>
    </div>
  );
};

export default Preview;
