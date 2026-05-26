import React from 'react';

const SafeRewrite = ({ suggestion }) => {
  return (
    <section className="module module-border" style={{ borderColor: 'var(--tertiary-container)', background: 'rgba(127, 246, 112, 0.05)' }}>
      <div className="module-header" style={{ borderBottomColor: 'rgba(127, 246, 112, 0.2)' }}>
        <h2 className="module-title" style={{ color: 'var(--tertiary-container)' }}>💡 SAFE_REWRITE_SUGGESTION</h2>
      </div>
      
      <div style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--on-surface)' }}>
        {suggestion}
      </div>
      
      <div style={{ 
        marginTop: '12px', 
        fontSize: '10px', 
        color: 'var(--outline)',
        textAlign: 'right',
        textTransform: 'uppercase'
      }}>
        Recommended for secure processing
      </div>
    </section>
  );
};

export default SafeRewrite;
