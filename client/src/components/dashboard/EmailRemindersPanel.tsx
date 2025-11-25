import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Mail, MessageSquare } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface ReminderPreference {
  type: "daily" | "weekly";
  frequency: string;
  timeOfDay: string;
  enabled: boolean;
}

export function EmailRemindersPanel() {
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [reminderType, setReminderType] = useState<"daily" | "weekly">("daily");

  // Fetch reminder preferences
  const { data: reminders = [] } = useQuery({
    queryKey: ["/api/reminders"],
    queryFn: async () => {
      const res = await fetch("/api/reminders", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch reminders");
      return res.json();
    },
  });

  // Update reminder preferences
  const updateReminderMutation = useMutation({
    mutationFn: async (data: ReminderPreference) => {
      return apiRequest("POST", `/api/reminders/${data.type}`, {
        frequency: data.frequency,
        timeOfDay: data.timeOfDay,
        enabled: data.enabled,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reminders"] });
    },
  });

  const handleEnableReminder = (type: "daily" | "weekly") => {
    updateReminderMutation.mutate({
      type,
      frequency: "every-day",
      timeOfDay: selectedTime,
      enabled: true,
    });
  };

  const handleDisableReminder = (type: "daily" | "weekly") => {
    updateReminderMutation.mutate({
      type,
      frequency: "",
      timeOfDay: "",
      enabled: false,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Reminder Preferences</h2>
        </div>

        {/* Daily Reminders */}
        <div className="mb-8 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Daily Email Reminders</h3>
            </div>
            <div className="text-3xl">📧</div>
          </div>
          <p className="text-gray-600 mb-4">Get a daily email reminder to journal at your preferred time</p>

          <div className="space-y-3">
            <label className="block">
              <span className="text-sm font-medium text-gray-700 mb-2 block">Choose reminder time:</span>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <SelectItem key={i} value={`${String(i).padStart(2, "0")}:00`}>
                      {`${String(i).padStart(2, "0")}:00`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <div className="flex gap-3">
              <Button
                onClick={() => handleEnableReminder("daily")}
                disabled={updateReminderMutation.isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                data-testid="button-enable-daily-reminders"
              >
                {updateReminderMutation.isPending ? "Setting..." : "Enable Daily Reminders"}
              </Button>
              <Button
                onClick={() => handleDisableReminder("daily")}
                disabled={updateReminderMutation.isPending}
                variant="outline"
                className="flex-1"
                data-testid="button-disable-daily-reminders"
              >
                Disable
              </Button>
            </div>
          </div>
        </div>

        {/* Weekly Reminders */}
        <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Weekly Email Reminders</h3>
            </div>
            <div className="text-3xl">💌</div>
          </div>
          <p className="text-gray-600 mb-4">Get a weekly digest with your journaling stats and insights</p>

          <div className="space-y-3">
            <label className="block">
              <span className="text-sm font-medium text-gray-700 mb-2 block">Choose reminder time:</span>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <SelectItem key={i} value={`${String(i).padStart(2, "0")}:00`}>
                      {`${String(i).padStart(2, "0")}:00`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <div className="flex gap-3">
              <Button
                onClick={() => handleEnableReminder("weekly")}
                disabled={updateReminderMutation.isPending}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                data-testid="button-enable-weekly-reminders"
              >
                {updateReminderMutation.isPending ? "Setting..." : "Enable Weekly Reminders"}
              </Button>
              <Button
                onClick={() => handleDisableReminder("weekly")}
                disabled={updateReminderMutation.isPending}
                variant="outline"
                className="flex-1"
                data-testid="button-disable-weekly-reminders"
              >
                Disable
              </Button>
            </div>
          </div>
        </div>

        {reminders.length > 0 && (
          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-900">
              ✨ You have {reminders.filter((r: any) => r.enabled).length} reminder(s) enabled
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
