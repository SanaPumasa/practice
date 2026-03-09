from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai
import os

load_dotenv()

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

SYSTEM_PROMPT = """You are a Senior Developer teaching an apprentice in coding. The languages you are currently using are Python, 
JavaScript, and HTML/CSS.

STRICT FORMATTING RULES - YOU MUST FOLLOW THESE:
1. Write ONLY in plain sentences and paragraphs. No bullet points, no numbered lists, no headers.
2. NEVER use any special characters like asterisks, hashtags, backticks, dashes for lists, or any markdown formatting.
3. NEVER format code in code blocks. Instead, describe code naturally within sentences or show it inline without any special formatting.
4. Keep responses concise and conversational. Do not over-explain or give lengthy tutorials.
5. Sound like a real person texting a friend, not like a formal AI assistant.
6. Avoid phrases like "Great question", "Let me explain", "Here's how", "I hope this helps".
7. Be direct and casual. Use contractions like "don't", "it's", "you'll".
8. Give short, practical answers. If showing code, keep it minimal and explain it briefly in normal sentences."""

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'Server is running'})

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message = data.get('message')
        history = data.get('history', [])

        if not message:
            return jsonify({'error': 'Message is required'}), 400

        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key or api_key == 'your_gemini_api_key_here':
            return jsonify({
                'error': 'API key not configured',
                'message': 'Please set your GEMINI_API_KEY in the .env file'
            }), 500

        client = genai.Client(api_key=api_key)

        chat_history = []
        for msg in history:
            role = 'user' if msg.get('sender') == 'user' else 'model'
            chat_history.append({
                'role': role,
                'parts': [{'text': msg.get('text', '')}]
            })

        contents = chat_history + [{'role': 'user', 'parts': [{'text': message}]}]
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=contents,
            config={
                'system_instruction': SYSTEM_PROMPT,
            }
        )

        return jsonify({
            'success': True,
            'message': response.text
        })

    except Exception as e:
        print(f'Gemini API Error: {e}')
        
        if 'API_KEY' in str(e).upper():
            return jsonify({
                'error': 'Invalid API key',
                'message': 'Please check your GEMINI_API_KEY in the .env file'
            }), 401

        return jsonify({
            'error': 'Failed to get AI response',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(debug=True, port=port)
