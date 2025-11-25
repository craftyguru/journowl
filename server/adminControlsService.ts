export interface FeatureToggle {
  name: string;
  enabled: boolean;
  userSegment: "all" | "free" | "pro" | "power" | "admin";
  rolloutPercentage: number;
}

export interface SystemAlert {
  id: string;
  type: "error" | "warning" | "info";
  title: string;
  message: string;
  severity: "critical" | "high" | "medium" | "low";
  timestamp: Date;
  resolved: boolean;
}

class FeatureToggleStore {
  private toggles: Map<string, FeatureToggle> = new Map();

  constructor() {
    this.initializeToggles();
  }

  private initializeToggles() {
    const features = [
      "daily-challenges",
      "tournaments",
      "achievements",
      "email-reminders",
      "referrals",
      "leaderboards",
      "social-feed",
      "voice-journal",
      "ai-coaching",
      "extended-summaries"
    ];

    features.forEach(name => {
      this.toggles.set(name, {
        name,
        enabled: true,
        userSegment: "all",
        rolloutPercentage: 100
      });
    });
  }

  getAll(): FeatureToggle[] {
    return Array.from(this.toggles.values());
  }

  toggleFeature(name: string, enabled: boolean, segment: string = "all", rollout: number = 100): FeatureToggle | null {
    const toggle = this.toggles.get(name);
    if (toggle) {
      toggle.enabled = enabled;
      toggle.userSegment = segment as any;
      toggle.rolloutPercentage = rollout;
      return toggle;
    }
    return null;
  }

  isFeatureEnabled(name: string, userTier?: string): boolean {
    const toggle = this.toggles.get(name);
    if (!toggle || !toggle.enabled) return false;
    if (toggle.rolloutPercentage < 100) {
      return Math.random() * 100 < toggle.rolloutPercentage;
    }
    if (toggle.userSegment !== "all" && userTier !== toggle.userSegment) {
      return false;
    }
    return true;
  }
}

class SystemAlertStore {
  private alerts: Map<string, SystemAlert> = new Map();
  private alertId = 0;

  addAlert(type: "error" | "warning" | "info", title: string, message: string, severity: "critical" | "high" | "medium" | "low"): SystemAlert {
    const id = `alert_${++this.alertId}`;
    const alert: SystemAlert = {
      id,
      type,
      title,
      message,
      severity,
      timestamp: new Date(),
      resolved: false
    };
    this.alerts.set(id, alert);
    return alert;
  }

  getActive(): SystemAlert[] {
    return Array.from(this.alerts.values()).filter(a => !a.resolved);
  }

  resolveAlert(id: string): boolean {
    const alert = this.alerts.get(id);
    if (alert) {
      alert.resolved = true;
      return true;
    }
    return false;
  }

  getRecent(limit: number = 10): SystemAlert[] {
    return Array.from(this.alerts.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}

export const featureToggleStore = new FeatureToggleStore();
export const systemAlertStore = new SystemAlertStore();

export class AdminControlsService {
  static getFeatureToggles(): FeatureToggle[] {
    return featureToggleStore.getAll();
  }

  static toggleFeature(name: string, enabled: boolean, segment: string = "all", rollout: number = 100): FeatureToggle | null {
    return featureToggleStore.toggleFeature(name, enabled, segment, rollout);
  }

  static isFeatureEnabled(name: string, userTier?: string): boolean {
    return featureToggleStore.isFeatureEnabled(name, userTier);
  }

  static getSystemAlerts(): SystemAlert[] {
    return systemAlertStore.getActive();
  }

  static addAlert(type: "error" | "warning" | "info", title: string, message: string, severity: "critical" | "high" | "medium" | "low"): SystemAlert {
    return systemAlertStore.addAlert(type, title, message, severity);
  }

  static resolveAlert(id: string): boolean {
    return systemAlertStore.resolveAlert(id);
  }

  static getRecentAlerts(limit: number = 10): SystemAlert[] {
    return systemAlertStore.getRecent(limit);
  }
}
