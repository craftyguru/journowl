import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Eye, Trash2, Edit2, Gift, TrendingUp, Users, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface PromoCode {
  id: number;
  code: string;
  name: string;
  description?: string;
  type: "extra_prompts" | "pro_time" | "pro_discount";
  value: number;
  maxUses?: number;
  currentUses: number;
  isActive: boolean;
  validFrom: string;
  validUntil?: string;
  createdAt: string;
}

interface PromoCodeStats {
  totalCodes: number;
  activeCodes: number;
  totalUsage: number;
  recentUsage: Array<{
    id: number;
    promoCodeId: number;
    userId: number;
    usedAt: string;
    ipAddress?: string;
  }>;
}

export function PromoCodeManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPromoCode, setEditingPromoCode] = useState<PromoCode | null>(null);

  const [createData, setCreateData] = useState({
    code: "",
    name: "",
    description: "",
    type: "extra_prompts" as const,
    value: 50,
    maxUses: "",
    validUntil: ""
  });

  // Fetch promo codes
  const { data: promoCodes = [], isLoading } = useQuery({
    queryKey: ["/api/admin/promo-codes"],
    enabled: true,
  });

  // Fetch promo code stats
  const { data: stats } = useQuery({
    queryKey: ["/api/admin/promo-codes-stats"],
    enabled: true,
  });

  const createPromoCodeMutation = useMutation({
    mutationFn: async (data: typeof createData) => {
      const response = await apiRequest("POST", "/api/admin/promo-codes", {
        code: data.code.toUpperCase(),
        name: data.name,
        description: data.description || undefined,
        type: data.type,
        value: data.value,
        maxUses: data.maxUses ? parseInt(data.maxUses) : undefined,
        validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Promo Code Created",
        description: "The promo code has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promo-codes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promo-codes-stats"] });
      setShowCreateModal(false);
      setCreateData({
        code: "",
        name: "",
        description: "",
        type: "extra_prompts",
        value: 50,
        maxUses: "",
        validUntil: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Promo Code",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const updatePromoCodeMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<PromoCode>) => {
      const response = await apiRequest("PUT", `/api/admin/promo-codes/${id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Promo Code Updated",
        description: "The promo code has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promo-codes"] });
      setEditingPromoCode(null);
    },
  });

  const deletePromoCodeMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/promo-codes/${id}`);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Promo Code Deleted",
        description: "The promo code has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promo-codes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promo-codes-stats"] });
    },
  });

  const getTypeDisplay = (type: string, value: number) => {
    switch (type) {
      case "extra_prompts":
        return `+${value} AI Prompts`;
      case "pro_time":
        return `${value} Days Pro Access`;
      case "pro_discount":
        return `${value}% Off Pro Plan`;
      default:
        return type;
    }
  };

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCreateData(prev => ({ ...prev, code: result }));
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Gift className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Codes</p>
                  <div className="text-2xl font-bold">{stats.totalCodes}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Activity className="h-4 w-4 text-green-600" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">Active Codes</p>
                  <div className="text-2xl font-bold text-green-600">{stats.activeCodes}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Usage</p>
                  <div className="text-2xl font-bold text-blue-600">{stats.totalUsage}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-4 w-4 text-purple-600" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">Recent Uses</p>
                  <div className="text-2xl font-bold text-purple-600">{stats.recentUsage.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Promo Code Management</h2>
          <p className="text-muted-foreground">Create and manage promotional codes for user bonuses</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Promo Code
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Promo Code</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Promo Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="code"
                    value={createData.code}
                    onChange={(e) => setCreateData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="Enter code (e.g., WELCOME2024)"
                    maxLength={20}
                  />
                  <Button variant="outline" onClick={generateRandomCode} type="button">
                    Random
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={createData.name}
                  onChange={(e) => setCreateData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="New User Welcome Bonus"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={createData.description}
                  onChange={(e) => setCreateData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Bonus for new users who sign up during promotion"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Bonus Type</Label>
                <Select
                  value={createData.type}
                  onValueChange={(value: any) => setCreateData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="extra_prompts">Extra AI Prompts</SelectItem>
                    <SelectItem value="pro_time">Free Pro Time</SelectItem>
                    <SelectItem value="pro_discount">Pro Plan Discount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="value">
                  {createData.type === "extra_prompts" && "Number of Prompts"}
                  {createData.type === "pro_time" && "Days of Pro Access"}
                  {createData.type === "pro_discount" && "Discount Percentage"}
                </Label>
                <Input
                  id="value"
                  type="number"
                  value={createData.value}
                  onChange={(e) => setCreateData(prev => ({ ...prev, value: parseInt(e.target.value) || 0 }))}
                  min={1}
                  max={createData.type === "pro_discount" ? 100 : undefined}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maxUses">Max Uses (Optional)</Label>
                <Input
                  id="maxUses"
                  type="number"
                  value={createData.maxUses}
                  onChange={(e) => setCreateData(prev => ({ ...prev, maxUses: e.target.value }))}
                  placeholder="Leave empty for unlimited"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="validUntil">Valid Until (Optional)</Label>
                <Input
                  id="validUntil"
                  type="datetime-local"
                  value={createData.validUntil}
                  onChange={(e) => setCreateData(prev => ({ ...prev, validUntil: e.target.value }))}
                />
              </div>
              <Button
                onClick={() => createPromoCodeMutation.mutate(createData)}
                disabled={createPromoCodeMutation.isPending || !createData.code || !createData.name}
              >
                {createPromoCodeMutation.isPending ? "Creating..." : "Create Promo Code"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Promo Codes List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Promo Codes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading promo codes...</div>
          ) : promoCodes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No promo codes created yet. Create your first one!
            </div>
          ) : (
            <div className="space-y-4">
              {promoCodes.map((promoCode: PromoCode) => (
                <div
                  key={promoCode.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <code className="text-lg font-mono font-bold bg-muted px-2 py-1 rounded">
                        {promoCode.code}
                      </code>
                      <Badge variant={promoCode.isActive ? "default" : "secondary"}>
                        {promoCode.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">
                        {getTypeDisplay(promoCode.type, promoCode.value)}
                      </Badge>
                    </div>
                    <h4 className="font-semibold">{promoCode.name}</h4>
                    {promoCode.description && (
                      <p className="text-sm text-muted-foreground">{promoCode.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>Used: {promoCode.currentUses}/{promoCode.maxUses || "∞"}</span>
                      {promoCode.validUntil && (
                        <span>Expires: {new Date(promoCode.validUntil).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Toggle active status
                        updatePromoCodeMutation.mutate({
                          id: promoCode.id,
                          isActive: !promoCode.isActive
                        });
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingPromoCode(promoCode)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletePromoCodeMutation.mutate(promoCode.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}