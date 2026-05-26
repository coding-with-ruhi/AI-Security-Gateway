import React from 'react';

const InputTransformation = ({ original, sanitized, removedSegments, dataPreserved }) => {
  return (
    <section className="module module-border">
      <div className="module-header">
        <h2 className="module-title">INPUT_TRANSFORMATION</h2>
        <span style={{ fontSize: '10px', color: 'var(--primary-container)' }}>DATA_PRESERVED: {dataPreserved}%</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--outline)', marginBottom: '4px' }}>🔹 BEFORE (RAW)</div>
          <div style={{ 
            padding: '8px', 
            background: 'rgba(0,0,0,0.2)', 
            border: '1px solid var(--outline-variant)',
            fontSize: '12px',
            minHeight: '60px',
            fontFamily: 'monospace',
            color: 'var(--on-surface-variant)'
          }}>
            {original}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--primary-container)', marginBottom: '4px' }}>🔹 AFTER (SANITIZED)</div>
          <div style={{ 
            padding: '8px', 
            background: 'rgba(0,255,65,0.05)', 
            border: '1px solid var(--primary-container)',
            fontSize: '12px',
            minHeight: '60px',
            fontFamily: 'monospace'
          }}>
            {sanitized}
          </div>
        </div>
      </div>

      {removedSegments && removedSegments.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <div style={{ fontSize: '10px', color: 'var(--secondary)', marginBottom: '4px' }}>🔹 REMOVED_SEGMENTS_PANEL</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {removedSegments.map((seg, i) => (
              <div key={i} style={{ 
                padding: '4px 8px', 
                background: 'rgba(255,49,49,0.1)', 
                border: '1px solid var(--secondary)',
                fontSize: '10px'
              }}>
                <span style={{ fontWeight: 'bold' }}>"{seg.segment}"</span>
                <span style={{ color: 'var(--outline)', marginLeft: '8px' }}>→ {seg.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default InputTransformation;
