// API Response Types

export interface Profile {
  id?: string;
  name: string;
  email: string;
  education: Education[];
  skills: string[];
  workExperience: WorkExperience[];
  links: ProfileLinks;
  createdAt?: string;
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export interface WorkExperience {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ProfileLinks {
  github: string;
  linkedin: string;
  portfolio: string;
}

export interface ProjectSkill {
  skillId: string;
  skill: {
    id: string;
    name: string;
  };
}

export interface ProjectLink {
  id: string;
  type: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  work?: string;
  profileId?: string;
  skills: ProjectSkill[];
  links: ProjectLink[];
}

export interface Skill {
  id?: string;
  name: string;
  _count?: number;
  count?: number;
}
