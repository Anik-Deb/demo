// @ts-nocheck
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex border-b border-gray-300">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`flex-1 py-3 transition duration-200 ${
            activeTab === tab.value
              ? "border-b-2 border-teal-700 text-teal-700"
              : "text-gray-600 hover:text-teal-600 focus:outline-none"
          }`}
          onClick={() => onTabChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
