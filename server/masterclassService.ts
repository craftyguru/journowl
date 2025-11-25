export interface Lesson {
  id: string;
  title: string;
  category: string;
  duration: number;
  content: string;
  tips: string[];
  example: string;
}

export class MasterclassService {
  private static lessons: Lesson[] = [
    {
      id: "lesson_1",
      title: "The Power of Details",
      category: "Writing Craft",
      duration: 5,
      content: "Great journaling captures specific details, not generalizations.",
      tips: [
        "Instead of 'I felt happy', write 'My chest felt light, I smiled without thinking'",
        "Replace 'It was nice' with 'The sunset painted orange across the water'"
      ],
      example: "❌ Good day. ✅ The coffee was perfectly warm, and Sarah laughed at my terrible joke again."
    },
    {
      id: "lesson_2",
      title: "Show Your Emotions",
      category: "Emotional Intelligence",
      duration: 5,
      content: "Don't tell emotions, show them through your body and actions.",
      tips: [
        "Write how emotions feel in your body",
        "Describe what you did because of the emotion"
      ],
      example: "❌ I was nervous. ✅ My hands trembled as I typed the email, rewriting it three times."
    },
    {
      id: "lesson_3",
      title: "Ask Yourself Questions",
      category: "Reflection",
      duration: 4,
      content: "Questions unlock deeper reflection and self-discovery.",
      tips: [
        "Why did I react that way?",
        "What would I do differently?",
        "What did I learn?"
      ],
      example: "Why did that comment bother me more than usual? What does it reveal about my insecurities?"
    },
    {
      id: "lesson_4",
      title: "Find Your Patterns",
      category: "Self-Awareness",
      duration: 6,
      content: "Regular journaling reveals your patterns, triggers, and growth areas.",
      tips: [
        "Look for recurring themes in your entries",
        "Notice when similar situations trigger similar reactions",
        "Track your mood patterns"
      ],
      example: "I notice I'm always anxious on Mondays. I eat less and second-guess my decisions."
    },
    {
      id: "lesson_5",
      title: "Celebrate Small Wins",
      category: "Positivity",
      duration: 4,
      content: "Acknowledging small victories builds momentum and confidence.",
      tips: [
        "Write about small achievements",
        "Notice moments of progress",
        "Be proud of consistency"
      ],
      example: "Today I said no to something that didn't serve me. That's growth."
    }
  ];

  static getAllLessons(): Lesson[] {
    return this.lessons;
  }

  static getLesson(id: string): Lesson | undefined {
    return this.lessons.find(l => l.id === id);
  }

  static getLessonsByCategory(category: string): Lesson[] {
    return this.lessons.filter(l => l.category === category);
  }
}
