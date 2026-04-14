import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SearchBar from './components/SearchBar';
import Footer from './components/Footer';

// Pages
import FeaturedProjects from './pages/FeaturedProjects';
import Login from './pages/Login';
import Register from './pages/Register';
import FreelancerHome from './pages/FreelancerHome';
import ClientForm from './pages/ClientForm';
import FreelancerPage from './pages/FreelancerPage';
import ProposalPage from './pages/ProposalPage';
import ExploreProjects from './pages/ExploreProjects';
import Dashboard from './pages/Dashboard/Dashboard';
import Upload from './pages/ProjectUpload/Upload';
import EditProfile from './pages/Dashboard/EditProfile';

// Context
import { ProjectProvider } from './context/ProjectContext';

function App() {
  return (
    <ProjectProvider>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <SearchBar />
              <FeaturedProjects />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/freelance" element={<FreelancerHome />} />
        <Route path="/freelance/client" element={<ClientForm />} />
        <Route path="/freelance/freelancer" element={<FreelancerPage />} />
        <Route path="/proposal/:projectId" element={<ProposalPage />} />
        <Route path="/explore" element={<ExploreProjects />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/profile/edit" element={<EditProfile />} />
      </Routes>
      <Footer />
    </ProjectProvider>
  );
}

export default App;