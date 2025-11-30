import React, { useState } from 'react';
import Generator from './components/Generator';
import History from './components/History';
import Preview from './components/Preview';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('generate');
  const [currentPreview, setCurrentPreview] = useState(null);
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleGenerate = (result) => {
    setCurrentPreview({
      image: result.image,
      type: result.entry.type,
      data: result.entry.data,
      filename: result.filename
    });
    setRefreshHistory(prev => prev + 1);
  };

  const handleDownload = () => {
    if (currentPreview) {
      const link = document.createElement('a');
      link.href = currentPreview.image;
      link.download = currentPreview.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleClear = () => {
    setCurrentPreview(null);
  };

  return (
    <div className="app">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Header */}
      <header className="app-header glass-effect">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🎯</span>
            <h1 className="logo-text gradient-text">CodeGen Pro</h1>
          </div>
          <p className="tagline">Premium QR & Barcode Generator</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="app-nav glass-effect">
        <button
          className={`nav-btn ${activeTab === 'generate' ? 'active' : ''}`}
          onClick={() => setActiveTab('generate')}
        >
          <span className="nav-icon">✨</span>
          <span>Generate</span>
        </button>
        <button
          className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <span className="nav-icon">📚</span>
          <span>History</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="app-main">
        <div className="content-wrapper">
          {activeTab === 'generate' && (
            <div className="tab-content">
              <Generator onGenerate={handleGenerate} />
              {currentPreview && (
                <Preview
                  image={currentPreview.image}
                  type={currentPreview.type}
                  data={currentPreview.data}
                  onDownload={handleDownload}
                  onClear={handleClear}
                />
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="tab-content">
              <History refreshTrigger={refreshHistory} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Built with ❤️ using React & Flask</p>
      </footer>
    </div>
  );
}

export default App;
