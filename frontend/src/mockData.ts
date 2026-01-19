// Mock data for development/demo when API is unavailable

import type { Profile, Project, Skill } from './types/api';

export const mockProfile: Profile = {
  name: "Alex Chen",
  email: "alex.chen@email.com",
  education: [
    {
      institution: "MIT",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2020",
      endDate: "2024"
    }
  ],
  skills: ["React", "TypeScript", "Python", "Node.js", "PostgreSQL", "Docker", "AWS"],
  workExperience: [
    {
      company: "TechCorp Inc.",
      position: "Software Engineering Intern",
      startDate: "Jun 2023",
      endDate: "Aug 2023",
      description: "Built RESTful APIs and React components for customer dashboard."
    },
    {
      company: "StartupXYZ",
      position: "Junior Developer",
      startDate: "Jan 2024",
      endDate: "Present",
      description: "Developing full-stack features using TypeScript and PostgreSQL."
    }
  ],
  links: {
    github: "https://github.com/alexchen",
    linkedin: "https://linkedin.com/in/alexchen",
    portfolio: "https://alexchen.dev"
  }
};

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "Task Manager App",
    description: "A full-stack task management application with real-time updates.",
    link: "https://github.com/alexchen/task-manager",
    skills: ["React", "Node.js", "PostgreSQL"]
  },
  {
    id: "2",
    title: "Weather Dashboard",
    description: "Real-time weather dashboard with location-based forecasts.",
    link: "https://github.com/alexchen/weather-app",
    skills: ["React", "TypeScript", "API Integration"]
  },
  {
    id: "3",
    title: "E-commerce API",
    description: "RESTful API for an e-commerce platform with authentication.",
    link: "https://github.com/alexchen/ecommerce-api",
    skills: ["Node.js", "Express", "MongoDB"]
  },
  {
    id: "4",
    title: "ML Image Classifier",
    description: "Machine learning model for image classification using TensorFlow.",
    link: "https://github.com/alexchen/ml-classifier",
    skills: ["Python", "TensorFlow", "Docker"]
  }
];

export const mockTopSkills: Skill[] = [
  { name: "React", count: 3 },
  { name: "TypeScript", count: 2 },
  { name: "Node.js", count: 2 },
  { name: "Python", count: 1 },
  { name: "PostgreSQL", count: 1 }
];

// Filter projects by skill
export const filterProjectsBySkill = (skill: string): Project[] => {
  return mockProjects.filter(project =>
    project.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
  );
};
