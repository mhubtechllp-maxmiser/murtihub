import React from 'react';
import ProjectCard from './ProjectCard';
import './Projects.scss';

export default function ProjectShowcase({ projects = [] }) {
  return (
    <div className={`project-asymmetric-mosaic ${projects.length === 3 ? 'showing-three' : ''}`}>
      {projects.map((project, index) => (
        <ProjectCard key={project.id || project.slug} project={project} index={index} />
      ))}
    </div>
  );
}

