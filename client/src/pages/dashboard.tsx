import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import UnifiedJournal from "@/components/unified-journal";
import { ModeDashboard } from "@/components/mode-specific/ModeDashboard";
import { type JournalEntry, type UserStats, type Achievement } from "@/lib/types";
import { type InterfaceMode } from "@/lib/modes";

export default function Dashboard() {
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>();
  const [activeTab, setActiveTab] = useState<"dashboard" | "calendar">("dashboard");
  const queryClient = useQueryClient();

  const { data: userResponse } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: getCurrentUser,
  });

  const { data: statsResponse } = useQuery<{ stats: UserStats; achievements: Achievement[] }>({
    queryKey: ["/api/stats"],
  });

  const { data: insightResponse } = useQuery<{ insight: string }>({
    queryKey: ["/api/ai/insight"],
  });

  const { data: entriesResponse } = useQuery<JournalEntry[]>({
    queryKey: ["/api/journal/entries"],
  });

  const user = userResponse?.user;
  const stats = statsResponse?.stats;
  const achievements = statsResponse?.achievements || [];
  const entries = entriesResponse || [];
  const interfaceMode = (user?.interfaceMode || 'wellness') as InterfaceMode;

  const openNewEntry = () => {
    setEditingEntry(undefined);
    setIsJournalOpen(true);
  };

  const openEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setIsJournalOpen(true);
  };

  const closeJournal = () => {
    setIsJournalOpen(false);
    setEditingEntry(undefined);
  };

  const handleJournalSave = async (entryData: any) => {
    try {
      console.log('🎯 Dashboard handleJournalSave called!');
      console.log('Saving entry:', entryData);
      
      // Check if user is authenticated first
      if (!user) {
        console.error('User not authenticated');
        alert('Please refresh the page and log in again');
        return;
      }

      // Remove unnecessary fields that might cause issues
      const cleanedData = {
        title: entryData.title || "Untitled Entry",
        content: entryData.content || "",
        mood: entryData.mood || "😊",
        fontFamily: entryData.fontFamily || "Inter",
        fontSize: entryData.fontSize || 16,
        textColor: entryData.textColor || "#1f2937",
        backgroundColor: entryData.backgroundColor || "#ffffff",
        isPrivate: entryData.isPrivate || false,
        tags: entryData.tags || [],
        photos: entryData.photos || [],
        drawings: entryData.drawings || []
      };

      console.log('Sending API request with data:', cleanedData);

      let response;
      if (editingEntry) {
        // Update existing entry
        console.log('Updating existing entry:', editingEntry.id);
        response = await apiRequest("PUT", `/api/journal/entries/${editingEntry.id}`, cleanedData);
      } else {
        // Create new entry
        console.log('Creating new entry');
        console.log('Making POST request to /api/journal/entries');
        console.log('User authenticated, user ID:', user?.id);
        console.log('About to make apiRequest with method POST to /api/journal/entries');
        console.log('ApiRequest function available:', typeof apiRequest);
        
        try {
          response = await apiRequest("POST", "/api/journal/entries", cleanedData);
          console.log('ApiRequest completed successfully');
        } catch (apiError) {
          console.error('ApiRequest failed with error:', apiError);
          console.error('Error type:', typeof apiError);
          console.error('Error message:', apiError?.message);
          console.error('Error stack:', apiError?.stack);
          throw apiError;
        }
      }

      console.log('API response received:', response.status, response.statusText);
      const responseData = await response.json();
      console.log('API response data:', responseData);

      // Invalidate and refetch the journal entries
      console.log('🔄 Invalidating queries to refresh dashboard...');
      queryClient.invalidateQueries({ queryKey: ["/api/journal/entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      
      console.log('✅ Entry saved successfully, closing journal');
      closeJournal();
    } catch (error) {
      console.error('Error saving entry:', error);
      
      // Show user-friendly error message
      if (error.message.includes('401')) {
        alert('Authentication expired. Please refresh the page and log in again.');
      } else {
        alert(`Failed to save entry: ${error.message}`);
      }
      
      // Keep the journal open so user can try again
    }
  };

  const handleDateSelect = (date: Date) => {
    // Open journal for selected date
    openNewEntry();
  };

  const handleEntryEdit = (entry: JournalEntry) => {
    openEditEntry(entry);
  };

  return (
    <div className="mobile-container mobile-safe-area py-4 sm:py-6 lg:py-8">
      {/* Render mode-specific dashboard */}
      <ModeDashboard
        mode={interfaceMode}
        user={user}
        stats={stats}
        entries={entries}
        onNewEntry={openNewEntry}
      />

      {/* Floating Action Button */}
      <Button
        onClick={openNewEntry}
        className="fixed bottom-6 right-6 z-50 gradient-bg text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Unified Journal */}
      {isJournalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-0 overflow-auto">
            <UnifiedJournal
              entry={editingEntry}
              onSave={handleJournalSave}
              onClose={closeJournal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
