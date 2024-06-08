import React from "react";
import * as styles from "./tabs.module.css";
import { useTabs } from "../../contexts/tabs";

export default function Tabs() {
  const { tabs } = useTabs();
  return (
    <ul className={styles["tabs-list"]}>
      {tabs.map((tab) => (
        <li key={tab.id} className={styles["tabs-list-item"]}>
          {tab.favIconUrl && (
            <img className="max-w-4" src={tab.favIconUrl} alt="tab favicon" />
          )}
          <p>{tab.title}</p>
        </li>
      ))}
    </ul>
  );
}
