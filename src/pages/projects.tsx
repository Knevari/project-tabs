import React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/button";
import { useProjects } from "@/contexts/projects";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { projects } = useProjects();

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
