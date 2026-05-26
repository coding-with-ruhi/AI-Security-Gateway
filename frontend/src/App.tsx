import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import InputPanel from './components/InputPanel';
import RiskScoreCard from './components/RiskScoreCard';
import ReasoningVisualizer from './components/ReasoningVisualizer';
import ExplanationPanel from './components/ExplanationPanel';
import InputTransformation from './components/InputTransformation';
import SafeRewrite from './components/SafeRewrite';
import ScanningRadar from './components/ScanningRadar';
import { securityAPI } from './services/api';
import './styles/App.css';

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionLogs, setSessionLogs] = useState([]);
  const [logs, setLogs] = useState([
    "SYS_INIT: Booting AI Security Gateway...",
    "SEC_CORE: Neural engine online.",
    "NET_INT: Monitoring traffic on PORT_443...",
    "STATUS: System ready. Awaiting input."
  ]);

  const addLog = (msg) => {
    setLogs(prev => [...prev.slice(-9), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const analyzeInput = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    addLog(`SCAN_INIT: Analyzing payload (${input.length} chars)`);

    try {
      const response = await securityAPI.analyze(input);
      if (response.data && response.data.data) {
        const data = response.data.data;
        setResult(data);
        
        // Add to session logs
        const newLog = {
          time: new Date().toLocaleTimeString(),
          action: data.assessment.action,
          attackType: data.assessment.attackType,
          score: data.assessment.riskScore.toFixed(1)
        };
        setSessionLogs(prev => [newLog, ...prev.slice(0, 9)]);
        
        addLog(`ANALYSIS_COMPLETE: Action=${data.assessment.action} Score=${data.assessment.riskScore.toFixed(1)}/10`);
      } else {
        setError("Invalid response from server");
        addLog("ERROR: Integrity check failed for server response.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while analyzing input");
      addLog("CRITICAL: Connection to security core lost.");
    }

    setLoading(false);
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
    setError(null);
    addLog("SYS_RESET: Clearing buffers.");
  };

  const getStatus = () => {
    if (loading) return "SCANNING";
    if (!result) return "SAFE";
    if (result?.assessment?.action === "BLOCK") return "UNDER_ATTACK";
    if (result?.assessment?.action === "SANITIZE") return "SUSPICIOUS";
    return "SAFE";
  };

  return (
    <div className="app">
      <TopBar status={getStatus()} />

      <main className="main-content">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <InputPanel
            input={input}
            setInput={setInput}
            onSubmit={analyzeInput}
            onClear={handleClear}
            loading={loading}
            metadata={result?.metadata}
          />

          {result && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <RiskScoreCard assessment={result.assessment} />
                <ReasoningVisualizer
                  reasoning={result.reasoning}
                  assessment={result.assessment}
                />
              </div>

              <InputTransformation 
                original={result.input}
                sanitized={result.sanitized}
                removedSegments={result.removedSegments}
                dataPreserved={result.dataPreserved}
              />

              {result.safeRewrite && (
                <SafeRewrite suggestion={result.safeRewrite} />
              )}
            </>
          )}

          {!result && !loading && (
            <div className="module module-border" style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ color: 'var(--outline)', fontSize: '14px', fontWeight: 'bold', letterSpacing: '0.2em' }}>
                SYSTEM_IDLE // AWAITING_PAYLOAD_FOR_SECURITY_VALIDATION
              </div>
            </div>
          )}

          {loading && (
            <div className="module module-border pulse" style={{ textAlign: 'center', padding: '60px', borderColor: 'var(--primary-container)' }}>
              <div style={{ color: 'var(--primary-container)', fontSize: '16px', fontWeight: 'bold', letterSpacing: '0.1em' }}>
                NEURAL_NETWORK_ACTIVE // SCANNING_IN_PROGRESS...
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <section className="module module-border" style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
            <ScanningRadar status={getStatus()} />
          </section>

          {result && (
            <ExplanationPanel explanation={result.explanation} assessment={result.assessment} />
          )}

          <section className="module module-border" style={{ flex: 1 }}>
            <div className="module-header">
              <h2 className="module-title">SESSION_LOGS</h2>
              <span style={{ fontSize: '10px', color: 'var(--outline)' }}>LAST_10_EVENTS</span>
            </div>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {sessionLogs.length > 0 ? (
                <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: 'var(--outline-variant)' }}>
                      <th style={{ padding: '4px' }}>TIME</th>
                      <th style={{ padding: '4px' }}>ACTION</th>
                      <th style={{ padding: '4px' }}>TYPE</th>
                      <th style={{ padding: '4px' }}>SCORE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessionLogs.map((log, i) => (
                      <tr key={i} style={{ borderTop: '1px solid var(--outline-variant)' }}>
                        <td style={{ padding: '4px' }}>{log.time}</td>
                        <td style={{ padding: '4px', color: log.action === 'BLOCK' ? 'var(--secondary)' : 'var(--primary-container)' }}>{log.action}</td>
                        <td style={{ padding: '4px' }}>{log.attackType}</td>
                        <td style={{ padding: '4px' }}>{log.score}/10</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ 
                  fontFamily: 'Space Grotesk', 
                  fontSize: '11px', 
                  color: 'var(--primary-container)', 
                  opacity: 0.8 
                }}>
                  {logs.map((log, i) => (
                    <div key={i} style={{ marginBottom: '4px' }}>{log}</div>
                  ))}
                  <div className="terminal-cursor" />
                </div>
              )}
            </div>
          </section>

          {error && (
            <div className="module module-border" style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)', padding: '12px' }}>
              ⚠️ SYSTEM_ERROR: {error}
            </div>
          )}
        </div>
      </main>

      <footer style={{ 
        textAlign: 'center', 
        fontSize: '10px', 
        color: 'var(--outline)', 
        marginTop: 'auto',
        padding: '8px',
        letterSpacing: '0.2em',
        borderTop: '1px solid var(--outline-variant)'
      }}>
        CONFIDENTIAL // FOR AUTHORIZED PERSONNEL ONLY // (C) 2026 AI_SECURITY_GROUP
      </footer>
    </div>
  );
}

export default App;