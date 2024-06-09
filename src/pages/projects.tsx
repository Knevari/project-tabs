import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/button";
import ProjectsService, { Project } from "@/services/projects";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    ProjectsService.getProjects().then((projs) => setProjects(projs));
  }, []);

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Button onClick={() => navigate("/create")}>Create new</Button>
      </div>
      {projects.map((project) => (
        <h1>{project.title}</h1>
      ))}
    </>
  );
}
