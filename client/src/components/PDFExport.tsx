import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { Download, Loader, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface StatsResponse {
  stats: {
    totalEntries?: number;
    totalWords?: number;
    currentStreak?: number;
    longestStreak?: number;
  };
}

interface PDFExportProps {
  entries?: any[];
  isOpen: boolean;
  onClose: () => void;
}

export function PDFExport({ entries = [], isOpen, onClose }: PDFExportProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeRange, setTimeRange] = useState("all");
  const [includeAnalytics, setIncludeAnalytics] = useState(true);
  const [includeImages, setIncludeImages] = useState(true);

  const { data: userStats } = useQuery<StatsResponse>({
    queryKey: ["/api/stats"],
  });

  const generatePDF = async () => {
    try {
      setIsGenerating(true);

      // Filter entries based on time range
      const now = new Date();
      let filteredEntries = entries;

      if (timeRange === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredEntries = entries.filter((e: any) => new Date(e.createdAt) >= weekAgo);
      } else if (timeRange === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredEntries = entries.filter((e: any) => new Date(e.createdAt) >= monthAgo);
      } else if (timeRange === "year") {
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        filteredEntries = entries.filter((e: any) => new Date(e.createdAt) >= yearAgo);
      }

      // Create PDF blob and download
      const { jsPDF } = await import("jspdf");
      const html2canvas = (await import("html2canvas")).default;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      let yPosition = margin;

      // Title page
      pdf.setFontSize(28);
      pdf.text("🦉 JournOwl", pageWidth / 2, yPosition, { align: "center" });

      yPosition += 20;
      pdf.setFontSize(16);
      pdf.text("My Journal", pageWidth / 2, yPosition, { align: "center" });

      yPosition += 30;
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);

      const dateRange = `${new Date(filteredEntries[filteredEntries.length - 1]?.createdAt).toLocaleDateString()} - ${new Date().toLocaleDateString()}`;
      pdf.text(`Export Date: ${dateRange}`, pageWidth / 2, yPosition, { align: "center" });

      yPosition += 40;
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);

      if (includeAnalytics && userStats) {
        pdf.text("Summary Statistics", margin, yPosition);
        yPosition += 10;
        pdf.setFontSize(10);
        pdf.text(`Total Entries: ${userStats.stats?.totalEntries || 0}`, margin + 5, yPosition);
        yPosition += 8;
        pdf.text(`Total Words: ${userStats.stats?.totalWords || 0}`, margin + 5, yPosition);
        yPosition += 8;
        pdf.text(`Current Streak: ${userStats.stats?.currentStreak || 0} days`, margin + 5, yPosition);
        yPosition += 8;
        pdf.text(`Longest Streak: ${userStats.stats?.longestStreak || 0} days`, margin + 5, yPosition);
        yPosition += 20;
      }

      // Add entries
      pdf.addPage();
      yPosition = margin;

      filteredEntries.forEach((entry: any, idx: number) => {
        const entryDate = new Date(entry.createdAt).toLocaleDateString();

        // Check if we need a new page
        if (yPosition > pageHeight - margin - 50) {
          pdf.addPage();
          yPosition = margin;
        }

        // Entry header with mood
        pdf.setFontSize(12);
        pdf.setTextColor(80, 20, 100); // Purple
        pdf.text(`${entry.mood || "📝"} ${entryDate}`, margin, yPosition);
        yPosition += 8;

        // Tags if available
        if (entry.tags && entry.tags.length > 0) {
          pdf.setFontSize(9);
          pdf.setTextColor(150, 150, 150);
          const tagsText = `Tags: ${entry.tags.join(", ")}`;
          const tagsLines = pdf.splitTextToSize(tagsText, pageWidth - 2 * margin);
          pdf.text(tagsLines, margin, yPosition);
          yPosition += tagsLines.length * 5 + 3;
        }

        // Entry content
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        const contentLines = pdf.splitTextToSize(entry.content || "", pageWidth - 2 * margin - 5);
        pdf.text(contentLines, margin + 5, yPosition);
        yPosition += contentLines.length * 5 + 8;

        // Word count
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`${entry.wordCount || 0} words`, margin + 5, yPosition);
        yPosition += 10;

        // Separator
        pdf.setDrawColor(220, 220, 220);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;
      });

      // Footer
      pdf.setFontSize(9);
      pdf.setTextColor(150, 150, 150);
      pdf.text("Created with JournOwl - Your AI-Powered Journaling Companion", margin, pageHeight - 10);

      // Save PDF
      const filename = `JournOwl_Export_${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(filename);

      toast({
        title: "PDF Generated!",
        description: `Your journal export is ready: ${filename}`,
      });

      onClose();
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Export Failed",
        description: "Unable to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <FileText className="w-5 h-5" />
            Export as PDF
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 py-4"
        >
          {/* Time Range */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Time Range</label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="bg-white/10 border border-purple-500/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-white block">Include in Export</label>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
              <Checkbox
                id="analytics"
                checked={includeAnalytics}
                onCheckedChange={(checked) => setIncludeAnalytics(checked === true)}
                className="border-purple-500"
                data-testid="checkbox-include-analytics"
              />
              <label htmlFor="analytics" className="text-sm text-white cursor-pointer">
                Summary Statistics
              </label>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
              <Checkbox
                id="images"
                checked={includeImages}
                onCheckedChange={(checked) => setIncludeImages(checked === true)}
                className="border-purple-500"
                data-testid="checkbox-include-images"
              />
              <label htmlFor="images" className="text-sm text-white cursor-pointer">
                Entry Images (if available)
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="p-3 rounded-lg bg-white/5 border border-purple-500/20">
            <p className="text-xs text-white/70">
              📄 {entries.length} total entries • Filtered: {timeRange}
            </p>
          </div>
        </motion.div>

        <DialogFooter className="gap-3 flex">
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-white hover:bg-white/10"
            data-testid="button-cancel-pdf"
          >
            Cancel
          </Button>
          <Button
            onClick={generatePDF}
            disabled={isGenerating || entries.length === 0}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            data-testid="button-generate-pdf"
          >
            {isGenerating ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
