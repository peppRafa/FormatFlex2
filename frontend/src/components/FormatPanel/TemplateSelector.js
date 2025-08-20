import React from 'react';

const templates = {
  ebook: {
    name: 'eBook Format',
    description: 'Optimized for digital reading',
    icon: '📱',
    config: {
      pageSize: 'A4',
      margins: 'normal',
      lineSpacing: 1.6,
      fontSize: 12,
      textAlign: 'justify',
      fontFamily: 'Crimson Text'
    }
  },
  paperback: {
    name: 'Paperback Book',
    description: 'Print-ready format',
    icon: '📖',
    config: {
      pageSize: '6x9',
      margins: 'wide',
      lineSpacing: 1.5,
      fontSize: 11,
      textAlign: 'justify',
      fontFamily: 'Libre Baskerville'
    }
  }
};

function TemplateSelector({ config, onChange }) {
  const handleTemplateSelect = (templateKey) => {
    const template = templates[templateKey];
    onChange({
      template: templateKey,
      ...template.config
    });
  };

  return (
    <div className="template-selector">
      <div className="template-grid">
        {Object.entries(templates).map(([key, template]) => (
          <div
            key={key}
            className={`template-card ${config.template === key ? 'active' : ''}`}
            onClick={() => handleTemplateSelect(key)}
          >
            <div className="template-icon">{template.icon}</div>
            <h5>{template.name}</h5>
            <p>{template.description}</p>
          </div>
        ))}
      </div>
      
      <div className="template-info">
        <small>
          Current: <strong>{templates[config.template]?.name || 'Custom'}</strong>
        </small>
      </div>
    </div>
  );
}

export default TemplateSelector;
