from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import re
from nltk.corpus import stopwords
import nltk

nltk.download('stopwords', quiet=True)

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, '..', 'model')

with open(os.path.join(MODEL_DIR, 'model.pkl'), 'rb') as f:
    model = pickle.load(f)

with open(os.path.join(MODEL_DIR, 'vectorizer.pkl'), 'rb') as f:
    vectorizer = pickle.load(f)

stop_words = set(stopwords.words('english'))

def clean_text(text):
    if not isinstance(text, str):
        return ''
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    words = text.split()
    words = [w for w in words if w not in stop_words]
    return ' '.join(words)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    message = data.get('message', '')
    cleaned = clean_text(message)
    vectorized = vectorizer.transform([cleaned])
    prediction = model.predict(vectorized)[0]
    confidence = model.predict_proba(vectorized)[0].max()
    result = 'spam' if prediction == 1 else 'ham'
    return jsonify({
        'result': result,
        'confidence': round(float(confidence) * 100, 2)
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host = '0.0.0.0', port=port)