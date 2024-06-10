import { Project, useProjects } from "@/contexts/projects";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProjectPage() {
  const { projectSlug } = useParams();
  const { getProjectBySlug } = useProjects();
  const [project, setProject] = useState<Project | undefined>();

  const getProject = useCallback(async () => {
    const proj = await getProjectBySlug(projectSlug);
    setProject(proj);
  }, [projectSlug, getProjectBySlug]);

  useEffect(() => {
    getProject();
  }, [getProject]);

  return (
    <div>
      <h3>Project Page {projectSlug}</h3>
      {JSON.stringify(project)}
    </div>
  );
}
