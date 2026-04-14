import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FreelancerHome from "./pages/FreelancerHome";
import ClientForm from "./pages/ClientForm";
import FreelancerPage from "./pages/FreelancerPage";
import ProposalPage from "./pages/ProposalPage";
import PostProject from "./pages/projectListing/PostProject";
import ExploreProjects from "./pages/ExploreProjects";
import Dashboard from "./pages/Dashboard/Dashboard";
import { ProjectProvider } from "./context/ProjectContext";
import { ProjectUploadProvider } from "./context/ProjectUploadContext";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import BuyNowPage from "./pages/BuyNowPage";
import ProjectDetailPage from "./pages/ProjectDetailPage"; 
import OrderDetailPage from "./pages/OrderDetailPage";
import ViewProposalsPage from "./pages/ViewProposalsPage";
import ChatCenter from "./components/ChatCenter";


function App() {
  return (
    <ProjectProvider>
      <ProjectUploadProvider>
        <Navbar />
        <Routes>
          {/* --- Existing Public Routes --- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/freelance" element={<FreelancerHome />} />
          <Route path="/freelance/client" element={<ClientForm />} />
          <Route path="/freelance/freelancer" element={<FreelancerPage />} />
          <Route path="/proposal/:projectId" element={<ProposalPage />} />
          <Route path="/upload" element={<PostProject />} />
          <Route path="/explore" element={<ExploreProjects />} />
          <Route path="/projects" element={<Navigate to="/explore" />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
          
          {/* --- Protected Routes --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            
            {/* ✨ ADD THIS LINE FOR THE BUY NOW PAGE ✨ */}
            <Route path="/buy/:projectId" element={<BuyNowPage />} />
            <Route path="/orders/:orderId" element={<OrderDetailPage />} />
            <Route path="/jobs/:projectId/proposals" element={<ViewProposalsPage />} />

          </Route>
        </Routes>
        <Footer />
        <ChatCenter />
      </ProjectUploadProvider>
    </ProjectProvider>
  );
}

export default App;