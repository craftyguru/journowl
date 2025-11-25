export interface JournalTemplate {
  id: string;
  title: string;
  category: string;
  mood: string;
  prompts: string[];
  icon: string;
}

export class TemplateLibraryService {
  private static templates: JournalTemplate[] = [
    {
      id: "template_1",
      title: "Gratitude Reflection",
      category: "Positive",
      mood: "happy",
      icon: "🙏",
      prompts: [
        "What am I grateful for today?",
        "Who made me smile today?",
        "What small moment brought me joy?"
      ]
    },
    {
      id: "template_2",
      title: "Worry Release",
      category: "Mindfulness",
      mood: "anxious",
      icon: "🧘",
      prompts: [
        "What worries are weighing on me?",
        "What can I control vs. what I can't?",
        "How can I release this worry?"
      ]
    },
    {
      id: "template_3",
      title: "Goal Setting",
      category: "Growth",
      mood: "motivated",
      icon: "🎯",
      prompts: [
        "What do I want to achieve this week?",
        "What steps can I take today?",
        "What obstacles might I face?"
      ]
    },
    {
      id: "template_4",
      title: "Self-Compassion",
      category: "Healing",
      mood: "sad",
      icon: "💚",
      prompts: [
        "What am I struggling with?",
        "What would I tell a friend?",
        "How can I be kind to myself?"
      ]
    },
    {
      id: "template_5",
      title: "Peak Performance",
      category: "Reflection",
      mood: "proud",
      icon: "🏆",
      prompts: [
        "What went well today?",
        "What skills did I use?",
        "How can I replicate this success?"
      ]
    }
  ];

  static getAllTemplates(): JournalTemplate[] {
    return this.templates;
  }

  static getTemplatesByMood(mood: string): JournalTemplate[] {
    return this.templates.filter(t => t.mood === mood);
  }

  static getTemplate(id: string): JournalTemplate | undefined {
    return this.templates.find(t => t.id === id);
  }
}
