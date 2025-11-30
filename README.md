# 🎯 CodeGen Pro - QR & Barcode Generator

A premium web application for generating QR codes and barcodes with a stunning glassmorphic UI. Built with React and Flask.

## ✨ Features

- **Generate QR Codes & Barcodes** - Create high-quality codes instantly
- **Live Preview** - See your generated code immediately
- **History Management** - View all previously generated codes
- **Download Images** - Save codes as PNG images
- **Responsive Design** - Works perfectly on all devices
- **Glassmorphic UI** - Beautiful, modern interface with smooth animations
- **Filter Options** - Filter history by type (QR/Barcode)
- **Delete Functionality** - Remove unwanted entries

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Installation & Setup

#### 1. Backend Setup

```powershell
# Navigate to Backend directory
cd Backend

# Install Python dependencies
pip install -r requirements.txt

# Start the Flask server
python GenCode.py
```

The backend server will start on `http://localhost:5000`

#### 2. Frontend Setup

```powershell
# Open a new terminal
# Navigate to Frontend directory
cd Frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:3000`

## 📁 Project Structure

```
BarCode_Generator/
├── Backend/
│   ├── GenCode.py          # Flask API server
│   ├── requirements.txt    # Python dependencies
│   ├── generated/          # Generated images (auto-created)
│   └── history.json        # Generation history (auto-created)
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Generator.jsx    # Code generation form
│   │   │   ├── History.jsx      # History viewer
│   │   │   ├── Preview.jsx      # Preview component
│   │   │   └── *.css           # Component styles
│   │   ├── App.jsx              # Main app component
│   │   ├── App.css              # Main app styles
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
```

## 🎨 Technology Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool & dev server
- **Axios** - HTTP client
- **CSS3** - Styling with glassmorphism effects

### Backend
- **Flask** - Python web framework
- **Flask-CORS** - Cross-origin resource sharing
- **qrcode** - QR code generation
- **python-barcode** - Barcode generation
- **Pillow** - Image processing


