import { useState } from 'react';
import { apiRequest } from '../lib/api';
import type { Project } from '../types/api';

interface AddProjectProps {
  profileId: string;
  onProjectAdded: (project: Project) => void;
}

const AddProject = ({ profileId, onProjectAdded }: AddProjectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [method, setMethod] = useState<'form' | 'github'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [work, setWork] = useState('Personal Project');
  const [githubUrl, setGithubUrl] = useState('');

  const handleAddFromForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Project title is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const project = await apiRequest('/projects', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          work: work.trim(),
          profileId,
        }),
      });

      onProjectAdded(project);
      setTitle('');
      setDescription('');
      setWork('Personal Project');
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add project');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFromGithub = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!githubUrl.trim()) {
      setError('GitHub URL is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const project = await apiRequest('/projects/from-github', {
        method: 'POST',
        body: JSON.stringify({
          githubUrl: githubUrl.trim(),
          profileId,
        }),
      });

      onProjectAdded(project);
      setGithubUrl('');
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add project from GitHub');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          + Add Project
        </button>
      ) : (
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: '#f9f9f9',
          marginBottom: '20px',
        }}>
          <div style={{ marginBottom: '15px' }}>
            <h3>Add New Project</h3>
            {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
          </div>

          {/* Method selection */}
          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                checked={method === 'form'}
                onChange={() => setMethod('form')}
              />
              Manual Entry
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                checked={method === 'github'}
                onChange={() => setMethod('github')}
              />
              From GitHub
            </label>
          </div>

          {/* Form method */}
          {method === 'form' && (
            <form onSubmit={handleAddFromForm} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input
                type="text"
                placeholder="Project Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              />
              <textarea
                placeholder="Project Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  minHeight: '100px',
                  fontFamily: 'inherit',
                }}
              />
              <select
                value={work}
                onChange={(e) => setWork(e.target.value)}
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              >
                <option value="Personal Project">Personal Project</option>
                <option value="Open Source">Open Source</option>
                <option value="Professional">Professional</option>
                <option value="Freelance">Freelance</option>
              </select>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? 'Adding...' : 'Add Project'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* GitHub method */}
          {method === 'github' && (
            <form onSubmit={handleAddFromGithub} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username/repository"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
                <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                  Enter the full GitHub URL of your repository (e.g., https://github.com/vineetj12/project-name)
                </small>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? 'Adding...' : 'Add from GitHub'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default AddProject;
