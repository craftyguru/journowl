import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  Ban, 
  Flag, 
  Trash2, 
  Shield, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal,
  Zap,
  AlertCircle,
  Clock,
  UserX,
  UserCheck
} from "lucide-react";

interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  createdAt: string;
  lastLoginAt?: string;
  xp: number;
  level: number;
  isActive: boolean;
  isBanned?: boolean;
  isFlagged?: boolean;
  banReason?: string;
  flagReason?: string;
  suspiciousActivityCount?: number;
  promptsRemaining?: number;
  promptsUsedThisMonth?: number;
}

interface EnhancedUserManagementProps {
  users: User[];
  refreshUsers: () => void;
}

export default function EnhancedUserManagement({ users, refreshUsers }: EnhancedUserManagementProps) {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [moderationAction, setModerationAction] = useState<string>("");
  const [moderationReason, setModerationReason] = useState("");
  const [banDuration, setBanDuration] = useState<string>("");
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "banned") return matchesSearch && user.isBanned;
    if (filterStatus === "flagged") return matchesSearch && user.isFlagged;
    if (filterStatus === "suspicious") return matchesSearch && (user.suspiciousActivityCount || 0) > 0;
    if (filterStatus === "active") return matchesSearch && user.isActive && !user.isBanned;
    
    return matchesSearch;
  });

  const handleModerationAction = async () => {
    if (!selectedUser || !moderationAction || !moderationReason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      let endpoint = "";
      let body: any = { reason: moderationReason };

      switch (moderationAction) {
        case "ban":
          endpoint = `/api/admin/users/${selectedUser.id}/ban`;
          if (banDuration) {
            body.duration = parseInt(banDuration);
          }
          break;
        case "unban":
          endpoint = `/api/admin/users/${selectedUser.id}/unban`;
          break;
        case "flag":
          endpoint = `/api/admin/users/${selectedUser.id}/flag`;
          body.severity = "medium";
          break;
        case "unflag":
          endpoint = `/api/admin/users/${selectedUser.id}/unflag`;
          break;
        case "delete":
          endpoint = `/api/admin/users/${selectedUser.id}`;
          break;
        case "reset_prompts":
          endpoint = `/api/admin/users/${selectedUser.id}/reset-prompts`;
          break;
      }

      const method = moderationAction === "delete" ? "DELETE" : "POST";
      await apiRequest(method, endpoint, body);

      toast({
        title: "Action Completed",
        description: `User ${moderationAction} action completed successfully`,
      });

      setIsActionDialogOpen(false);
      setModerationAction("");
      setModerationReason("");
      setBanDuration("");
      setSelectedUser(null);
      refreshUsers();
    } catch (error: any) {
      toast({
        title: "Action Failed",
        description: error.message || "Failed to perform moderation action",
        variant: "destructive",
      });
    }
  };

  const detectSuspiciousActivity = async () => {
    try {
      const response = await apiRequest("POST", "/api/admin/detect-suspicious-activity", {});
      const data = await response.json();
      
      toast({
        title: "Suspicious Activity Detection Complete",
        description: `Flagged ${data.flaggedCount} users with unusual activity patterns`,
      });
      
      refreshUsers();
    } catch (error: any) {
      toast({
        title: "Detection Failed",
        description: error.message || "Failed to run suspicious activity detection",
        variant: "destructive",
      });
    }
  };

  const getUserStatusBadge = (user: User) => {
    if (user.isBanned) {
      return <Badge variant="destructive" className="flex items-center gap-1"><Ban className="w-3 h-3" />Banned</Badge>;
    }
    if (user.isFlagged) {
      return <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-100 text-yellow-800"><Flag className="w-3 h-3" />Flagged</Badge>;
    }
    if ((user.suspiciousActivityCount || 0) > 0) {
      return <Badge variant="outline" className="flex items-center gap-1 border-orange-300 text-orange-700"><AlertTriangle className="w-3 h-3" />Suspicious</Badge>;
    }
    if (user.isActive) {
      return <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800"><CheckCircle className="w-3 h-3" />Active</Badge>;
    }
    return <Badge variant="secondary" className="flex items-center gap-1"><XCircle className="w-3 h-3" />Inactive</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Enhanced User Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Advanced moderation tools and suspicious activity detection</p>
        </div>
        <Button 
          onClick={detectSuspiciousActivity}
          className="bg-gradient-to-r from-red-500 to-orange-500 text-white"
        >
          <Shield className="w-4 h-4 mr-2" />
          Detect Suspicious Activity
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="search">Search Users</Label>
          <Input
            id="search"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="filter">Filter by Status</Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filter users..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active Users</SelectItem>
              <SelectItem value="banned">Banned Users</SelectItem>
              <SelectItem value="flagged">Flagged Users</SelectItem>
              <SelectItem value="suspicious">Suspicious Activity</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>
      </div>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{user.username}</CardTitle>
                    <CardDescription className="text-sm">{user.email}</CardDescription>
                  </div>
                </div>
                {getUserStatusBadge(user)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* User Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Level:</span>
                  <span className="font-semibold ml-1">{user.level}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">XP:</span>
                  <span className="font-semibold ml-1">{user.xp}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">AI Prompts:</span>
                  <span className="font-semibold ml-1">{user.promptsRemaining || 0}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Used This Month:</span>
                  <span className="font-semibold ml-1">{user.promptsUsedThisMonth || 0}</span>
                </div>
              </div>

              {/* Warning Information */}
              {user.isBanned && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="text-sm font-medium text-red-800">Banned</div>
                  <div className="text-xs text-red-600">{user.banReason}</div>
                </div>
              )}
              
              {user.isFlagged && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="text-sm font-medium text-yellow-800">Flagged for Review</div>
                  <div className="text-xs text-yellow-600">{user.flagReason}</div>
                </div>
              )}

              {(user.suspiciousActivityCount || 0) > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="text-sm font-medium text-orange-800 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Suspicious Activity Detected
                  </div>
                  <div className="text-xs text-orange-600">Activity score: {user.suspiciousActivityCount}</div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Dialog open={isActionDialogOpen && selectedUser?.id === user.id} onOpenChange={setIsActionDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedUser(user)}
                      disabled={user.role === 'admin'}
                    >
                      <MoreHorizontal className="w-4 h-4 mr-1" />
                      Actions
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Moderation Action for {user.username}</DialogTitle>
                      <DialogDescription>
                        Select an action and provide a reason for the moderation log.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="action">Action</Label>
                        <Select value={moderationAction} onValueChange={setModerationAction}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an action..." />
                          </SelectTrigger>
                          <SelectContent>
                            {!user.isBanned && <SelectItem value="ban">Ban User</SelectItem>}
                            {user.isBanned && <SelectItem value="unban">Unban User</SelectItem>}
                            {!user.isFlagged && <SelectItem value="flag">Flag for Review</SelectItem>}
                            {user.isFlagged && <SelectItem value="unflag">Remove Flag</SelectItem>}
                            <SelectItem value="reset_prompts">Reset AI Prompts</SelectItem>
                            <SelectItem value="delete">Delete Account</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {moderationAction === "ban" && (
                        <div>
                          <Label htmlFor="duration">Ban Duration (hours, leave empty for permanent)</Label>
                          <Input
                            id="duration"
                            type="number"
                            placeholder="24"
                            value={banDuration}
                            onChange={(e) => setBanDuration(e.target.value)}
                          />
                        </div>
                      )}

                      <div>
                        <Label htmlFor="reason">Reason *</Label>
                        <Textarea
                          id="reason"
                          placeholder="Provide a detailed reason for this action..."
                          value={moderationReason}
                          onChange={(e) => setModerationReason(e.target.value)}
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleModerationAction}
                        disabled={!moderationAction || !moderationReason}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Confirm Action
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Quick Action Buttons */}
                {user.role !== 'admin' && (
                  <>
                    {!user.isBanned && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 border-red-300 hover:bg-red-50"
                        onClick={() => {
                          setSelectedUser(user);
                          setModerationAction("ban");
                          setIsActionDialogOpen(true);
                        }}
                      >
                        <Ban className="w-3 h-3 mr-1" />
                        Ban
                      </Button>
                    )}
                    
                    {!user.isFlagged && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                        onClick={() => {
                          setSelectedUser(user);
                          setModerationAction("flag");
                          setIsActionDialogOpen(true);
                        }}
                      >
                        <Flag className="w-3 h-3 mr-1" />
                        Flag
                      </Button>
                    )}
                  </>
                )}
              </div>

              {/* User Details */}
              <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t">
                <div>Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                {user.lastLoginAt && (
                  <div>Last Login: {new Date(user.lastLoginAt).toLocaleDateString()}</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">No users found</h3>
            <p className="text-gray-500 dark:text-gray-500">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}