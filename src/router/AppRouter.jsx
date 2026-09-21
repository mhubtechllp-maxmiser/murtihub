import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import ServicesPage from '../pages/ServicesPage';
import ProjectsPage from '../pages/ProjectsPage';
import ArchitecturePage from '../pages/ArchitecturePage';
import LeadershipPage from '../pages/LeadershipPage';
import CovenantPage from '../pages/CovenantPage';
import TechArsenalPage from '../pages/TechArsenalPage';
import ContactPage from '../pages/ContactPage';
import AdminStudioPage from '../pages/AdminStudioPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Facing Multi-Page Website */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        
        {/* Services & Projects Overview */}
        <Route path="services" element={<ServicesPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        
        {/* Institutional Pages */}
        <Route path="architecture" element={<ArchitecturePage />} />
        <Route path="leadership" element={<LeadershipPage />} />
        <Route path="covenant" element={<CovenantPage />} />
        <Route path="tech-arsenal" element={<TechArsenalPage />} />
        <Route path="contact" element={<ContactPage />} />
        
        {/* Catch-all 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Studio / CMS Manager */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminStudioPage />} />
      </Route>
    </Routes>
  );
}

