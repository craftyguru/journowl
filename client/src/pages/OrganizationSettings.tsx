import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";

const organizationSettingsSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  logoUrl: z.string().optional(),
  industry: z.string().optional(),
  dataRegion: z.string().optional(),
});

type OrganizationSettingsForm = z.infer<typeof organizationSettingsSchema>;

export default function OrganizationSettingsPage() {
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string>("");

  const { data: organization, isLoading: orgLoading } = useQuery({
    queryKey: ["/api/org/settings"],
    queryFn: async () => {
      const response = await fetch("/api/org/settings");
      if (!response.ok) throw new Error("Failed to fetch organization settings");
      return response.json();
    },
  });

  const form = useForm<OrganizationSettingsForm>({
    resolver: zodResolver(organizationSettingsSchema),
    defaultValues: {
      name: organization?.name || "",
      logoUrl: organization?.logoUrl || "",
      industry: organization?.industry || "",
      dataRegion: organization?.dataRegion || "us",
    },
  });

  const updateOrgMutation = useMutation({
    mutationFn: async (data: OrganizationSettingsForm) => {
      return apiRequest("PATCH", "/api/org/settings", data);
    },
    onSuccess: () => {
      toast({ title: "Organization settings updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/org/settings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating organization settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setLogoPreview(result);
      form.setValue("logoUrl", result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (data: OrganizationSettingsForm) => {
    updateOrgMutation.mutate(data);
  };

  if (orgLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Organization Settings</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your organization's profile and settings
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Organization Profile</CardTitle>
            <CardDescription>
              Update your organization's basic information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Organization Logo */}
              <div className="space-y-2">
                <Label htmlFor="logo">Organization Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                    {logoPreview || organization?.logoUrl ? (
                      <img
                        src={logoPreview || organization?.logoUrl}
                        alt="Logo preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="logo"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload Logo</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Organization Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  placeholder="Enter organization name"
                  {...form.register("name")}
                  data-testid="input-org-name"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  placeholder="e.g., Healthcare, Technology, Finance"
                  {...form.register("industry")}
                  data-testid="input-industry"
                />
              </div>

              {/* Data Region */}
              <div className="space-y-2">
                <Label htmlFor="dataRegion">Data Region</Label>
                <Select
                  value={form.watch("dataRegion") || "us"}
                  onValueChange={(value) => form.setValue("dataRegion", value)}
                >
                  <SelectTrigger id="dataRegion" data-testid="select-data-region">
                    <SelectValue placeholder="Select data region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States (US)</SelectItem>
                    <SelectItem value="eu">European Union (EU)</SelectItem>
                    <SelectItem value="apac">Asia Pacific (APAC)</SelectItem>
                    <SelectItem value="ca">Canada (CA)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={updateOrgMutation.isPending}
                  data-testid="button-save-settings"
                >
                  {updateOrgMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Settings
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Additional Info Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Organization Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {organization?.createdAt
                    ? new Date(organization.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Plan</p>
                <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 capitalize">
                  {organization?.plan || "Free"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
