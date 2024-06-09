import React from "react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

import { PopupWrapper } from "./components/popup-wrapper";

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
]);

export default function App() {
  return (
    <PopupWrapper>
      <RouterProvider router={router} />
    </PopupWrapper>
  );
}
