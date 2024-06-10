import React from "react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

import { PopupWrapper } from "./components/popup-wrapper";
import { ProjectsProvider } from "./contexts/projects";
import { TabsProvider } from "./contexts/tabs";

const router = createMemoryRouter([
  {
    path: "/",
    lazy: async () => {
      const Projects = await import("./pages/projects");
      return { Component: Projects.default };
    },
  },
  {
    path: "/create",
    lazy: async () => {
      const CreateProject = await import("./pages/create-project");
      return { Component: CreateProject.default };
    },
  },
  {
    path: "/projects/:projectSlug",
    lazy: async () => {
      const Project = await import("./pages/project");
      return { Component: Project.default };
    },
  },
]);

export default function App() {
  return (
    <PopupWrapper>
      <TabsProvider>
        <ProjectsProvider>
          <RouterProvider router={router} />
        </ProjectsProvider>
      </TabsProvider>
    </PopupWrapper>
  );
}
