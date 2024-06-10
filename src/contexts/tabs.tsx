import React, { useCallback, useContext, useEffect, useState } from "react";

export interface TabsContextValue {
  tabs: chrome.tabs.Tab[];
  getTabsFromTabIds: (tabIds: number[]) => Promise<chrome.tabs.Tab[]>;
  groupTabs: (groupTitle: string, tabIds: number[]) => Promise<number>;
  refreshTabs: () => Promise<void>;
}
const TabsContext = React.createContext<TabsContextValue | undefined>(
  undefined
);

export function TabsProvider({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);

  const getTabsFromTabIds = useCallback(async (tabIds: number[]) => {
    const tabs: chrome.tabs.Tab[] = [];

    for (const tabId of tabIds) {
      try {
        const tab = await chrome.tabs.get(tabId);
        tabs.push(tab);
      } catch {}
    }

    return tabs;
  }, []);

  const getUngroupedTabs = useCallback(async () => {
    const ungroupedTabs = await chrome.tabs.query({ groupId: -1 });
    setTabs(ungroupedTabs);
  }, []);

  const groupTabs = useCallback(
    async (groupTitle: string, tabIds: number[]) => {
      const groupId = await chrome.tabs.group({ tabIds });
      await chrome.tabGroups.update(groupId, {
        title: groupTitle,
      });
      return groupId;
    },
    []
  );

  const refreshTabs = useCallback(async () => {
    await getUngroupedTabs();
  }, [getUngroupedTabs]);

  useEffect(() => {
    getUngroupedTabs();
  }, [getUngroupedTabs]);

  return (
    <TabsContext.Provider
      value={{ tabs, getTabsFromTabIds, groupTabs, refreshTabs }}
    >
      {children}
    </TabsContext.Provider>
  );
}

export function useTabs() {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("useTabs can only be used inside a TabsProvider");
  }

  return context;
}
