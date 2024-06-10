import React, { useCallback, useEffect, useState } from "react";
import { useTabs } from "./tabs";
import slugify from "slugify";
import { produce } from "immer";

export interface Project {
  slug: string;
  title: string;
  groupId: number;
  tabs: {
    id: number;
    title: string;
    url: string;
    favIconUrl?: string;
  }[];
}

export interface UpdateProjectData
  extends Omit<Partial<Project>, "tabs" | "slug"> {
  tabIds?: number[];
}

export interface ProjectsContextValue {
  projects: Project[];
  getProjectBySlug: (slug: string) => Promise<Project | undefined>;
  getProjects: () => Promise<Project[]>;
  addProject: (
    title: string,
    groupId: number,
    tabIds: number[]
  ) => Promise<Project>;
  updateProject: (
    projectSlug: string,
    projectData: UpdateProjectData
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

    const newProject = {
      slug: slugify(title),
      title,
      groupId,
      tabs: tabs.map((tab) => ({
        id: tab.id,
        title: tab.title,
        url: tab.url,
        favIconUrl: tab.favIconUrl,
      })),
    };

    const newProjects = [...oldProjects, newProject];

    await chrome.storage.sync.set({
      projects: newProjects,
    });

    return newProject;
  };

  const updateProject = async (
    projectSlug: string,
    projectData: UpdateProjectData
  ) => {
    const projects = await getProjects();
    const tabs = await getTabsFromTabIds(projectData.tabIds);
    const updatedProjects = produce(projects, (draft) => {
      const project = draft.find((proj) => proj.slug === projectSlug);

      if (!project) return;

      if ("title" in projectData) {
        const slug = slugify(projectData.title);
        project.slug = slug;
        project.title = projectData.title;
      }

      if ("tabIds" in projectData) {
        project.tabs = tabs.map((tab) => ({
          id: tab.id,
          title: tab.title,
          url: tab.url,
          favIconUrl: tab.favIconUrl,
        }));
      }

      if ("groupId" in projectData) {
        project.groupId = projectData.groupId;
      }
    });
    await chrome.storage.sync.set({ projects: updatedProjects });
    setProjects(updatedProjects);
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
      value={{
        projects,
        getProjectBySlug,
        getProjects,
        addProject,
        updateProject,
      }}
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
