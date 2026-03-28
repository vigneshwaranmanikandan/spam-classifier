import { useState } from 'react'
import axios from 'axios'

function App() {
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const checkMessage = async () => {
    if (!message.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', {
        message: message
      })
      setResult(response.data)
    } catch (error) {
      alert('Error connecting to server. Is Flask running?')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '520px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
      }}>
        <h1 style={{ margin: '0 0 8px', fontSize: '24px' }}>
          Spam Detector
        </h1>
        <p style={{ margin: '0 0 24px', color: '#888', fontSize: '14px' }}>
          Type any message below to check if it's spam or not
        </p>

        <textarea
          rows={4}
          placeholder="e.g. Congratulations! You won a free prize!"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '14px',
            resize: 'vertical',
            boxSizing: 'border-box',
            outline: 'none'
          }}
        />

        <button
          onClick={checkMessage}
          disabled={loading}
          style={{
            marginTop: '12px',
            width: '100%',
            padding: '12px',
            background: loading ? '#ccc' : '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Checking...' : 'Check Message'}
        </button>

        {result && (
          <div style={{
            marginTop: '24px',
            padding: '20px',
            borderRadius: '12px',
            background: result.result === 'spam' ? '#fff1f0' : '#f0fdf4',
            border: `1px solid ${result.result === 'spam' ? '#fca5a5' : '#86efac'}`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>
              {result.result === 'spam' ? '🚨' : '✅'}
            </div>
            <div style={{
              fontSize: '22px',
              fontWeight: '600',
              color: result.result === 'spam' ? '#dc2626' : '#16a34a'
            }}>
              {result.result === 'spam' ? 'SPAM' : 'NOT SPAM'}
            </div>
            <div style={{ marginTop: '6px', color: '#888', fontSize: '14px' }}>
              {result.confidence}% confidence
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App