import { Button } from "@/components/ui/button";
import { Sparkles, Calendar } from "lucide-react";

interface DashboardNavProps {
  activeTab: "dashboard" | "calendar";
  setActiveTab: (tab: "dashboard" | "calendar") => void;
}

export const DashboardNav = ({ activeTab, setActiveTab }: DashboardNavProps) => {
  return (
    <div className="mb-8">
      <div className="flex bg-white rounded-lg p-1 shadow-sm border">
        <Button
          onClick={() => setActiveTab("dashboard")}
          variant={activeTab === "dashboard" ? "default" : "ghost"}
          className={`flex-1 ${activeTab === "dashboard" ? "gradient-bg text-white" : ""}`}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <Button
          onClick={() => setActiveTab("calendar")}
          variant={activeTab === "calendar" ? "default" : "ghost"}
          className={`flex-1 ${activeTab === "calendar" ? "gradient-bg text-white" : ""}`}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Memory Calendar
        </Button>
      </div>
    </div>
  );
};
