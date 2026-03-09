# ChatBox Project

A chatbox application with React frontend and Python Flask backend, powered by Google Gemini AI.

---

## Installation Requirements

### Frontend (Node.js/React)
```
npm install
```

Packages installed:
- react
- react-dom
- @reduxjs/toolkit
- react-redux

### Backend (Python)
```
pip install flask flask-cors python-dotenv google-genai
```

Or install from requirements.txt:
```
pip install -r requirements.txt
```

---

## Terminal Commands

### Start Frontend
```
cd frontend
npm start
```
Runs on: http://localhost:3000

### Start Backend
```
cd backend
py app.py
```
Runs on: http://localhost:5000

---

## Backend-Frontend Connection Points

### Frontend

**File:** `frontend/src/components/ChatBox/ChatBox.jsx` (with sidebar)
- **Line 93** - API call to backend

**File:** `frontend/src/components/ChatBox/ChatBoxSimple.jsx` (without sidebar)
- **Line 59** - API call to backend

```javascript
const response = await fetch('http://localhost:5000/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: inputValue.trim(),
    history: currentMessages.slice(-10),
  }),
});
```

- **URL**: `http://localhost:5000/api/chat`
- **Request body**: `{ message: string, history: array }`
- **Expected response**: `{ success: boolean, message: string }`

### Backend

**File:** `backend/app.py`

- **Line 10** - CORS configuration (allows frontend to connect):
```python
CORS(app, origins=['http://localhost:3000'])
```

- **Line 29** - API endpoint definition:
```python
@app.route('/api/chat', methods=['POST'])
def chat():
```

- **Lines 32-34** - Receiving request data from frontend:
```python
data = request.get_json()
message = data.get('message')
history = data.get('history', [])
```

- **Line 66** - Sending successful response back to frontend:
```python
return jsonify({
    'success': True,
    'message': ai_text
})
```

---

## Environment Variables

Create a `.env` file in the `backend/` folder:
```
GEMINI_API_KEY=your_api_key_here
PORT=5000
```

Get your API key at: https://aistudio.google.com

---

## File Structure

```
Chatbox/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatBox/
│   │   │   │   ├── ChatBox.jsx        (with sidebar)
│   │   │   │   ├── ChatBoxSimple.jsx  (without sidebar)
│   │   │   │   └── ChatBox.css
│   │   │   └── Message/
│   │   │       └── Message.jsx
│   │   ├── store/
│   │   │   ├── index.js               (exports store and actions)
│   │   │   ├── store.js               (Redux store configuration)
│   │   │   └── chatSlice.js           (chat state and reducers)
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── .env
└── README.md
```

---

## Switching Between ChatBox Versions

In `frontend/src/App.js`, change the import:

**With sidebar:**
```javascript
import ChatBox from './components/ChatBox/ChatBox';
```

**Without sidebar:**
```javascript
import ChatBox from './components/ChatBox/ChatBoxSimple';
```

---

## Quick Reference

| Item | Frontend | Backend |
|------|----------|---------|
| Port | 3000 | 5000 |
| URL | localhost:3000 | localhost:5000/api/chat |
| Start command | `npm start` | `py app.py` |
| Request format | `{ message, history }` | `request.get_json()` |
| Response format | `data.message` | `{ success, message }` |
