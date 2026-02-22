import React from 'react';
import '../styles/AppSection.scss';

function AppSection({ title, icon, children, actions, color }) {
  // color: 'green', 'blue', 'pink', 'yellow', etc.
  const colorClass = color ? `app-section-${color}` : '';
  return (
    <section className={`app-section ${colorClass}`}>
      <div className="app-section-header">
        {icon && <span className="app-section-icon">{icon}</span>}
        {title && <h2 className="app-section-title">{title}</h2>}
        {actions && <div className="app-section-actions">{actions}</div>}
      </div>
      <div className="app-section-content">
        {children}
      </div>
    </section>
  );
}

export default AppSection;
