import React from 'react';

function StatCard({ title, value, indicatorText, isPositive = true, isNeutral = false, Illustration }) {
  const indicatorClass = isNeutral
    ? 'indicator-neutral'
    : isPositive
      ? 'indicator-positive'
      : 'indicator-negative';

  return (
    <div className="dashboard-stat-card">
      <div className="stat-left">
        <span className="stat-title-label">{title}</span>
        <span className="stat-number-value">{value}</span>
        <div className={`stat-indicator-row ${indicatorClass}`}>
          <span>{indicatorText}</span>
        </div>
      </div>
      <div className="stat-illustration-container">
        {Illustration && <Illustration />}
      </div>
    </div>
  );
}

export default StatCard;
