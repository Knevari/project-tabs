import React, { useEffect, useState } from "react";

export interface Project {
  title: string;
  groupId: number;
  tabIds: number[];
}

export interface ProjectsContextValue {
  projects: Project[];
  getProjects: () => Promise<Project[]>;
  addProject: (projectData: Project) => Promise<void>;
}
const ProjectsContext = React.createContext<ProjectsContextValue | undefined>(
  undefined
);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);

  const getProjects = async () => {
    const projects = (await chrome.storage.sync.get("projects")) as
      | Project[]
      | undefined;
    return Array.isArray(projects) ? projects : [];
  };

  const addProject = async (projectData: Project) => {
    const oldProjects = await getProjects();
    const newProjects = [...oldProjects, projectData];
    await chrome.storage.sync.set({
      projects: newProjects,
    });
  };

  useEffect(() => {
    getProjects().then((projs) => setProjects(projs));
  }, []);

  useEffect(() => {
    const onChanged = (changes: Record<string, any>, namespace: string) => {
      for (let [key, { newValue }] of Object.entries(changes)) {
        if (key === "projects") setProjects(newValue);
      }
    };

    chrome.storage.onChanged.addListener(onChanged);

    return () => {
      chrome.storage.onChanged.removeListener(onChanged);
    };
  }, []);

  return (
    <ProjectsContext.Provider value={{ projects, getProjects, addProject }}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = React.useContext(ProjectsContext);

  if (!context) {
    throw new Error("useProjects can only be used within a ProjectsProvider");
  }

  return context;
}
