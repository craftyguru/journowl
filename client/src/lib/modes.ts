// Multi-mode UX configuration system
// Single backend engine with different UI/UX personalities

export type InterfaceMode = 'wellness' | 'productivity' | 'trader' | 'team' | 'therapy';

export interface ModeConfig {
  id: InterfaceMode;
  name: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  gradient: string;
  aiTone: 'warm' | 'analytical' | 'professional' | 'neutral' | 'empathetic';
  defaultPrompts: string[];
  keyMetrics: string[];
  dashboardLayout: 'wellness' | 'performance' | 'analytics' | 'team' | 'clinical';
  icon: string;
}

export const MODES: Record<InterfaceMode, ModeConfig> = {
  wellness: {
    id: 'wellness',
    name: 'Personal Wellness',
    description: 'Reflection, mood tracking, and personal growth',
    primaryColor: '#ec4899', // pink
    accentColor: '#f97316', // orange
    gradient: 'from-pink-900 via-purple-900 to-indigo-900',
    aiTone: 'warm',
    defaultPrompts: [
      'What brought you the most joy today?',
      'How did your body feel today?',
      'What are you grateful for?',
      'What emotion is present for you right now?'
    ],
    keyMetrics: ['Mood Trend', 'Wellness Score', 'Streak', 'Writing Frequency'],
    dashboardLayout: 'wellness',
    icon: '🌸'
  },
  
  productivity: {
    id: 'productivity',
    name: 'Productive Creator',
    description: 'Focus on output, sprints, and creative momentum',
    primaryColor: '#06b6d4', // cyan
    accentColor: '#3b82f6', // blue
    gradient: 'from-cyan-900 via-blue-900 to-slate-900',
    aiTone: 'analytical',
    defaultPrompts: [
      'What did you accomplish today?',
      'What blocked your progress?',
      'What are you shipping next?',
      'How was your writing velocity?'
    ],
    keyMetrics: ['Words Written', 'Sprint Speed', 'Output Velocity', 'Focus Time'],
    dashboardLayout: 'performance',
    icon: '⚡'
  },
  
  trader: {
    id: 'trader',
    name: 'Trader / Analyst',
    description: 'Pattern recognition, emotional psychology, market psychology',
    primaryColor: '#f59e0b', // amber
    accentColor: '#10b981', // emerald
    gradient: 'from-amber-900 via-orange-900 to-red-900',
    aiTone: 'analytical',
    defaultPrompts: [
      'What emotional biases influenced your decisions today?',
      'What patterns did you notice in your thinking?',
      'How did fear or greed show up?',
      'What data contradicted your intuition?'
    ],
    keyMetrics: ['Bias Tracking', 'Pattern Recognition', 'Decision Log', 'Risk Assessment'],
    dashboardLayout: 'analytics',
    icon: '📈'
  },
  
  team: {
    id: 'team',
    name: 'Corporate Team',
    description: 'Organization wellness, team engagement, anonymized dashboards',
    primaryColor: '#6366f1', // indigo
    accentColor: '#8b5cf6', // violet
    gradient: 'from-indigo-900 via-purple-900 to-slate-900',
    aiTone: 'professional',
    defaultPrompts: [
      'How did collaboration go today?',
      'What challenges did your team face?',
      'How\'s your wellbeing as a leader?',
      'What\'s your team\'s morale today?'
    ],
    keyMetrics: ['Team Engagement', 'Wellness Index', 'Participation Rate', 'Retention'],
    dashboardLayout: 'team',
    icon: '👥'
  },
  
  therapy: {
    id: 'therapy',
    name: 'Clinical / Therapy',
    description: 'Supervised reflection, client assignment, therapeutic protocols',
    primaryColor: '#0ea5e9', // sky
    accentColor: '#06b6d4', // cyan
    gradient: 'from-sky-900 via-blue-900 to-slate-900',
    aiTone: 'empathetic',
    defaultPrompts: [
      'What emotions came up for you today?',
      'What patterns did you notice in your thoughts?',
      'How are you processing this experience?',
      'What insights emerged during reflection?'
    ],
    keyMetrics: ['Progress Tracking', 'Insight Frequency', 'Emotional Patterns', 'Session Notes'],
    dashboardLayout: 'clinical',
    icon: '🧠'
  }
};

// Get mode configuration by ID
export function getMode(modeId: InterfaceMode): ModeConfig {
  return MODES[modeId] || MODES.wellness;
}

// Get all mode options for selector
export function getModeOptions() {
  return Object.values(MODES).map(mode => ({
    value: mode.id,
    label: mode.name,
    description: mode.description,
    icon: mode.icon
  }));
}

// Apply mode colors to theme
export function getModeTailwindClasses(mode: InterfaceMode): {
  bg: string;
  text: string;
  accent: string;
} {
  const config = getMode(mode);
  const colorMap: Record<string, { bg: string; accent: string; text: string }> = {
    '#ec4899': { bg: 'from-pink-900 via-purple-900 to-indigo-900', accent: 'pink-600', text: 'text-pink-500' },
    '#06b6d4': { bg: 'from-cyan-900 via-blue-900 to-slate-900', accent: 'cyan-600', text: 'text-cyan-500' },
    '#f59e0b': { bg: 'from-amber-900 via-orange-900 to-red-900', accent: 'amber-600', text: 'text-amber-500' },
    '#6366f1': { bg: 'from-indigo-900 via-purple-900 to-slate-900', accent: 'indigo-600', text: 'text-indigo-500' },
    '#0ea5e9': { bg: 'from-sky-900 via-blue-900 to-slate-900', accent: 'sky-600', text: 'text-sky-500' }
  };
  
  return colorMap[config.primaryColor] || colorMap['#ec4899'];
}
