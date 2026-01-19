import Profile from '../components/Profile';
import Projects from '../components/Projects';
import SearchBySkill from '../components/SearchBySkill';
import TopSkills from '../components/TopSkills';
import '../style.css';

/**
 * Main Index Page
 * Displays all portfolio sections: Profile, Projects, Search, and Top Skills
 */
const Index = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Portfolio</h1>
        <p>Personal profile and projects showcase</p>
      </header>

      <main>
        {/* Profile Section */}
        <Profile />

        {/* Top Skills Section */}
        <TopSkills />

        {/* Search Projects by Skill */}
        <SearchBySkill />

        {/* All Projects */}
        <Projects />
      </main>
    </div>
  );
};

export default Index;
