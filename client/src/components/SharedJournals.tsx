import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Plus, Users, Share2, Lock, Globe, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface SharedJournal {
  id: number;
  name: string;
  description?: string;
  ownerId: number;
  icon: string;
  isPublic: boolean;
  memberCount?: number;
}

export function SharedJournals() {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newJournalName, setNewJournalName] = useState("");
  const [newJournalDesc, setNewJournalDesc] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<SharedJournal | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const { data: sharedJournals = [] } = useQuery<SharedJournal[]>({
    queryKey: ["/api/shared-journals"],
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/shared-journals/create", {
        name: newJournalName,
        description: newJournalDesc,
        isPublic,
        icon: "📔",
      });
    },
    onSuccess: () => {
      toast({ title: "Shared journal created!", description: `"${newJournalName}" is ready for collaboration` });
      setNewJournalName("");
      setNewJournalDesc("");
      setIsPublic(false);
      setIsCreateOpen(false);
    },
  });

  const inviteMutation = useMutation({
    mutationFn: async () => {
      if (!selectedJournal) return;
      return await apiRequest("POST", `/api/shared-journals/${selectedJournal.id}/invite`, {
        email: inviteEmail,
      });
    },
    onSuccess: () => {
      toast({ title: "Invitation sent!", description: `${inviteEmail} has been invited` });
      setInviteEmail("");
      setIsInviteOpen(false);
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            Shared Journals
          </h2>
          <p className="text-white/60 text-sm mt-1">Collaborate with family and friends</p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 gap-2"
          data-testid="button-create-shared-journal"
        >
          <Plus className="w-4 h-4" />
          Create Space
        </Button>
      </div>

      {/* Shared Journals Grid */}
      {sharedJournals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sharedJournals.map((journal) => (
            <motion.div
              key={journal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/30 hover:border-purple-500/50 transition cursor-pointer group"
                onClick={() => setSelectedJournal(journal)}
                data-testid={`shared-journal-card-${journal.id}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{journal.icon}</span>
                  <div className="flex gap-2">
                    {journal.isPublic ? (
                      <Globe className="w-4 h-4 text-green-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition">{journal.name}</h3>
                {journal.description && (
                  <p className="text-sm text-white/60 mt-2 line-clamp-2">{journal.description}</p>
                )}
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-white/50">Members: {journal.memberCount || 1}</span>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedJournal(journal);
                      setIsInviteOpen(true);
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-purple-300 hover:text-purple-200 gap-1"
                    data-testid={`button-invite-${journal.id}`}
                  >
                    <Share2 className="w-3 h-3" />
                    Invite
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-12 bg-white/5 border border-purple-500/20 text-center">
          <Users className="w-12 h-12 text-purple-400 mx-auto mb-4 opacity-50" />
          <p className="text-white/70">No shared journals yet</p>
          <p className="text-white/50 text-sm mt-1">Create one to start collaborating with family and friends!</p>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Shared Journal
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-semibold text-white block mb-2">Journal Name</label>
              <Input
                placeholder="e.g., Family Memory Book"
                value={newJournalName}
                onChange={(e) => setNewJournalName(e.target.value)}
                className="bg-white/10 border-purple-500/30 text-white"
                data-testid="input-journal-name"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-white block mb-2">Description (optional)</label>
              <Input
                placeholder="What's this space for?"
                value={newJournalDesc}
                onChange={(e) => setNewJournalDesc(e.target.value)}
                className="bg-white/10 border-purple-500/30 text-white"
                data-testid="input-journal-description"
              />
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4"
                data-testid="checkbox-is-public"
              />
              <label htmlFor="isPublic" className="text-sm text-white cursor-pointer">
                Make this journal public (anyone can view)
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsCreateOpen(false)}
              variant="ghost"
              className="text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={() => createMutation.mutate()}
              disabled={!newJournalName || createMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
              data-testid="button-create-confirm"
            >
              {createMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Dialog */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Invite to {selectedJournal?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-semibold text-white block mb-2">Email Address</label>
              <Input
                placeholder="friend@example.com"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="bg-white/10 border-purple-500/30 text-white"
                data-testid="input-invite-email"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsInviteOpen(false)}
              variant="ghost"
              className="text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={() => inviteMutation.mutate()}
              disabled={!inviteEmail || inviteMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
              data-testid="button-invite-confirm"
            >
              {inviteMutation.isPending ? "Sending..." : "Send Invite"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
