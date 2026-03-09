# ChatBox Project

A chatbox application with React frontend and Django REST Framework backend, powered by Google Gemini AI.

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

### Backend (Python/Django)
```
pip install django djangorestframework django-cors-headers python-dotenv google-genai
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
py manage.py runserver 5000
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

**File:** `backend/chat/views.py`

- **Lines 1-8** - Imports and setup:
```python
from rest_framework.decorators import api_view
from rest_framework.response import Response
from dotenv import load_dotenv
from google import genai
import os

load_dotenv()
```

- **Line 27** - API endpoint definition:
```python
@api_view(['POST'])
def chat(request):
```

- **Lines 30-32** - Receiving request data from frontend:
```python
data = request.data
message = data.get('message')
history = data.get('history', [])
```

- **Line 60** - Sending successful response back to frontend:
```python
return Response({
    'success': True,
    'message': ai_text
})
```

**File:** `backend/chatbox_backend/settings.py`
- CORS configuration allows frontend (localhost:3000) to connect

**File:** `backend/chat/urls.py`
- URL routing: `/api/chat` and `/api/health`
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

### Frontend Files

```
frontend/
├── public/
│   ├── favicon.ico
│   ├── index.html                     (HTML template)
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── ChatBox/
│   │   │   ├── ChatBox.jsx            (main chat component with sidebar)
│   │   │   ├── ChatBoxSimple.jsx      (chat component without sidebar)
│   │   │   ├── ChatBox.css            (typing animation styles)
│   │   │   └── index.js               (component export)
│   │   └── Message/
│   │       ├── Message.jsx            (message bubble component)
│   │       └── index.js               (component export)
│   ├── store/
│   │   ├── chatSlice.js               (Redux state and reducers)
│   │   ├── store.js                   (Redux store configuration)
│   │   └── index.js                   (exports store and actions)
│   ├── App.js                         (main app component)
│   ├── App.css                        (app styles - not used)
│   ├── App.test.js                    (test file)
│   ├── index.js                       (entry point with Redux Provider)
│   ├── index.css                      (global styles, font)
│   ├── logo.svg
│   ├── reportWebVitals.js
│   └── setupTests.js
├── package.json                       (dependencies and scripts)
├── package-lock.json
└── .gitignore
```

### Backend Files

```
backend/
├── chatbox_backend/
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py                    (Django settings, CORS config)
│   ├── urls.py                        (main URL routing)
│   └── wsgi.py
├── chat/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── migrations/
│   ├── models.py
│   ├── tests.py
│   ├── urls.py                        (chat API routes)
│   └── views.py                       (API views with Gemini AI)
├── manage.py                          (Django management script)
├── requirements.txt                   (Python dependencies)
├── db.sqlite3                         (SQLite database)
└── .env                               (API key - not committed to git)
```

### Root Files

```
Chatbox/
├── frontend/
├── backend/
└── README.md
```

---

## All Required Files Summary

### Frontend (12 essential files)
| File | Purpose |
|------|---------|
| `src/index.js` | Entry point, wraps app with Redux Provider |
| `src/App.js` | Main app container with header |
| `src/index.css` | Global styles and font |
| `src/components/ChatBox/ChatBox.jsx` | Chat UI with sidebar |
| `src/components/ChatBox/ChatBoxSimple.jsx` | Chat UI without sidebar |
| `src/components/ChatBox/ChatBox.css` | Typing animation |
| `src/components/ChatBox/index.js` | Export file |
| `src/components/Message/Message.jsx` | Message bubble |
| `src/components/Message/index.js` | Export file |
| `src/store/chatSlice.js` | Redux state and actions |
| `src/store/store.js` | Redux store setup |
| `src/store/index.js` | Store exports |
| `public/index.html` | HTML template |
| `package.json` | Dependencies |

### Backend (3 essential files)
| File | Purpose |
|------|---------|
| `app.py` | Flask server, API routes, Gemini AI integration |
| `requirements.txt` | Python package list |
| `.env` | Environment variables (API key) |

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
