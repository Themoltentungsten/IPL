import { mockPointsTable } from "../data/mock-data";

export class StatsService {
  async getPointsTable() {
    return {
      season: "IPL 2026",
      lastUpdated: new Date().toISOString(),
      teams: mockPointsTable,
    };
  }

  async getLeaders() {
    return {
      orangeCap: { name: "Virat Kohli", runs: 642 },
      purpleCap: { name: "Jasprit Bumrah", wickets: 23 },
    };
  }
}
