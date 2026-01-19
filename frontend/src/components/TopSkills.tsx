import { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';
import type { Skill } from '../types/api';

const TopSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTopSkills = async () => {
      try {
        setLoading(true);
        setError(null);
        const data: Skill[] = await apiRequest('/skills/top');
        setSkills(data);
        setCurrentPage(1);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch skills';
        setError(message);
        console.error('Error fetching skills:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSkills();
  }, []);

  if (loading) {
    return <div className="loading">Loading top skills...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (skills.length === 0) {
    return <div className="card"><h2>Top Skills</h2><p>No skills data available.</p></div>;
  }

  // Pagination logic
  const totalPages = Math.ceil(skills.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSkills = skills.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <section className="card">
      <h2>Top Skills</h2>
      <ul className="top-skills-list">
        {paginatedSkills.map((skill, index) => (
          <li key={index} className="top-skill-item">
            <span className="skill-name">{skill.name}</span>
            <span className="skill-count">{(skill._count || skill.count || 0)} projects</span>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '20px',
          alignItems: 'center'
        }}>
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            style={{
              padding: '8px 12px',
              backgroundColor: currentPage === 1 ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>

          <span style={{
            padding: '8px 12px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            minWidth: '100px',
            textAlign: 'center'
          }}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 12px',
              backgroundColor: currentPage === totalPages ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default TopSkills;
