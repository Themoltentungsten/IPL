import { cricApiDataService } from "./cricapi-data.service";

export class StatsService {
  async getPointsTable() {
    const rows = await cricApiDataService.getPointsTable();
    const sorted = [...rows].sort((a, b) => {
      const ptsA = a.wins * 2;
      const ptsB = b.wins * 2;
      if (ptsB !== ptsA) return ptsB - ptsA;
      return b.wins - a.wins;
    });
    return {
      season: "IPL 2026",
      lastUpdated: new Date().toISOString(),
      teams: sorted.map((r, i) => ({
        position: i + 1,
        team: r.shortname,
        teamName: r.teamname,
        img: r.img,
        played: r.matches,
        won: r.wins,
        lost: r.loss,
        tied: r.ties,
        noResult: r.nr,
        points: r.wins * 2,
        nrr: 0,
      })),
    };
  }

  async getLeaders() {
    const players = await cricApiDataService.aggregatePlayerStats();
    const topRuns = [...players].sort((a, b) => b.runs - a.runs)[0];
    const topWickets = [...players].sort((a, b) => b.wickets - a.wickets)[0];
    return {
      orangeCap: topRuns ? { name: topRuns.name, team: topRuns.team, runs: topRuns.runs } : null,
      purpleCap: topWickets ? { name: topWickets.name, team: topWickets.team, wickets: topWickets.wickets } : null,
    };
  }

  async getRecords() {
    const players = await cricApiDataService.aggregatePlayerStats();
    const topBat = [...players].sort((a, b) => b.runs - a.runs).slice(0, 5);
    const topBowl = [...players].sort((a, b) => b.wickets - a.wickets).slice(0, 5);
    const topSR = [...players].filter((p) => p.balls >= 30).sort((a, b) => b.strikeRate - a.strikeRate).slice(0, 5);
    return {
      topRunScorers: topBat.map((p) => ({ name: p.name, team: p.team, runs: p.runs, matches: p.matches, strikeRate: p.strikeRate })),
      topWicketTakers: topBowl.map((p) => ({ name: p.name, team: p.team, wickets: p.wickets, matches: p.matches, economy: p.economy })),
      topStrikeRates: topSR.map((p) => ({ name: p.name, team: p.team, strikeRate: p.strikeRate, runs: p.runs, balls: p.balls })),
    };
  }
}
