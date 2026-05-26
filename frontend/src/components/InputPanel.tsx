import React from 'react';

const InputPanel = ({ input, setInput, onSubmit, onClear, loading, metadata }) => {
  return (
    <section className="module module-border">
      <div className="module-header">
        <h2 className="module-title">PROMPT_INJECTION_SCANNER</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          {metadata && (
            <>
              <span style={{ fontSize: '10px', color: 'var(--primary-container)' }}>TYPE: {metadata.inputType}</span>
              <span style={{ fontSize: '10px', color: 'var(--primary-container)' }}>LEN: {metadata.length}</span>
              <span style={{ fontSize: '10px', color: 'var(--primary-container)' }}>SRC: {metadata.source}</span>
            </>
          )}
          <span style={{ fontSize: '10px', color: 'var(--on-surface-variant)' }}>INPUT_CHANNEL_01</span>
        </div>
      </div>
      
      <div className="terminal-input-container">
        <textarea
          className="terminal-input"
          placeholder="ENTER PROMPT FOR SECURITY ANALYSIS..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          style={{ height: '80px' }}
        />
        {!input && <span className="terminal-cursor" />}
      </div>

      <div style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>
        <button 
          className="btn-ghost" 
          onClick={onSubmit} 
          disabled={loading || !input.trim()}
          style={{ flex: 1 }}
        >
          {loading ? 'ANALYZING...' : 'INITIATE_SCAN'}
        </button>
        <button 
          className="btn-ghost" 
          style={{ borderColor: 'var(--outline-variant)', color: 'var(--outline)' }}
          onClick={onClear}
        >
          RESET
        </button>
      </div>
    </section>
  );
};

export default InputPanel;