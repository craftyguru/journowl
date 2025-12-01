import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Trash2, UserPlus, Copy } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["owner", "admin", "coach", "therapist", "member", "viewer"]),
});

type InviteMemberForm = z.infer<typeof inviteMemberSchema>;

export default function TeamMembersPage() {
  const { toast } = useToast();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [copiedInviteLink, setCopiedInviteLink] = useState<string>("");

  const { data: members = [], isLoading: membersLoading, refetch: refetchMembers } = useQuery({
    queryKey: ["/api/org/members"],
    queryFn: async () => {
      const response = await fetch("/api/org/members");
      if (!response.ok) throw new Error("Failed to fetch members");
      return response.json();
    },
  });

  const form = useForm<InviteMemberForm>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  const inviteMemberMutation = useMutation({
    mutationFn: async (data: InviteMemberForm) => {
      return apiRequest("POST", "/api/org/members/invite", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Invitation sent successfully",
        description: `Invitation sent to ${form.getValues("email")}`,
      });
      form.reset();
      setIsInviteOpen(false);
      refetchMembers();
    },
    onError: (error: any) => {
      toast({
        title: "Error sending invitation",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (userId: number) => {
      return apiRequest("DELETE", `/api/org/members/${userId}`, {});
    },
    onSuccess: () => {
      toast({ title: "Member removed successfully" });
      refetchMembers();
    },
    onError: (error: any) => {
      toast({
        title: "Error removing member",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: number; role: string }) => {
      return apiRequest("PATCH", `/api/org/members/${userId}/role`, { role });
    },
    onSuccess: () => {
      toast({ title: "Member role updated successfully" });
      refetchMembers();
    },
    onError: (error: any) => {
      toast({
        title: "Error updating member role",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InviteMemberForm) => {
    inviteMemberMutation.mutate(data);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedInviteLink(text);
    setTimeout(() => setCopiedInviteLink(""), 2000);
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      owner: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
      admin: "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200",
      coach: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
      therapist: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
      member: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
      viewer: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
    };
    return colors[role] || "bg-gray-100 dark:bg-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Members</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your organization's team and permissions
            </p>
          </div>
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to a new team member to join your organization
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="member@example.com"
                    {...form.register("email")}
                    data-testid="input-invite-email"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={form.watch("role")}
                    onValueChange={(value) => form.setValue("role", value as any)}
                  >
                    <SelectTrigger id="role" data-testid="select-invite-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="coach">Coach</SelectItem>
                      <SelectItem value="therapist">Therapist</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  disabled={inviteMemberMutation.isPending}
                  className="w-full"
                  data-testid="button-send-invite"
                >
                  {inviteMemberMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Invitation
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Organization Members</CardTitle>
            <CardDescription>
              {members.length} member{members.length !== 1 ? "s" : ""} in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            {membersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
            ) : members.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No members in your organization yet
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.id} data-testid={`row-member-${member.userId}`}>
                        <TableCell>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {member.userName || "Unknown"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-gray-600 dark:text-gray-400">{member.userEmail}</p>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={member.role}
                            onValueChange={(value) =>
                              updateRoleMutation.mutate({ userId: member.userId, role: value })
                            }
                            disabled={updateRoleMutation.isPending}
                          >
                            <SelectTrigger className={`w-32 ${getRoleColor(member.role)}`} data-testid={`select-role-${member.userId}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="owner">Owner</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="coach">Coach</SelectItem>
                              <SelectItem value="therapist">Therapist</SelectItem>
                              <SelectItem value="member">Member</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {member.joinedAt
                              ? new Date(member.joinedAt).toLocaleDateString()
                              : "Recently"}
                          </p>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMemberMutation.mutate(member.userId)}
                            disabled={removeMemberMutation.isPending}
                            data-testid={`button-remove-${member.userId}`}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
