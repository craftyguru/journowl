export interface Tournament {
  id: string;
  name: string;
  description: string;
  type: "weekly" | "monthly" | "seasonal";
  status: "active" | "completed" | "upcoming";
  startDate: Date;
  endDate: Date;
  prize: string;
  rules: string;
  participants: number;
  leaderboard: { userId: number; username: string; score: number; rank: number }[];
}

class TournamentStore {
  private tournaments: Map<string, Tournament> = new Map();
  private tournamentId = 0;
  private participations: Map<string, number[]> = new Map();

  createTournament(name: string, description: string, type: "weekly" | "monthly" | "seasonal"): Tournament {
    const id = `tour_${++this.tournamentId}`;
    const now = new Date();
    const endDate = new Date(now);
    
    if (type === "weekly") endDate.setDate(endDate.getDate() + 7);
    else if (type === "monthly") endDate.setMonth(endDate.getMonth() + 1);
    else endDate.setDate(endDate.getDate() + 30);

    const tournament: Tournament = {
      id,
      name,
      description,
      type,
      status: "active",
      startDate: now,
      endDate,
      prize: type === "weekly" ? "500 AI Prompts" : type === "monthly" ? "2000 AI Prompts" : "10000 AI Prompts",
      rules: "Most journal entries wins!",
      participants: 0,
      leaderboard: []
    };

    this.tournaments.set(id, tournament);
    return tournament;
  }

  addParticipant(tournamentId: string, userId: number): boolean {
    const participants = this.participations.get(tournamentId) || [];
    if (!participants.includes(userId)) {
      participants.push(userId);
      this.participations.set(tournamentId, participants);
      
      const tournament = this.tournaments.get(tournamentId);
      if (tournament) {
        tournament.participants = participants.length;
      }
      return true;
    }
    return false;
  }

  getActiveTournaments(): Tournament[] {
    const active: Tournament[] = [];
    this.tournaments.forEach(t => {
      if (t.status === "active") active.push(t);
    });
    return active;
  }

  getTournamentById(id: string): Tournament | null {
    return this.tournaments.get(id) || null;
  }

  updateLeaderboard(tournamentId: string, leaderboard: { userId: number; username: string; score: number }[]) {
    const tournament = this.tournaments.get(tournamentId);
    if (tournament) {
      tournament.leaderboard = leaderboard
        .sort((a, b) => b.score - a.score)
        .map((entry, idx) => ({
          ...entry,
          rank: idx + 1
        }));
    }
  }
}

export const tournamentStore = new TournamentStore();

export class TournamentService {
  static createTournament(name: string, description: string, type: "weekly" | "monthly" | "seasonal"): Tournament {
    return tournamentStore.createTournament(name, description, type);
  }

  static getActiveTournaments(): Tournament[] {
    return tournamentStore.getActiveTournaments();
  }

  static getTournamentById(id: string): Tournament | null {
    return tournamentStore.getTournamentById(id);
  }

  static joinTournament(tournamentId: string, userId: number): boolean {
    return tournamentStore.addParticipant(tournamentId, userId);
  }

  static initializeDefaultTournaments() {
    // Create default tournaments
    this.createTournament(
      "Weekly Writing Challenge",
      "Write the most entries this week",
      "weekly"
    );
    this.createTournament(
      "Monthly Consistency Challenge",
      "Maintain your streak throughout the month",
      "monthly"
    );
    this.createTournament(
      "Seasonal Journaling Marathon",
      "Epic 30-day writing marathon",
      "seasonal"
    );
  }
}
