import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Settings,
  Shield,
  Users,
  LogOut,
  Lock,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Trash2,
  Eye,
} from "lucide-react";

// Organization Settings Tab
function OrgSettingsTab() {
  const { toast } = useToast();
  const [orgData, setOrgData] = useState({
    name: "",
    website: "",
    industry: "other",
    dataRegion: "us",
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof orgData) => {
      return apiRequest("/api/org/settings", { method: "PUT", body: data });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Organization settings updated",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/org/settings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Organization Settings
          </CardTitle>
          <CardDescription>Manage your organization profile and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="org-name">Organization Name</Label>
            <Input
              id="org-name"
              value={orgData.name}
              onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
              placeholder="Acme Corp"
            />
          </div>

          <div>
            <Label htmlFor="org-website">Website</Label>
            <Input
              id="org-website"
              value={orgData.website}
              onChange={(e) => setOrgData({ ...orgData, website: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          <div>
            <Label htmlFor="org-industry">Industry</Label>
            <Select value={orgData.industry} onValueChange={(value) => setOrgData({ ...orgData, industry: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="data-region">Data Region</Label>
            <Select value={orgData.dataRegion} onValueChange={(value) => setOrgData({ ...orgData, dataRegion: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">US (East)</SelectItem>
                <SelectItem value="eu">EU (GDPR)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => mutation.mutate(orgData)}
            disabled={mutation.isPending}
            className="w-full"
          >
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// AI Policy Management Tab
function AIPolicyTab() {
  const { toast } = useToast();
  const { data: settings } = useQuery({
    queryKey: ["/api/org/ai-settings"],
    queryFn: async () => apiRequest("/api/org/ai-settings"),
  });

  const [policy, setPolicy] = useState({
    allowCoachingChat: true,
    allowPersonalDataToAi: false,
    maxTokensPerMonth: 100000,
    redactPii: true,
    allowedModels: ["gpt-4o-mini"],
  });

  const mutation = useMutation({
    mutationFn: async () => apiRequest("/api/org/ai-settings", { method: "PUT", body: policy }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "AI policies updated",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/org/ai-settings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            AI Governance Policy
          </CardTitle>
          <CardDescription>Control AI feature usage and data handling</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded">
            <div>
              <Label className="font-semibold">Enable Coaching Chat</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Allow AI coaching features</p>
            </div>
            <Switch
              checked={policy.allowCoachingChat}
              onCheckedChange={(checked) => setPolicy({ ...policy, allowCoachingChat: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded">
            <div>
              <Label className="font-semibold">Allow Personal Data to AI</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Send identified personal data to AI</p>
            </div>
            <Switch
              checked={policy.allowPersonalDataToAi}
              onCheckedChange={(checked) => setPolicy({ ...policy, allowPersonalDataToAi: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded">
            <div>
              <Label className="font-semibold">Redact PII</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Automatically remove personal identifiable information</p>
            </div>
            <Switch
              checked={policy.redactPii}
              onCheckedChange={(checked) => setPolicy({ ...policy, redactPii: checked })}
            />
          </div>

          <div>
            <Label htmlFor="max-tokens">Max Tokens Per Month</Label>
            <Input
              id="max-tokens"
              type="number"
              value={policy.maxTokensPerMonth}
              onChange={(e) => setPolicy({ ...policy, maxTokensPerMonth: parseInt(e.target.value) })}
            />
          </div>

          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="w-full">
            Update AI Policy
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// SSO Configuration Tab
function SSOConfigTab() {
  const { toast } = useToast();
  const { data: ssoConfig } = useQuery({
    queryKey: ["/api/admin/sso/config"],
    queryFn: async () => apiRequest("/api/admin/sso/config"),
  });

  const [provider, setProvider] = useState({
    type: "saml",
    name: "",
    issuer: "",
    ssoUrl: "",
    entityId: "",
    certificate: "",
    clientId: "",
    clientSecret: "",
  });

  const mutation = useMutation({
    mutationFn: async () => apiRequest("/api/admin/sso/provider", { method: "POST", body: provider }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "SSO provider configured",
      });
      setProvider({
        type: "saml",
        name: "",
        issuer: "",
        ssoUrl: "",
        entityId: "",
        certificate: "",
        clientId: "",
        clientSecret: "",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/sso/config"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            SSO Configuration
          </CardTitle>
          <CardDescription>Configure SAML/OIDC enterprise single sign-on</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="sso-type">Provider Type</Label>
            <Select value={provider.type} onValueChange={(value) => setProvider({ ...provider, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saml">SAML</SelectItem>
                <SelectItem value="oidc">OpenID Connect</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="sso-name">Provider Name</Label>
            <Input
              id="sso-name"
              value={provider.name}
              onChange={(e) => setProvider({ ...provider, name: e.target.value })}
              placeholder="My Enterprise SSO"
            />
          </div>

          <div>
            <Label htmlFor="sso-issuer">Issuer URL</Label>
            <Input
              id="sso-issuer"
              value={provider.issuer}
              onChange={(e) => setProvider({ ...provider, issuer: e.target.value })}
              placeholder="https://idp.example.com"
            />
          </div>

          <div>
            <Label htmlFor="sso-url">SSO URL</Label>
            <Input
              id="sso-url"
              value={provider.ssoUrl}
              onChange={(e) => setProvider({ ...provider, ssoUrl: e.target.value })}
              placeholder="https://idp.example.com/sso"
            />
          </div>

          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="w-full">
            Configure SSO Provider
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Providers</CardTitle>
        </CardHeader>
        <CardContent>
          {ssoConfig?.providers && ssoConfig.providers.length > 0 ? (
            <div className="space-y-2">
              {ssoConfig.providers.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded">
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{p.type.toUpperCase()}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No SSO providers configured</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Audit Log Viewer Tab
function AuditLogsTab() {
  const { data: auditLogs } = useQuery({
    queryKey: ["/api/admin/audit-logs"],
    queryFn: async () => apiRequest("/api/admin/audit-logs?limit=100"),
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case "export_data":
        return <Download className="w-4 h-4" />;
      case "delete_user_data":
        return <Trash2 className="w-4 h-4" />;
      case "update_settings":
        return <Settings className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Audit Logs
          </CardTitle>
          <CardDescription>View all organization activities and compliance events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {auditLogs && auditLogs.length > 0 ? (
              auditLogs.map((log: any) => (
                <div key={log.id} className="flex items-start justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded border-l-4 border-blue-500">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{getActionIcon(log.action)}</div>
                    <div className="flex-1">
                      <p className="font-semibold">{log.action}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {log.resourceType && `Resource: ${log.resourceType}`}
                      </p>
                      {log.details && (
                        <p className="text-xs text-gray-500 mt-1">{JSON.stringify(log.details).substring(0, 100)}...</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No audit logs yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Compliance & Data Management Tab
function ComplianceTab() {
  const { toast } = useToast();

  const exportMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("/api/admin/export-org-data", {
        method: "POST",
        body: { dataTypes: ["users", "entries", "settings"] },
      });
      // Trigger download
      const blob = new Blob([JSON.stringify(response, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `org-data-${new Date().toISOString()}.json`;
      a.click();
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Organization data exported",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Compliance & Data Management
          </CardTitle>
          <CardDescription>GDPR/CCPA compliance and data export tools</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-200">Data Export</h4>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  Export all organization data including user information, journal entries, and settings
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => exportMutation.mutate()}
            disabled={exportMutation.isPending}
            className="w-full"
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Organization Data
          </Button>

          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 dark:text-red-200">Dangerous Actions</h4>
                <p className="text-sm text-red-800 dark:text-red-300">
                  These actions cannot be undone. Use with caution.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              For user deletion and anonymization, use the User Management tab
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Enterprise Admin Console Component
export function EnterpriseAdminConsole() {
  const { data: features } = useQuery({
    queryKey: ["/api/org/features"],
    queryFn: async () => apiRequest("/api/org/features"),
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Enterprise Admin Console</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage organization settings, AI policies, SSO, compliance, and audit logs
        </p>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="ai-policy">
            <Shield className="w-4 h-4 mr-2" />
            AI Policy
          </TabsTrigger>
          <TabsTrigger
            value="sso"
            disabled={!features?.enableSAML && !features?.enableOIDC}
            title={!features?.enableSAML && !features?.enableOIDC ? "Requires Enterprise plan" : ""}
          >
            <Lock className="w-4 h-4 mr-2" />
            SSO
          </TabsTrigger>
          <TabsTrigger value="audit">
            <Eye className="w-4 h-4 mr-2" />
            Audit Logs
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <AlertCircle className="w-4 h-4 mr-2" />
            Compliance
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="settings">
            <OrgSettingsTab />
          </TabsContent>
          <TabsContent value="ai-policy">
            <AIPolicyTab />
          </TabsContent>
          <TabsContent value="sso">
            <SSOConfigTab />
          </TabsContent>
          <TabsContent value="audit">
            <AuditLogsTab />
          </TabsContent>
          <TabsContent value="compliance">
            <ComplianceTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
