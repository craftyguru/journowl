// Analytics Engine - Aggregated wellness metrics for organizations
// All calculations are anonymized - no individual employee data exposed

import { type JournalEntry } from '@/lib/types';

export interface WellnessMetrics {
  participationRate: number; // 0-100%
  averageWellnessScore: number; // 0-100
  consistencyScore: number; // 0-100
  teamSize: number;
  activeUsers: number;
  entryCount: number;
  averageEntriesPerUser: number;
}

export interface OrganizationAnalytics {
  wellnessMetrics: WellnessMetrics;
  trend: 'improving' | 'stable' | 'declining';
  riskFlags: string[];
  recommendations: string[];
}

/**
 * Calculate anonymized wellness metrics for an organization
 * IMPORTANT: All calculations work with aggregated data only
 */
export function calculateWellnessMetrics(
  entries: JournalEntry[],
  teamSize: number = 50
): WellnessMetrics {
  if (entries.length === 0) {
    return {
      participationRate: 0,
      averageWellnessScore: 0,
      consistencyScore: 0,
      teamSize,
      activeUsers: 0,
      entryCount: 0,
      averageEntriesPerUser: 0
    };
  }

  // Get unique users who journaled (anonymized count)
  const uniqueUsers = new Set(entries.map(e => e.userId)).size;
  const participationRate = Math.min(100, (uniqueUsers / teamSize) * 100);

  // Calculate average wellness from mood emojis (anonymized)
  const moodScores = entries.map(e => {
    const mood = e.mood || '😊';
    const moodMap: Record<string, number> = {
      '😢': 20, '😔': 35, '😐': 50, '🙂': 70, '😊': 80, '😄': 90, '🤩': 100
    };
    return moodMap[mood] || 60;
  });
  const averageWellnessScore = Math.round(
    moodScores.reduce((a, b) => a + b, 0) / moodScores.length
  );

  // Consistency = how regularly team journals (no personal data)
  const last30Days = entries.filter(e => {
    const entryDate = new Date(e.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return entryDate >= thirtyDaysAgo;
  });
  const consistencyScore = Math.min(100, (last30Days.length / (teamSize * 2)) * 100);

  return {
    participationRate: Math.round(participationRate),
    averageWellnessScore,
    consistencyScore: Math.round(consistencyScore),
    teamSize,
    activeUsers: uniqueUsers,
    entryCount: entries.length,
    averageEntriesPerUser: Math.round((entries.length / teamSize) * 10) / 10
  };
}

/**
 * Generate organization analytics with trends and recommendations
 */
export function generateOrganizationAnalytics(
  entries: JournalEntry[],
  teamSize: number = 50
): OrganizationAnalytics {
  const metrics = calculateWellnessMetrics(entries, teamSize);

  // Determine trend
  let trend: 'improving' | 'stable' | 'declining' = 'stable';
  if (metrics.participationRate > 65) trend = 'improving';
  if (metrics.participationRate < 40) trend = 'declining';

  // Generate risk flags
  const riskFlags: string[] = [];
  if (metrics.participationRate < 50) {
    riskFlags.push('Low participation rate - consider wellness initiative');
  }
  if (metrics.averageWellnessScore < 60) {
    riskFlags.push('Average wellness below threshold - monitor team morale');
  }
  if (metrics.activeUsers < teamSize * 0.4) {
    riskFlags.push('Low user adoption - increase awareness and incentives');
  }

  // Generate recommendations
  const recommendations: string[] = [];
  if (metrics.participationRate < 60) {
    recommendations.push('Launch a 30-day wellness challenge to boost engagement');
  }
  if (metrics.averageWellnessScore < 70) {
    recommendations.push('Consider offering mental health resources or coaching');
  }
  if (metrics.consistencyScore < 50) {
    recommendations.push('Send weekly wellness reminders to encourage journaling habits');
  }
  recommendations.push('Share anonymized results with team for transparency');

  return {
    wellnessMetrics: metrics,
    trend,
    riskFlags,
    recommendations
  };
}

/**
 * Calculate burnout risk (anonymized)
 * Looks for patterns like declining participation, low wellness scores
 */
export function calculateBurnoutRisk(entries: JournalEntry[], teamSize: number = 50): number {
  const recentEntries = entries.slice(-50); // Last 50 entries
  if (recentEntries.length === 0) return 0;

  let riskScore = 0;

  // Factor 1: Participation decline
  const recentParticipation = new Set(recentEntries.map(e => e.userId)).size;
  const expectedParticipation = teamSize * 0.5;
  if (recentParticipation < expectedParticipation * 0.7) {
    riskScore += 20; // Participation dropping
  }

  // Factor 2: Negative sentiment (from mood)
  const negativeMoods = recentEntries.filter(e => {
    const mood = e.mood || '';
    return ['😢', '😔', '😐'].includes(mood);
  }).length;
  if (negativeMoods > recentEntries.length * 0.4) {
    riskScore += 25; // High negative sentiment
  }

  // Factor 3: Declining entry frequency
  const entryFrequency = recentEntries.length / teamSize;
  if (entryFrequency < 0.5) {
    riskScore += 15; // Low entry frequency
  }

  return Math.min(100, riskScore);
}

/**
 * Get department-level anonymized analytics
 * Returns aggregated metrics grouped by department (no personal data)
 */
export function getDepartmentAnalytics(
  entries: JournalEntry[],
  departmentMap: Record<number, string> = {} // userId -> department
): Record<string, WellnessMetrics> {
  const byDept: Record<string, JournalEntry[]> = {};

  entries.forEach(entry => {
    const dept = departmentMap[entry.userId] || 'General';
    if (!byDept[dept]) byDept[dept] = [];
    byDept[dept].push(entry);
  });

  const analytics: Record<string, WellnessMetrics> = {};
  Object.entries(byDept).forEach(([dept, deptEntries]) => {
    analytics[dept] = calculateWellnessMetrics(deptEntries, 20); // Assume 20 per dept
  });

  return analytics;
}

/**
 * Compliance audit helper - track what data was accessed
 */
export interface AccessLog {
  timestamp: Date;
  accessor: string; // "manager" | "hr_admin" | "executive"
  dataType: string; // "aggregated_metrics" | "compliance_report" | "audit_log"
  description: string;
}

export function logDataAccess(
  accessor: string,
  dataType: string,
  description: string
): AccessLog {
  return {
    timestamp: new Date(),
    accessor,
    dataType,
    description
  };
}
