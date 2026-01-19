import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../lib/api';
import type { Project } from '../types/api';
import AddProject from './AddProject';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';

const ITEMS_PER_PAGE = 3;

const Projects = () => {
  const { isAuthenticated, user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const data: Project[] = await apiRequest('/projects');
        setProjects(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch projects';
        setError(message);
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectAdded = (newProject: Project) => {
    setProjects([...projects, newProject]);
  };

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = projects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getProjectLink = (project: Project): string => {
    // Try to get link from links array, fallback to first link or empty
    if (project.links && project.links.length > 0) {
      return project.links[0].url;
    }
    return '#';
  };

  const getProjectSkills = (project: Project): string[] => {
    // Extract skill names from the skills array
    if (project.skills && project.skills.length > 0) {
      return project.skills.map(ps => ps.skill.name);
    }
    return [];
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (projects.length === 0) {
    return (
      <div className="card">
        <h2>Projects</h2>
        {isAuthenticated && user?.id && (
          <AddProject profileId={user.id} onProjectAdded={handleProjectAdded} />
        )}
        <p>No projects found.</p>
      </div>
    );
  }

  return (
    <section className="card">
      <h2>Projects</h2>
      {isAuthenticated && user?.id && (
        <AddProject profileId={user.id} onProjectAdded={handleProjectAdded} />
      )}
      <div className="projects-grid">
        {paginatedProjects.map((project) => (
          <div key={project.id} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="project-skills">
              {getProjectSkills(project).map((skill, index) => (
                <span key={index} className="skill-tag small">
                  {skill}
                </span>
              ))}
            </div>
            {getProjectLink(project) !== '#' && (
              <a 
                href={getProjectLink(project)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="project-link"
              >
                View Project →
              </a>
            )}
          </div>
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(currentPage - 1)}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(currentPage + 1)}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  );
};

export default Projects;
