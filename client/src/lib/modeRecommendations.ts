// Mode recommendation engine
// Analyzes user behavior and suggests better-fit modes

export interface BehaviorAnalysis {
  analyticalEntries: number;
  emotionalEntries: number;
  objectiveEntries: number;
  reflectiveEntries: number;
  structuredEntries: number;
  performanceMetricsViews: number;
  moodTrackingViews: number;
  socialInteractions: number;
  timeToWrite: number; // minutes
  consistencyScore: number; // 0-100
  totalEntries: number;
}

interface ModeRecommendation {
  suggestedMode: string;
  confidence: number; // 0-100
  reason: string;
  supportingMetrics: string[];
}

export function analyzeBehavior(entries: any[]): BehaviorAnalysis {
  if (entries.length === 0) {
    return {
      analyticalEntries: 0,
      emotionalEntries: 0,
      objectiveEntries: 0,
      reflectiveEntries: 0,
      structuredEntries: 0,
      performanceMetricsViews: 0,
      moodTrackingViews: 0,
      socialInteractions: 0,
      timeToWrite: 0,
      consistencyScore: 0,
      totalEntries: 0
    };
  }

  let analytical = 0, emotional = 0, objective = 0, reflective = 0, structured = 0;
  let totalWords = 0;

  entries.forEach(entry => {
    const content = (entry.content || '').toLowerCase();
    const title = (entry.title || '').toLowerCase();
    const mood = entry.mood || '';

    // Detect writing style
    if (content.includes('analysis') || content.includes('data') || content.includes('pattern')) {
      analytical++;
    }
    if (content.includes('feel') || content.includes('emotion') || mood) {
      emotional++;
    }
    if (content.includes('today') || content.includes('did') || content.includes('accomplished')) {
      objective++;
    }
    if (content.includes('think') || content.includes('realize') || content.includes('understand')) {
      reflective++;
    }
    if (content.includes('goal') || content.includes('plan') || content.includes('target')) {
      structured++;
    }

    totalWords += entry.wordCount || 0;
  });

  return {
    analyticalEntries: analytical,
    emotionalEntries: emotional,
    objectiveEntries: objective,
    reflectiveEntries: reflective,
    structuredEntries: structured,
    performanceMetricsViews: 0,
    moodTrackingViews: emotional,
    socialInteractions: 0,
    timeToWrite: totalWords > 0 ? Math.ceil(totalWords / 200) : 0, // Assume 200 words per 5min
    consistencyScore: Math.min(100, entries.length * 10),
    totalEntries: entries.length
  };
}

export function recommendMode(behavior: BehaviorAnalysis): ModeRecommendation {
  // If no entries, stay with default
  if (behavior.totalEntries === 0) {
    return {
      suggestedMode: 'wellness',
      confidence: 0,
      reason: 'Not enough data to recommend',
      supportingMetrics: []
    };
  }

  const scores: Record<string, number> = {
    wellness: 0,
    productivity: 0,
    trader: 0,
    team: 0,
    therapy: 0
  };

  // Wellness: emotional + reflective focus
  scores.wellness = behavior.emotionalEntries * 2 + behavior.reflectiveEntries;

  // Productivity: objective + structured + performance focus
  scores.productivity = behavior.objectiveEntries * 2 + behavior.structuredEntries + behavior.performanceMetricsViews;

  // Trader: analytical + objective (decision-focused writing)
  scores.trader = behavior.analyticalEntries * 2 + behavior.objectiveEntries;

  // Team: mix of reflective + consistency
  scores.team = behavior.reflectiveEntries + behavior.consistencyScore / 20;

  // Therapy: high reflective + emotional
  scores.therapy = behavior.reflectiveEntries * 1.5 + behavior.emotionalEntries;

  // Find max
  let suggestedMode = 'wellness';
  let maxScore = 0;

  Object.entries(scores).forEach(([mode, score]) => {
    if (score > maxScore) {
      maxScore = score;
      suggestedMode = mode;
    }
  });

  // Calculate confidence (0-100)
  const confidence = Math.min(100, (maxScore / behavior.totalEntries) * 50);

  // Generate reason
  let reason = '';
  const metrics: string[] = [];

  if (suggestedMode === 'wellness' && behavior.emotionalEntries > behavior.analyticalEntries) {
    reason = 'Your entries focus on emotions and self-reflection.';
    metrics.push(`${behavior.emotionalEntries} emotional entries`);
  }
  if (suggestedMode === 'productivity' && behavior.objectiveEntries > behavior.emotionalEntries) {
    reason = 'Your entries emphasize achievements and goals.';
    metrics.push(`${behavior.objectiveEntries} goal-focused entries`);
  }
  if (suggestedMode === 'trader' && behavior.analyticalEntries > behavior.emotionalEntries) {
    reason = 'Your entries show analytical, decision-focused thinking.';
    metrics.push(`${behavior.analyticalEntries} analytical entries`);
  }
  if (suggestedMode === 'therapy' && behavior.reflectiveEntries > behavior.analyticalEntries) {
    reason = 'Your entries show deep reflection and processing.';
    metrics.push(`${behavior.reflectiveEntries} reflective entries`);
  }

  return {
    suggestedMode,
    confidence: Math.round(confidence),
    reason,
    supportingMetrics: metrics
  };
}

export function shouldRecommendModeChange(
  currentMode: string,
  behavior: BehaviorAnalysis,
  threshold: number = 60
): ModeRecommendation | null {
  const recommendation = recommendMode(behavior);

  // Only recommend if confidence is high and mode is different
  if (recommendation.confidence >= threshold && recommendation.suggestedMode !== currentMode) {
    return recommendation;
  }

  return null;
}
