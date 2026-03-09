from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from google import genai
import os

SYSTEM_PROMPT = """You are a Senior Developer teaching an apprentice in coding. The languages you are currently using are Python, JavaScript, and HTML/CSS.

STRICT FORMATTING RULES - YOU MUST FOLLOW THESE:
1. Write ONLY in plain sentences and paragraphs. No bullet points, no numbered lists, no headers.
2. NEVER use any special characters like asterisks, hashtags, backticks, dashes for lists, or any markdown formatting.
3. NEVER format code in code blocks. Instead, describe code naturally within sentences or show it inline without any special formatting.
4. Keep responses concise and conversational. Do not over-explain or give lengthy tutorials.
5. Sound like a real person texting a friend, not like a formal AI assistant.
6. Avoid phrases like "Great question", "Let me explain", "Here's how", "I hope this helps".
7. Be direct and casual. Use contractions like "don't", "it's", "you'll".
8. Give short, practical answers. If showing code, keep it minimal and explain it briefly in normal sentences."""


@api_view(['GET'])
def health(request):
    """Health check endpoint"""
    return Response({'status': 'ok', 'message': 'Server is running'})


@api_view(['POST'])
def chat(request):
    """Chat endpoint for Gemini AI"""
    try:
        message = request.data.get('message')
        history = request.data.get('history', [])

        if not message:
            return Response(
                {'error': 'Message is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key or api_key == 'your_gemini_api_key_here':
            return Response({
                'error': 'API key not configured',
                'message': 'Please set your GEMINI_API_KEY in the .env file'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        client = genai.Client(api_key=api_key)

        # Build chat history
        chat_history = []
        for msg in history:
            role = 'user' if msg.get('sender') == 'user' else 'model'
            chat_history.append({
                'role': role,
                'parts': [{'text': msg.get('text', '')}]
            })

        contents = chat_history + [{'role': 'user', 'parts': [{'text': message}]}]

        # Generate response from Gemini
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=contents,
            config={
                'system_instruction': SYSTEM_PROMPT,
            }
        )

        return Response({
            'success': True,
            'message': response.text
        })

    except Exception as e:
        print(f'Gemini API Error: {e}')

        if 'API_KEY' in str(e).upper():
            return Response({
                'error': 'Invalid API key',
                'message': 'Please check your GEMINI_API_KEY in the .env file'
            }, status=status.HTTP_401_UNAUTHORIZED)

        return Response({
            'error': 'Failed to get AI response',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
