import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/button";
import { useProjects } from "@/contexts/projects";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { projects } = useProjects();

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Button onClick={() => navigate("/create")}>Create new</Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {projects.map((project) => (
          <Link
            key={project.slug}
            to={`/projects/${project.slug}`}
            className="flex flex-col items-center gap-4"
          >
            <div
              role="presentation"
              className="w-[100px] aspect-square bg-gray-500 rounded-full"
            />
            <h3 className="font-semibold text-lg">{project.title}</h3>
          </Link>
        ))}
      </div>
    </>
  );
}
