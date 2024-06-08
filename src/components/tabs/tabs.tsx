import { produce } from "immer";
import { Check } from "lucide-react";
import React, { useState } from "react";
import * as styles from "./tabs.module.css";
import { useTabs } from "../../contexts/tabs";
import { tab as tabVariants } from "./tabs.variants";

type Tab = chrome.tabs.Tab;

const defaultTab = tabVariants();
const activeTab = tabVariants({ intent: "active" });

export default function Tabs() {
  const { tabs } = useTabs();
  const [selected, setSelected] = useState<Record<string, Tab>>({});

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

  return (
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
  );
}
