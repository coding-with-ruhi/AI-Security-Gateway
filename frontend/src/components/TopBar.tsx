import React from 'react';

const TopBar = ({ status }) => {
  const isDanger = status === 'UNDER_ATTACK';
  
  return (
    <header className="module-border" style={{ 
      padding: '12px 24px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      borderBottom: `2px solid ${isDanger ? 'var(--secondary)' : 'var(--primary-container)'}`,
      boxShadow: `0 4px 20px ${isDanger ? 'rgba(255, 49, 49, 0.2)' : 'rgba(0, 255, 65, 0.1)'}`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ 
          fontSize: '24px', 
          fontWeight: '900', 
          color: isDanger ? 'var(--secondary)' : 'var(--primary-container)',
          letterSpacing: '-0.05em'
        }}>
          AI_SEC_GW v1.0
        </div>
        <div style={{ 
          height: '20px', 
          width: '1px', 
          background: 'var(--outline-variant)' 
        }} />
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--on-surface-variant)' }}>
          LOCATION: CENTRAL_COMMAND // OPS_01
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: 'var(--on-surface-variant)' }}>SYSTEM_STATUS</div>
          <div className={`status-chip ${isDanger ? 'status-danger pulse' : 'status-safe'}`} style={{ fontSize: '14px' }}>
            {status}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: 'var(--on-surface-variant)' }}>NETWORK_LATENCY</div>
          <div className="status-safe" style={{ fontSize: '14px', fontWeight: 'bold' }}>12MS</div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;