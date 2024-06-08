import React, { useState } from "react";
import { produce } from "immer";
import { Check } from "lucide-react";

import { Button } from "@/components/button";
import { useTabs } from "@/contexts/tabs";

import * as styles from "./tabs.module.css";
import { tab as tabVariants } from "./tabs.variants";

type Tab = chrome.tabs.Tab;

const defaultTab = tabVariants();
const activeTab = tabVariants({ intent: "active" });

export default function Tabs() {
  const { tabs, groupTabs, refreshTabs } = useTabs();

  const [selected, setSelected] = useState<Record<string, Tab>>({});
  const [errorMessage, setErrorMessage] = useState("");

  const onSelectTab = (tab: Tab) => {
    if (tab.id in selected) {
      setSelected(
        produce((draft) => {
          delete draft[tab.id];
        })
      );
    } else {
      setSelected(
        produce((draft) => {
          draft[tab.id] = tab;
        })
      );
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Object.keys(selected).length === 0) {
      setErrorMessage("You need to select at least one tab");
      return;
    }

    const form = e.target as HTMLFormElement;
    const projectName = (form.project_name as HTMLInputElement).value;

    if (!projectName || projectName === "") {
      setErrorMessage("Project name cannot be empty");
      return;
    }

    try {
      await groupTabs(projectName, Object.keys(selected).map(Number));
      await refreshTabs();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <ul className={styles["tabs-list"]}>
        {tabs.map((tab) => (
          <li
            key={tab.id}
            role="button"
            className={tab.id in selected ? activeTab : defaultTab}
            onClick={() => onSelectTab(tab)}
          >
            {tab.favIconUrl && (
              <img className="max-w-4" src={tab.favIconUrl} alt="tab favicon" />
            )}
            <p>{tab.title}</p>

            {tab.id in selected && (
              <div className={styles.checkmark}>
                <Check size={14} strokeWidth={2} className="stroke-blue-500" />
              </div>
            )}
          </li>
        ))}
      </ul>

      <form className={styles["tabs-form"]} onSubmit={onSubmit}>
        <input
          type="text"
          name="project_name"
          placeholder="Project Name"
          autoComplete="off"
          autoCorrect="off"
          autoFocus
        />
        {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}
        <Button type="submit">CREATE</Button>
      </form>
    </>
  );
}
