from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import barcode
from barcode.writer import ImageWriter
import qrcode
import os
import json
from datetime import datetime
import io
import base64

app = Flask(__name__)
CORS(app)

# Create directories for storing generated codes
GENERATED_DIR = 'generated'
HISTORY_FILE = 'history.json'

if not os.path.exists(GENERATED_DIR):
    os.makedirs(GENERATED_DIR)

def load_history():
    """Load generation history from JSON file"""
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, 'r') as f:
            return json.load(f)
    return []

def save_history(history):
    """Save generation history to JSON file"""
    with open(HISTORY_FILE, 'w') as f:
        json.dump(history, f, indent=2)

def add_to_history(code_type, data, filename):
    """Add a new entry to the history"""
    history = load_history()
    entry = {
        'id': len(history) + 1,
        'type': code_type,
        'data': data,
        'filename': filename,
        'timestamp': datetime.now().isoformat()
    }
    history.append(entry)
    save_history(history)
    return entry

@app.route('/api/generate', methods=['POST'])
def generate_code():
    """Generate QR code or barcode based on user input"""
    try:
        data = request.json
        code_type = data.get('type')  # 'qrcode' or 'barcode'
        text_data = data.get('data')
        
        if not code_type or not text_data:
            return jsonify({'error': 'Missing type or data'}), 400
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        if code_type == 'qrcode':
            # Generate QR Code
            filename = f'qrcode_{timestamp}.png'
            filepath = os.path.join(GENERATED_DIR, filename)
            
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_H,
                box_size=10,
                border=4,
            )
            qr.add_data(text_data)
            qr.make(fit=True)
            img = qr.make_image(fill_color="black", back_color="white")
            img.save(filepath)
            
        elif code_type == 'barcode':
            # Generate Barcode
            filename = f'barcode_{timestamp}.png'
            filepath = os.path.join(GENERATED_DIR, filename)
            
            barcode_class = barcode.get_barcode_class('code128')
            barcode_instance = barcode_class(text_data, writer=ImageWriter())
            barcode_instance.save(filepath.replace('.png', ''))
            
        else:
            return jsonify({'error': 'Invalid type. Use "qrcode" or "barcode"'}), 400
        
        # Convert image to base64 for immediate display
        with open(filepath, 'rb') as img_file:
            img_base64 = base64.b64encode(img_file.read()).decode('utf-8')
        
        # Add to history
        entry = add_to_history(code_type, text_data, filename)
        
        return jsonify({
            'success': True,
            'filename': filename,
            'image': f'data:image/png;base64,{img_base64}',
            'entry': entry
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    """Get all generation history"""
    try:
        history = load_history()
        return jsonify({'success': True, 'history': history})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/image/<filename>', methods=['GET'])
def get_image(filename):
    """Get a specific image file"""
    try:
        filepath = os.path.join(GENERATED_DIR, filename)
        if os.path.exists(filepath):
            return send_file(filepath, mimetype='image/png')
        return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download/<filename>', methods=['GET'])
def download_image(filename):
    """Download a specific image file"""
    try:
        filepath = os.path.join(GENERATED_DIR, filename)
        if os.path.exists(filepath):
            return send_file(
                filepath,
                mimetype='image/png',
                as_attachment=True,
                download_name=filename
            )
        return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/delete/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    """Delete a history item and its associated file"""
    try:
        history = load_history()
        item = next((item for item in history if item['id'] == item_id), None)
        
        if not item:
            return jsonify({'error': 'Item not found'}), 404
        
        # Delete the file
        filepath = os.path.join(GENERATED_DIR, item['filename'])
        if os.path.exists(filepath):
            os.remove(filepath)
        
        # Remove from history
        history = [item for item in history if item['id'] != item_id]
        save_history(history)
        
        return jsonify({'success': True, 'message': 'Item deleted'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'Server is running'})

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')