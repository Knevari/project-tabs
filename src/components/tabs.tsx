import React, { useEffect, useState } from "react";

export default function Tabs() {
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    chrome.tabs.query({ groupId: -1 }).then((tabs) => {
      console.log({ tabs });
      setTabs(tabs);
    });
  }, []);

  return (
    <ul>
      {tabs.map((tab) => (
        <li key={tab.id}>{tab.title}</li>
      ))}
    </ul>
  );
}
