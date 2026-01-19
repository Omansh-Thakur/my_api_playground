import { useState } from 'react';
import { apiRequest } from '../lib/api';
import type { Project } from '../types/api';

const SearchBySkill = () => {
  const [skill, setSkill] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!skill.trim()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      const data: Project[] = await apiRequest(
        `/projects?skill=${encodeURIComponent(skill.trim())}`
      );
      setProjects(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to search projects';
      setError(message);
      console.error('Error searching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h2>Search Projects by Skill</h2>
      
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          placeholder="Enter a skill (e.g., React, Python)"
          className="search-input"
        />
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {hasSearched && !loading && (
        <div className="search-results">
          {error && <p className="error">Error: {error}</p>}
          {!error && projects.length === 0 ? (
            <p className="no-results">No projects found for "{skill}"</p>
          ) : (
            !error && (
              <>
                <p className="results-count">
                  Found {projects.length} project{projects.length !== 1 ? 's' : ''} with "{skill}"
                </p>
                <div className="projects-grid">
                  {projects.map((project) => (
                    <div key={project.id} className="project-card">
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                    </div>
                  ))}
                </div>
              </>
            )
          )}
        </div>
      )}
    </section>
  );
};

export default SearchBySkill;
