import React, { useState, useEffect } from 'react';
import LEDGauge from './LEDGauge';
import { motion, useSpring, useTransform } from 'framer-motion';

const RiskScoreCard = ({ assessment }) => {
  const isHighRisk = assessment.riskScore >= 7;
  const isMedRisk = assessment.riskScore >= 4;
  
  const statusColor = isHighRisk ? 'var(--secondary)' : isMedRisk ? '#ff9900' : 'var(--primary-container)';
  
  // Animated Score
  const springConfig = { damping: 20, stiffness: 100 };
  const animatedScore = useSpring(0, springConfig);
  
  useEffect(() => {
    animatedScore.set(assessment.riskScore);
  }, [assessment.riskScore, animatedScore]);

  return (
    <section className={`module module-border ${isHighRisk ? 'risk-high' : ''}`} style={{ borderColor: statusColor }}>
      <div className="module-header" style={{ borderBottomColor: `${statusColor}33` }}>
        <h2 className="module-title" style={{ color: statusColor }}>THREAT_ASSESSMENT</h2>
        <div className={`status-chip pulse`} style={{ color: statusColor, borderColor: statusColor }}>
          {assessment.action}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ fontSize: '10px', color: 'var(--outline)', marginBottom: '8px' }}>RISK_SCORE</div>
          <div style={{ 
            fontSize: '48px', 
            fontWeight: '900', 
            color: statusColor,
            textShadow: `0 0 20px ${statusColor}66`
          }}>
            <motion.span>{assessment.riskScore.toFixed(1)}</motion.span>
            <span style={{ fontSize: '16px', color: 'var(--outline-variant)' }}>/10</span>
          </div>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: statusColor, marginTop: '4px' }}>
            {assessment.severity}
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '9px', color: 'var(--outline)' }}>ATTACK_TYPE</div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: statusColor }}>{assessment.attackType}</div>
          </div>
          <div>
            <div style={{ fontSize: '9px', color: 'var(--outline)' }}>INTENT_DETECTION</div>
            <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{assessment.intent}</div>
          </div>
          <div>
            <div style={{ fontSize: '9px', color: 'var(--outline)' }}>CONFIDENCE</div>
            <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{(assessment.confidence * 100).toFixed(0)}%</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <LEDGauge label="Payload Density" value={42} />
      </div>
    </section>
  );
};

export default RiskScoreCard;