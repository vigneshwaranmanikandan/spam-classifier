import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const EXAMPLES = [
  "Win a brand new iPhone! Click here now!!!",
  "Hey, are you coming to dinner tonight?",
  "URGENT: Your account will be suspended. Verify now.",
  "Can you pick up some groceries on your way home?",
  "Claim your FREE vacation package today only!",
]

export default function App() {
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [scanLine, setScanLine] = useState(0)
  const [history, setHistory] = useState([])
  const textareaRef = useRef(null)

  useEffect(() => {
    setCharCount(message.length)
  }, [message])

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setScanLine(prev => (prev >= 100 ? 0 : prev + 2))
      }, 20)
      return () => clearInterval(interval)
    }
  }, [loading])

  const checkMessage = async () => {
    if (!message.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const response = await axios.post(
        'https://spam-classifier-api-oj5j.onrender.com/predict',
        { message }
      )
      setResult(response.data)
      setHistory(prev => [
        { message: message.slice(0, 48) + (message.length > 48 ? '...' : ''), ...response.data },
        ...prev.slice(0, 4)
      ])
    } catch {
      setResult({ error: true })
    }
    setLoading(false)
  }

  const useExample = (ex) => {
    setMessage(ex)
    setResult(null)
    textareaRef.current?.focus()
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      fontFamily: "'DM Mono', 'Courier New', monospace",
      color: '#e8e8e8',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .grid-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .glow-orb {
          position: fixed; border-radius: 50%; filter: blur(120px);
          pointer-events: none; z-index: 0;
        }

        .card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }

        textarea {
          background: rgba(255,255,255,0.04) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          color: #e8e8e8 !important;
          border-radius: 12px;
          width: 100%;
          padding: 16px;
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          resize: none;
          outline: none;
          line-height: 1.7;
          transition: border-color 0.2s;
        }
        textarea:focus {
          border-color: rgba(99,102,241,0.5) !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        textarea::placeholder { color: rgba(255,255,255,0.2); }

        .check-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .check-btn:not(:disabled) {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
        }
        .check-btn:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(99,102,241,0.4);
        }
        .check-btn:disabled {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.3);
          cursor: not-allowed;
        }

        .scan-line {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.8), transparent);
          transition: top 0.02s linear;
          pointer-events: none;
        }

        .result-spam {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 14px;
          padding: 24px;
          animation: fadeSlide 0.3s ease;
        }
        .result-ham {
          background: rgba(16,185,129,0.08);
          border: 1px solid rgba(16,185,129,0.25);
          border-radius: 14px;
          padding: 24px;
          animation: fadeSlide 0.3s ease;
        }

        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .confidence-bar-track {
          height: 4px;
          background: rgba(255,255,255,0.08);
          border-radius: 2px;
          overflow: hidden;
          margin-top: 12px;
        }
        .confidence-bar-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 1s cubic-bezier(0.16,1,0.3,1);
        }

        .pill {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .example-btn {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          color: rgba(255,255,255,0.45);
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          padding: 6px 10px;
          cursor: pointer;
          transition: all 0.15s;
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
        }
        .example-btn:hover {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.7);
          border-color: rgba(255,255,255,0.15);
        }

        .history-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 8px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          font-size: 12px;
          animation: fadeSlide 0.2s ease;
        }
      `}</style>

      <div className="grid-bg" />
      <div className="glow-orb" style={{ width: 400, height: 400, top: -100, right: -100, background: 'rgba(99,102,241,0.15)' }} />
      <div className="glow-orb" style={{ width: 300, height: 300, bottom: -50, left: -50, background: 'rgba(139,92,246,0.1)' }} />

      <div style={{ maxWidth: 560, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px #10b981',
            }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Model active — 97.5% accuracy
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(32px, 6vw, 48px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.4))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Spam<br />Detector.
          </h1>
          <p style={{ marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
            Naive Bayes classifier trained on 5,500+ SMS messages.<br />
            Paste any message to analyse it instantly.
          </p>
        </div>

        {/* Main card */}
        <div className="card" style={{ padding: 24, marginBottom: 16 }}>

          <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Message input</span>
            <span style={{ fontSize: 11, color: charCount > 0 ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)' }}>
              {charCount} chars
            </span>
          </div>

          <div style={{ position: 'relative' }}>
            <textarea
              ref={textareaRef}
              rows={5}
              placeholder="Type or paste a message here..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && e.metaKey && checkMessage()}
            />
            {loading && (
              <div className="scan-line" style={{ top: `${scanLine}%` }} />
            )}
          </div>

          <button
            className="check-btn"
            onClick={checkMessage}
            disabled={loading || !message.trim()}
            style={{ marginTop: 12 }}
          >
            {loading ? 'Analysing...' : '⌘ Analyse message'}
          </button>

          {result && !result.error && (
            <div className={result.result === 'spam' ? 'result-spam' : 'result-ham'} style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 28,
                    fontWeight: 800,
                    color: result.result === 'spam' ? '#f87171' : '#34d399',
                    letterSpacing: '-0.02em',
                  }}>
                    {result.result === 'spam' ? 'SPAM' : 'NOT SPAM'}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                    {result.result === 'spam'
                      ? 'High probability of unsolicited content'
                      : 'Looks like a legitimate message'}
                  </div>
                </div>
                <span className="pill" style={{
                  background: result.result === 'spam' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                  color: result.result === 'spam' ? '#f87171' : '#34d399',
                  border: `1px solid ${result.result === 'spam' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
                }}>
                  {result.confidence}%
                </span>
              </div>
              <div className="confidence-bar-track">
                <div className="confidence-bar-fill" style={{
                  width: `${result.confidence}%`,
                  background: result.result === 'spam'
                    ? 'linear-gradient(90deg, #ef4444, #f87171)'
                    : 'linear-gradient(90deg, #10b981, #34d399)',
                }} />
              </div>
            </div>
          )}

          {result?.error && (
            <div style={{
              marginTop: 16, padding: 14, borderRadius: 10,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              fontSize: 12, color: '#f87171',
            }}>
              Could not reach the server. It may be waking up — try again in 30 seconds.
            </div>
          )}
        </div>

        {/* Examples */}
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            Try an example
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {EXAMPLES.map((ex, i) => (
              <button key={i} className="example-btn" onClick={() => useExample(ex)}>
                {ex.slice(0, 30)}…
              </button>
            ))}
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
              Recent checks
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {history.map((h, i) => (
                <div key={i} className="history-item">
                  <span style={{
                    fontSize: 10, fontWeight: 500, letterSpacing: '0.08em',
                    color: h.result === 'spam' ? '#f87171' : '#34d399',
                    minWidth: 50,
                  }}>
                    {h.result === 'spam' ? 'SPAM' : 'HAM'}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.35)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {h.message}
                  </span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', minWidth: 40, textAlign: 'right' }}>
                    {h.confidence}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.15)' }}>
          Built with Python · scikit-learn · Flask · React
        </div>
      </div>
    </div>
  )
}