import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/button";
import { Project, useProjects } from "@/contexts/projects";
import { useTabs } from "@/contexts/tabs";

export default function ProjectPage() {
  const navigate = useNavigate();
  const { projectSlug } = useParams();

  const { getTabsFromTabIds, groupTabs } = useTabs();
  const { getProjectBySlug, updateProject } = useProjects();

  const [project, setProject] = useState<Project | undefined>();
  const [projectTabs, setProjectTabs] = useState<chrome.tabs.Tab[]>([]);

  const getProject = useCallback(async () => {
    const proj = await getProjectBySlug(projectSlug);
    const tabs = await getTabsFromTabIds(proj.tabs.map((t) => t.id));

    setProject(proj);
    setProjectTabs(tabs);
  }, [projectSlug, getProjectBySlug]);

  useEffect(() => {
    getProject();
  }, [getProject]);

  const removedTabs = useMemo(() => {
    if (!project) return [];
    return project.tabs.filter(
      (tab) => projectTabs.findIndex((t) => t.id === tab.id) === -1
    );
  }, [project, projectTabs]);

  const restoreTab = async (tabId: number, url: string) => {
    const existingGroup = await chrome.tabGroups.get(project.groupId);
    const tab = await chrome.tabs.create({ url });

    if (!existingGroup) {
      const groupId = await groupTabs(project.title, [tab.id]);
      updateProject(project.slug, { groupId, tabIds: [tab.id] });
    } else {
      await chrome.tabs.group({
        groupId: existingGroup.id,
        tabIds: [tab.id],
      });
      const currentIds = project.tabs
        .map((t) => t.id)
        .filter((id) => id !== tabId);
      currentIds.push(tab.id);
      updateProject(project.slug, { tabIds: currentIds });
    }
  };

  const clearRemovedTabs = () => {
    updateProject(project.slug, {
      tabIds: project.tabs
        .filter((t) => removedTabs.findIndex((rt) => rt.id === t.id) === -1)
        .map((t) => t.id),
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">{project?.title}</h1>
        <Button onClick={() => navigate("/")}>Other Projects</Button>
      </div>

      <ul>
        {projectTabs.map((tab) => (
          <li>
            <p>{tab.title}</p>
          </li>
        ))}
      </ul>

      {removedTabs.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold my-4">Removed Tabs</h4>
            <Button onClick={clearRemovedTabs}>Clear</Button>
          </div>
          <ul className="flex flex-col gap-3">
            {removedTabs.map((tab) => (
              <li className="flex items-center justify-between">
                <p className="text-red-500">{tab.title}</p>
                <Button onClick={() => restoreTab(tab.id, tab.url)}>
                  Restore
                </Button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
