import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/button";
import { Project, useProjects } from "@/contexts/projects";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { projects } = useProjects();

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Button onClick={() => navigate("/create")}>Create new</Button>
      </div>
      <div>
        {projects.map((project) => (
          <ProjectItem key={project.title} project={project} />
        ))}
      </div>
    </>
  );
}

const ProjectItem = ({ project }: { project: Project }) => {
  return (
    <Link to={`/projects/${project.slug}`}>
      <div className="py-1.5 px-2">
        <h3 className="font-semibold text-lg">{project.title}</h3>
      </div>
    </Link>
  );
};
