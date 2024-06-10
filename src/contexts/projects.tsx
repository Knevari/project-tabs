import React, { useCallback, useEffect, useState } from "react";
import { useTabs } from "./tabs";
import slugify from "slugify";

export interface Project {
  slug: string;
  title: string;
  groupId: number;
  tabs: {
    id: number;
    title: string;
    favIconUrl?: string;
  }[];
}

export interface ProjectsContextValue {
  projects: Project[];
  getProjectBySlug: (slug: string) => Promise<Project | undefined>;
  getProjects: () => Promise<Project[]>;
  addProject: (
    title: string,
    groupId: number,
    tabIds: number[]
  ) => Promise<void>;
}
const ProjectsContext = React.createContext<ProjectsContextValue | undefined>(
  undefined
);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const { getTabsFromTabIds } = useTabs();
  const [projects, setProjects] = useState<Project[]>([]);

  const getProjectBySlug = useCallback(async (slug: string) => {
    const projects = await getProjects();
    return projects.find((project) => project.slug === slug);
  }, []);

  const getProjects = useCallback(async () => {
    const storedProjects = await chrome.storage.sync.get("projects");
    const result =
      typeof storedProjects !== "undefined" && "projects" in storedProjects
        ? storedProjects.projects
        : [];
    return result as Project[];
  }, []);

  const addProject = async (
    title: string,
    groupId: number,
    tabIds: number[]
  ) => {
    const oldProjects = await getProjects();
    const tabs = await getTabsFromTabIds(tabIds);

    const newProjects = [
      ...oldProjects,
      {
        slug: slugify(title),
        title,
        groupId,
        tabs: tabs.map((tab) => ({
          id: tab.id,
          title: tab.title,
          favIconUrl: tab.favIconUrl,
        })),
      },
    ];

    await chrome.storage.sync.set({
      projects: newProjects,
    });
  };

  useEffect(() => {
    getProjects().then((projs) => setProjects(projs));
  }, [getProjects]);

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
    <ProjectsContext.Provider
      value={{ projects, getProjectBySlug, getProjects, addProject }}
    >
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
