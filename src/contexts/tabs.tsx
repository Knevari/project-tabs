import React, { useCallback, useContext, useEffect, useState } from "react";

export interface TabsContextValue {
  tabs: chrome.tabs.Tab[];
}
const TabsContext = React.createContext<TabsContextValue | undefined>(
  undefined
);

export function TabsProvider({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);

  const getUngroupedTabs = useCallback(async () => {
    const ungroupedTabs = await chrome.tabs.query({ groupId: -1 });
    setTabs(ungroupedTabs);
  }, []);

  useEffect(() => {
    getUngroupedTabs();
  }, [getUngroupedTabs]);

  return (
    <TabsContext.Provider value={{ tabs }}>{children}</TabsContext.Provider>
  );
}

export function useTabs() {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("useTabs can only be used inside a TabsProvider");
  }

  return context;
}
