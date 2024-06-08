import React from "react";
import { Tabs } from "./components/tabs";
import { ProjectInput } from "./components/project-input";
import { TabsProvider } from "./contexts/tabs";

export default function App() {
  return (
    <div className="min-w-[400px] p-3 flex flex-col gap-3">
      <h1 className="text-2xl font-semibold">Tabs</h1>
      <TabsProvider>
        <Tabs />
        <ProjectInput />
      </TabsProvider>
    </div>
  );
}
