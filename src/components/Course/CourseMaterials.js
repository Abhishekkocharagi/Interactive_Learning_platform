import React, { useState } from 'react';
import './CourseMaterials.css';

const CourseMaterials = ({ materials, downloadedMaterials = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const materialIcons = {
    pdf: '📄',
    video: '🎥',
    code: '💻',
    cheatsheet: '📋',
    slide: '📊',
    audio: '🎧',
  };

  const isDownloaded = (materialId) => {
    return downloadedMaterials.includes(materialId);
  };

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = material.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === 'all' || material.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleDownload = (material) => {
    console.log('Downloading:', material.title);
    const link = document.createElement('a');
    link.href = material.url;
    link.download = material.title;
    link.click();
  };

  const materialTypes = ['all', ...new Set(materials.map((m) => m.type))];

  return (
    <div className="course-materials">
      <div className="materials-header">
        <h2>📦 Course Materials & Resources</h2>
        <p className="materials-subtitle">
          Download resources, access code repositories, and supplementary materials
        </p>
      </div>

      <div className="materials-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          {materialTypes.map((type) => (
            <button
              key={type}
              className={`filter-btn ${filterType === type ? 'active' : ''}`}
              onClick={() => setFilterType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="materials-grid">
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map((material) => (
            <div key={material.id} className="material-card">
              <div className="material-icon">
                {materialIcons[material.type] || '📁'}
              </div>

              <div className="material-content">
                <h3>{material.title}</h3>
                <p className="material-description">{material.description}</p>

                <div className="material-meta">
                  <span className="material-type">
                    {material.type.toUpperCase()}
                  </span>
                  {material.size && (
                    <span className="material-size">{material.size}</span>
                  )}
                  {material.duration && (
                    <span className="material-duration">
                      ⏱️ {material.duration}
                    </span>
                  )}
                </div>
              </div>

              <div className="material-actions">
                {material.downloadable ? (
                  <button
                    className="download-btn"
                    onClick={() => handleDownload(material)}
                  >
                    {isDownloaded(material.id) ? (
                      <>
                        <span>✓</span> Downloaded
                      </>
                    ) : (
                      <>
                        <span>⬇️</span> Download
                      </>
                    )}
                  </button>
                ) : (
                  <a
                    href={material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-btn"
                  >
                    <span>👁️</span> View
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-materials">
            <p>No materials found matching your search.</p>
          </div>
        )}
      </div>

      <div className="materials-stats">
        <div className="stat-item">
          <span className="stat-number">{materials.length}</span>
          <span className="stat-label">Total Resources</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{downloadedMaterials.length}</span>
          <span className="stat-label">Downloaded</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {materials.filter((m) => m.downloadable).length}
          </span>
          <span className="stat-label">Downloadable</span>
        </div>
      </div>
    </div>
  );
};

export default CourseMaterials;