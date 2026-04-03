# COMPREHENSIVE IPL MATCH PREDICTION & TRACKING WEBSITE — PROJECT SPEC PROMPT

## PROJECT OVERVIEW
Build a production-ready, real-time IPL (Indian Premier League) cricket website with AI-powered match predictions, live score tracking, comprehensive statistics, and beautiful UI/UX. The website should predict match winners at ANY point during the match (pre-toss, post-toss, during innings) with maximum accuracy using historical data from IPL Seasons 1-19 and live match context.

---

## CORE FEATURES & REQUIREMENTS

### 1. REAL-TIME MATCH PREDICTION ENGINE (PRIMARY FEATURE)

#### Prediction Capabilities:
- **Pre-Toss Prediction**: Analyze team form, head-to-head, venue stats, recent performance
- **Post-Toss Prediction**: Factor in toss decision (bat/field), playing XI, pitch conditions
- **Live In-Match Prediction**: Real-time win probability updates every ball/over
- **Dynamic Prediction Updates**: Recalculate probabilities based on:
  - Current score and run rate
  - Wickets fallen and batsmen at crease
  - Overs remaining
  - Required run rate (2nd innings)
  - Partnership momentum
  - Bowler effectiveness in current spell
  - Death overs performance patterns
  - Pressure situations (power play, middle overs, death overs)

#### Machine Learning Model Requirements:
```python
# Model should consider these features:

HISTORICAL_FEATURES = {
    # Team-level features
    'team_form_last_5_matches': 'win_rate',
    'team_vs_opponent_h2h': 'historical_win_percentage',
    'team_at_venue': 'venue_specific_win_rate',
    'team_batting_first_success': 'chasing_defending_strength',
    'team_current_season_performance': 'points_table_position',
    
    # Player-level features (for all 22 players)
    'player_form_last_5': 'runs_scored_wickets_taken',
    'player_vs_opponent': 'historical_performance',
    'player_at_venue': 'venue_specific_stats',
    'player_vs_specific_bowlers_batsmen': 'matchup_data',
    'player_in_powerplay_middle_death': 'phase_wise_performance',
    'player_strike_rate_economy': 'efficiency_metrics',
    'player_impact_score': 'calculated_player_impact',
    
    # Match context features
    'venue_average_score': 'historical_venue_data',
    'venue_pitch_type': 'batting_bowling_friendly',
    'toss_impact_at_venue': 'bat_first_field_first_advantage',
    'day_night_factor': 'time_of_match',
    'season_phase': 'early_mid_late_season',
    'playoff_implications': 'pressure_factor',
    
    # Live match features (in-play)
    'current_score': 'runs_wickets_overs',
    'required_run_rate': 'target_chasing_pressure',
    'current_partnership': 'runs_balls_momentum',
    'batsmen_form_today': 'runs_scored_sr',
    'bowlers_form_today': 'wickets_economy',
    'recent_over_momentum': 'runs_in_last_6_overs',
    'wicket_clustering': 'fall_of_wickets_pattern',
}

# Target accuracy: 80-90% (realistic ML model accuracy)
# Update frequency: Every ball bowled (live mode)
# Fallback: Use ensemble models (Random Forest + XGBoost + Neural Network)
```

#### Prediction Display UI:
```javascript
// Win Probability Display Component
{
  teamA: {
    name: "Mumbai Indians",
    logo: "/logos/mi.png",
    winProbability: 67.8,  // Percentage
    confidenceInterval: "±5.2%",
    keyFactors: [
      "Strong batting lineup intact (Rohit, Kishan)",
      "Excellent record at Wankhede (78% win rate)",
      "Death overs specialists available (Bumrah)",
      "Chasing track - 65% teams win batting second here"
    ]
  },
  teamB: {
    name: "Chennai Super Kings",
    winProbability: 32.2,
    confidenceInterval: "±5.2%",
    keyFactors: [
      "Key bowler injured (Theekshana out)",
      "Poor recent form (1 win in last 5)",
      "Weak middle order exposed vs pace"
    ]
  },
  lastUpdated: "2 seconds ago",
  predictionConfidence: "High",
  matchPhase: "Middle Overs (12.3 overs)"
}
```

---

### 2. LIVE SCORE TRACKING SYSTEM

#### Real-Time Data Integration:
```javascript
// Use Cricket APIs (choose one or multiple):
const DATA_SOURCES = {
  primary: "Cricbuzz API" || "CricAPI" || "ESPNcricinfo API",
  fallback: "Web scraping with Puppeteer/Cheerio",
  updateInterval: "2-5 seconds (ball-by-ball)",
  websocket: true  // For instant updates
}

// Live Score Data Structure
const liveScoreData = {
  matchInfo: {
    matchId: "IPL2025_M45",
    title: "Mumbai Indians vs Chennai Super Kings",
    venue: "Wankhede Stadium, Mumbai",
    date: "2025-04-15",
    time: "19:30 IST",
    status: "Live - 2nd Innings",
    tossWinner: "CSK",
    tossDecision: "Field First"
  },
  
  currentInnings: {
    battingTeam: "Mumbai Indians",
    bowlingTeam: "Chennai Super Kings",
    score: {
      runs: 142,
      wickets: 4,
      overs: 15.3,
      runRate: 9.16,
      requiredRunRate: 8.84  // if chasing
    },
    target: 181,  // if chasing
    projection: "Final Score: 195-7 (AI prediction)"
  },
  
  liveCommentary: [
    {
      over: 15.3,
      bowler: "Ravindra Jadeja",
      batsman: "Rohit Sharma",
      description: "SIX! Rohit comes down the track and launches it over long-on!",
      runs: 6,
      timestamp: "2025-04-15T21:15:30Z"
    }
  ],
  
  currentBatsmen: [
    {
      name: "Rohit Sharma",
      runs: 48,
      balls: 32,
      fours: 5,
      sixes: 2,
      strikeRate: 150.0,
      onStrike: true
    },
    {
      name: "Suryakumar Yadav",
      runs: 23,
      balls: 15,
      fours: 2,
      sixes: 1,
      strikeRate: 153.33,
      onStrike: false
    }
  ],
  
  currentBowlers: [
    {
      name: "Ravindra Jadeja",
      overs: 3.3,
      maidens: 0,
      runs: 28,
      wickets: 1,
      economy: 8.0,
      currentSpell: true
    }
  ],
  
  recentOvers: [
    { over: 15, runs: 12, wickets: 0, runRate: 9.16 },
    { over: 14, runs: 8, wickets: 0, runRate: 9.0 },
    { over: 13, runs: 15, wickets: 1, runRate: 9.1 }
  ],
  
  fallOfWickets: [
    { batsman: "Ishan Kishan", runs: 15, overs: 3.2, score: "32/1" },
    { batsman: "Cameron Green", runs: 8, overs: 7.1, score: "68/2" }
  ],
  
  partnerships: [
    {
      batsmen: ["Rohit Sharma", "Suryakumar Yadav"],
      runs: 74,
      balls: 47,
      currentPartnership: true
    }
  ],
  
  manhattanChart: {
    overByOverRuns: [8, 12, 6, 15, 4, 9, 11, 8, 14, 7, 10, 13, 15, 8, 12],
    runRateGraph: [8.0, 10.0, 8.67, 10.25, 9.4, 9.33, 9.57, ...]
  },
  
  wormChart: {
    team1: [8, 20, 26, 41, 45, 54, 65, 73, 87, ...],
    team2: [6, 18, 24, 36, 40, 52, 64, 72, 86, ...]  // if 2nd innings
  }
}
```

#### Live Score UI Components:
```jsx
// Key UI Elements to Build:

1. Live Scoreboard (Sticky Header)
   - Team logos and names
   - Current score (Runs/Wickets in Overs)
   - Run rate, Required run rate
   - Target (if chasing)
   - Match status badge (Live, Completed, Upcoming)

2. Ball-by-Ball Commentary Feed
   - Scrollable live feed
   - Ball type indicators (dot, 1, 2, 3, 4, 6, W)
   - Commentary text with highlights
   - Video highlights integration (if API available)

3. Batsmen & Bowlers Cards
   - Current batsmen stats (runs, balls, SR, 4s, 6s)
   - On-strike indicator
   - Current bowler stats (overs, runs, wickets, economy)
   - Bowler vs batsman head-to-head popup

4. Partnership Tracker
   - Current partnership runs and balls
   - Partnership run rate
   - Required run rate comparison (if chasing)

5. Match Progress Visualizations
   - Manhattan chart (runs per over)
   - Worm chart (cumulative runs comparison)
   - Wagon wheel (batsman shot placement)
   - Pitch map (bowler line & length)
   - Win probability graph (over-by-over change)

6. Scorecard Tables
   - Complete batting scorecard
   - Complete bowling figures
   - Fall of wickets timeline
   - Extras breakdown

7. Match Stats Panel
   - Boundaries count (4s and 6s)
   - Dot ball percentage
   - Powerplay score comparison
   - Middle overs score comparison
   - Death overs score comparison
```

---

### 3. IPL POINTS TABLE (LIVE UPDATED)

#### Points Table Data Structure:
```javascript
const pointsTableData = {
  season: "IPL 2025",
  lastUpdated: "2025-04-15T22:30:00Z",
  teams: [
    {
      position: 1,
      team: "Rajasthan Royals",
      logo: "/logos/rr.png",
      matchesPlayed: 10,
      won: 8,
      lost: 2,
      tied: 0,
      noResult: 0,
      points: 16,
      netRunRate: +1.234,
      form: ["W", "W", "W", "L", "W"],  // Last 5 matches
      qualificationStatus: "Qualified",
      recentResults: [
        { vs: "MI", result: "Won by 5 wickets", date: "2025-04-12" }
      ]
    },
    // ... other teams
  ],
  
  playoffScenarios: {
    qualified: ["RR", "GT"],
    probableQualifiers: {
      "MI": { probability: 78, requiredWins: 2 },
      "CSK": { probability: 65, requiredWins: 3 }
    },
    eliminated: ["PBKS", "DC"]
  },
  
  rules: {
    points: "2 for win, 1 for tie/no result, 0 for loss",
    tieBreaker: "Net Run Rate (NRR)",
    playoffSpots: 4
  }
}
```

#### Points Table UI Features:
```jsx
// Interactive Points Table Components:

1. Main Table
   - Sortable columns (Position, Team, Points, NRR)
   - Team logo and name
   - Matches played, Won, Lost, Tied, NR
   - Points with highlight (top 4 in green/gold)
   - NRR with color coding (positive=green, negative=red)
   - Form indicator (last 5 matches)
   - Click to expand team details

2. Playoff Qualification Tracker
   - Visual progress bars for each team
   - Qualification probability percentage
   - "Magic number" calculator (wins needed)
   - Scenario simulator (what if team X wins next 2 matches?)

3. NRR Calculator & Explainer
   - Interactive NRR calculator
   - Show NRR calculation formula
   - How it affects playoff chances

4. Historical Points Table
   - Dropdown to select previous seasons (IPL 2008-2024)
   - Compare current season standings with past seasons
```

---

### 4. PLAYING XI & TEAM SQUADS

#### Squad Data Structure:
```javascript
const teamSquadData = {
  teamName: "Mumbai Indians",
  logo: "/logos/mi.png",
  captain: "Rohit Sharma",
  viceCaptain: "Suryakumar Yadav",
  coach: "Mark Boucher",
  
  fullSquad: [
    {
      playerId: "player_rohit_sharma",
      name: "Rohit Sharma",
      role: "Batsman (Captain)",
      battingStyle: "Right-hand bat",
      bowlingStyle: "Right-arm offbreak",
      photo: "/players/rohit.jpg",
      nationality: "India",
      price: "16.30 Cr",  // Auction price
      jerseyNumber: 45,
      
      stats: {
        matches: 243,
        runs: 6628,
        average: 30.32,
        strikeRate: 130.82,
        fifties: 42,
        hundreds: 2,
        highestScore: 109,
        wickets: 15,
        economy: 7.90
      },
      
      currentSeasonStats: {
        matches: 10,
        runs: 485,
        average: 48.50,
        strikeRate: 142.65,
        fifties: 4,
        hundreds: 1
      },
      
      formTrend: {
        last5Innings: [45, 68, 12, 89, 34],
        trendDirection: "up",  // up/down/stable
        formRating: 8.5  // out of 10
      }
    },
    // ... 24 more players
  ],
  
  playingXI: {
    matchId: "IPL2025_M45",
    confirmed: true,
    lineup: [
      {
        playerId: "player_rohit_sharma",
        name: "Rohit Sharma",
        role: "Batsman",
        battingPosition: 1
      },
      {
        playerId: "player_ishan_kishan",
        name: "Ishan Kishan",
        role: "Wicketkeeper-Batsman",
        battingPosition: 2
      },
      // ... 9 more players
    ],
    benchPlayers: [
      // Players not in playing XI
    ],
    impactPlayer: "player_tilak_varma",  // IPL Impact Player rule
    
    teamComposition: {
      batsmen: 5,
      allrounders: 3,
      bowlers: 4,
      foreignPlayers: 4,
      uncappedPlayers: 2
    }
  }
}
```

#### Playing XI UI Features:
```jsx
// Playing XI Display Components:

1. Team Lineup Visualizer
   - Cricket field graphic with player positions
   - Player cards with photos
   - Role badges (Batsman, Bowler, All-rounder, WK)
   - Click player card to see detailed stats

2. Player Comparison Tool
   - Compare 2 players side-by-side
   - Stats comparison graphs
   - Head-to-head performance
   - Form comparison (last 5 matches)

3. Playing XI Changes Tracker
   - Show changes from previous match
   - IN: Green highlight, OUT: Red highlight
   - Injury/rest indicators
   - Impact player selection explanation

4. Squad Builder (Interactive)
   - Let users create their own playing XI
   - Show team composition validation
   - Predict team's strength score

5. Player Profile Modal
   - Detailed career stats
   - Season-by-season breakdown
   - Performance vs each opponent
   - Performance at each venue
   - Photo gallery
   - Recent news/updates
```

---

### 5. COMPREHENSIVE STATISTICS & ANALYTICS (IPL Seasons 1-19)

#### Historical Database Structure:
```sql
-- Database schema for IPL data (use PostgreSQL or MongoDB)

-- Matches table
CREATE TABLE matches (
    match_id VARCHAR PRIMARY KEY,
    season INT,
    match_number INT,
    date DATE,
    venue VARCHAR,
    city VARCHAR,
    team1 VARCHAR,
    team2 VARCHAR,
    toss_winner VARCHAR,
    toss_decision VARCHAR,
    winner VARCHAR,
    result_type VARCHAR,
    result_margin INT,
    player_of_match VARCHAR,
    umpire1 VARCHAR,
    umpire2 VARCHAR
);

-- Ball-by-ball data
CREATE TABLE deliveries (
    match_id VARCHAR,
    innings INT,
    over INT,
    ball INT,
    batsman VARCHAR,
    non_striker VARCHAR,
    bowler VARCHAR,
    batsman_runs INT,
    extra_runs INT,
    total_runs INT,
    is_wicket BOOLEAN,
    dismissal_kind VARCHAR,
    player_dismissed VARCHAR,
    fielder VARCHAR
);

-- Players table
CREATE TABLE players (
    player_id VARCHAR PRIMARY KEY,
    name VARCHAR,
    nationality VARCHAR,
    batting_style VARCHAR,
    bowling_style VARCHAR,
    role VARCHAR,
    date_of_birth DATE
);

-- Player season stats
CREATE TABLE player_season_stats (
    player_id VARCHAR,
    season INT,
    team VARCHAR,
    matches INT,
    innings_batted INT,
    runs_scored INT,
    balls_faced INT,
    fours INT,
    sixes INT,
    highest_score INT,
    innings_bowled INT,
    overs_bowled DECIMAL,
    runs_conceded INT,
    wickets_taken INT,
    best_bowling VARCHAR,
    catches INT,
    stumpings INT
);

-- Venue statistics
CREATE TABLE venue_stats (
    venue VARCHAR,
    total_matches INT,
    avg_first_innings_score DECIMAL,
    avg_second_innings_score DECIMAL,
    batting_first_wins INT,
    chasing_wins INT,
    highest_score INT,
    lowest_score INT,
    avg_boundaries_per_match DECIMAL
);
```

#### Statistical Analysis Features:
```javascript
// Analytics to Implement:

1. TEAM STATISTICS
   - Overall win/loss record (all-time + season-wise)
   - Win percentage by venue
   - Win percentage batting first vs chasing
   - Head-to-head records vs all teams
   - Performance in different phases (powerplay, middle, death)
   - Highest/lowest team scores
   - Best run chases
   - Biggest wins (by runs/wickets)

2. PLAYER STATISTICS
   - Orange Cap tracker (most runs)
   - Purple Cap tracker (most wickets)
   - All-time leading run scorers
   - All-time leading wicket takers
   - Most sixes, fours, fifties, hundreds
   - Best strike rates, averages
   - Best economy rates, bowling averages
   - Most catches, stumpings
   - Most Player of Match awards
   - Most Valuable Player (MVP) ratings

3. RECORDS & MILESTONES
   - Fastest fifties, hundreds
   - Highest individual scores
   - Best bowling figures
   - Most runs in a season
   - Most wickets in a season
   - Longest winning streaks
   - Longest losing streaks
   - Hat-tricks list
   - Super overs records

4. VENUE ANALYTICS
   - Average scores at each venue
   - Bat first vs chase success rates
   - Pitch behavior (batting/bowling friendly)
   - Boundary percentage
   - Spin vs pace effectiveness

5. MATCH INSIGHTS
   - Impact of toss (win % after winning toss)
   - Powerplay performance correlation with wins
   - Death overs execution analysis
   - Middle order collapse patterns
   - Partnership analysis (avg partnerships by wicket)

6. ADVANCED METRICS
   - Player Impact Ratings (custom algorithm)
   - Clutch Performance Index
   - Pressure Handling Scores
   - Momentum Swing Analysis
   - Win Probability Added (WPA) per player
```

#### Statistics Dashboard UI:
```jsx
// Interactive Charts & Visualizations:

1. Team Performance Dashboard
   - Win/loss pie chart
   - Season-by-season performance line graph
   - Venue-wise performance heat map
   - Phase-wise scoring pattern (bar chart)
   - Head-to-head comparison matrix

2. Player Performance Dashboard
   - Run scoring trend (line graph)
   - Strike rate vs average scatter plot
   - Performance against each team (radar chart)
   - Career progression timeline
   - Form trend (last 10 innings)

3. Match Insights Visualizations
   - Manhattan chart (runs per over)
   - Worm chart (cumulative runs)
   - Wagon wheel (shot placement)
   - Pitch map (bowling)
   - Partnership graphs
   - Win probability tracker (live)

4. Season Comparisons
   - Compare stats across different IPL seasons
   - Year-over-year growth charts
   - Season highlights carousel

5. Filters & Controls
   - Season selector (2008-2025)
   - Team filter
   - Venue filter
   - Date range selector
   - Match type (League, Playoff, Final)
```

---

### 6. ADVANCED FEATURES

#### A. Match Center
```javascript
// Comprehensive match page features:

const matchCenter = {
  tabs: [
    "Live Score",
    "Commentary",
    "Scorecard",
    "Statistics",
    "Playing XI",
    "Highlights",
    "Prediction",
    "Head-to-Head",
    "Venue Info"
  ],
  
  features: {
    liveScore: "Real-time score updates",
    commentary: "Ball-by-ball commentary with filters",
    scorecard: "Detailed batting/bowling figures",
    statistics: "Match-specific stats and comparisons",
    playingXI: "Team lineups with player stats",
    highlights: "Video highlights (if API available)",
    prediction: "AI-powered win probability",
    headToHead: "Historical team matchups",
    venueInfo: "Ground details, pitch report, weather"
  }
}
```

#### B. Prediction Insights Page
```jsx
// Detailed prediction breakdown:

<PredictionInsights>
  <WinProbabilityGauge team1={67.8} team2={32.2} />
  
  <KeyFactorsAnalysis>
    <Factor impact="+12%">
      Mumbai Indians' excellent record at Wankhede (78% win rate)
    </Factor>
    <Factor impact="+8%">
      Rohit Sharma in form (avg 60 in last 5 matches)
    </Factor>
    <Factor impact="-5%">
      CSK's death bowling weakness (economy 11.2 in overs 16-20)
    </Factor>
  </KeyFactorsAnalysis>
  
  <ModelConfidence>
    <Metric>Prediction Confidence: 84%</Metric>
    <Metric>Historical Accuracy: 78.5%</Metric>
    <Metric>Data Points Analyzed: 47,832</Metric>
  </ModelConfidence>
  
  <PredictionTimeline>
    {/* Graph showing how prediction changed over time */}
    <TimelineGraph data={predictionOverTime} />
  </PredictionTimeline>
  
  <WhatIfSimulator>
    {/* Interactive tool to see how prediction changes */}
    <Scenario>If Bumrah takes 2 wickets in next 3 overs...</Scenario>
    <ResultChange>MI win probability: 67.8% → 78.3%</ResultChange>
  </WhatIfSimulator>
</PredictionInsights>
```

#### C. Schedule & Results
```javascript
const scheduleData = {
  upcomingMatches: [
    {
      matchId: "IPL2025_M46",
      date: "2025-04-16",
      time: "19:30 IST",
      team1: "RCB",
      team2: "KKR",
      venue: "M. Chinnaswamy Stadium, Bangalore",
      status: "Upcoming",
      prediction: {
        team1WinProb: 55,
        team2WinProb: 45
      }
    }
  ],
  
  recentResults: [
    {
      matchId: "IPL2025_M44",
      date: "2025-04-14",
      team1: "GT",
      team2: "SRH",
      winner: "GT",
      result: "Won by 7 wickets",
      scorecard: {
        team1: "178/3 (18.2 overs)",
        team2: "175/8 (20 overs)"
      }
    }
  ],
  
  filterOptions: {
    team: "All Teams",
    venue: "All Venues",
    matchType: "All Matches"  // League, Qualifier, Eliminator, Final
  }
}
```

#### D. News & Updates Section
```jsx
// Latest IPL news integration:

<NewsSection>
  <NewsCard>
    <Headline>Rohit Sharma ruled out for 2 weeks</Headline>
    <Source>ESPNcricinfo</Source>
    <Time>2 hours ago</Time>
  </NewsCard>
  
  <TrendingTopics>
    #IPL2025 #OrangeCap #PurpleCap #PlayoffRace
  </TrendingTopics>
  
  <InjuryUpdates>
    {/* Live injury tracker */}
  </InjuryUpdates>
</NewsSection>
```

---

### 7. UI/UX DESIGN SPECIFICATIONS

#### Design System
```css
/* Color Palette */
:root {
  /* Primary IPL Brand Colors */
  --primary-blue: #1E3A8A;
  --primary-gold: #F59E0B;
  --accent-purple: #7C3AED;
  
  /* Team Colors (for dynamic theming) */
  --mi-blue: #004BA0;
  --csk-yellow: #FDB913;
  --rcb-red: #EC1C24;
  --kkr-purple: #3A225D;
  --dc-blue: #282968;
  --pbks-red: #DD1F2D;
  --rr-pink: #E4257A;
  --srh-orange: #F26522;
  --gt-navy: #1C2841;
  --lsg-teal: #00A7CC;
  
  /* Semantic Colors */
  --success-green: #10B981;
  --danger-red: #EF4444;
  --warning-amber: #F59E0B;
  --info-blue: #3B82F6;
  
  /* Neutral Colors */
  --bg-dark: #0F172A;
  --bg-card: #1E293B;
  --bg-card-hover: #334155;
  --text-primary: #F8FAFC;
  --text-secondary: #94A3B8;
  --border-color: #334155;
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #1E3A8A 0%, #7C3AED 100%);
  --gradient-gold: linear-gradient(135deg, #F59E0B 0%, #EF4444 100%);
}

/* Typography */
--font-heading: 'Inter', 'Poppins', sans-serif;
--font-body: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Font Sizes */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
--text-4xl: 2.25rem;

/* Spacing */
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-6: 1.5rem;
--space-8: 2rem;

/* Border Radius */
--radius-sm: 0.375rem;
--radius-md: 0.5rem;
--radius-lg: 0.75rem;
--radius-xl: 1rem;

/* Shadows */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-glow: 0 0 20px rgba(124, 58, 237, 0.4);
```

#### Layout Structure
```jsx
// Main Layout Components:

<AppLayout>
  <Header>
    <Logo />
    <Navigation>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/live">Live Matches</NavLink>
      <NavLink to="/predictions">Predictions</NavLink>
      <NavLink to="/points-table">Points Table</NavLink>
      <NavLink to="/teams">Teams</NavLink>
      <NavLink to="/players">Players</NavLink>
      <NavLink to="/stats">Statistics</NavLink>
      <NavLink to="/schedule">Schedule</NavLink>
      <NavLink to="/news">News</NavLink>
    </Navigation>
    <UserActions>
      <ThemeToggle />  {/* Dark/Light mode */}
      <LanguageSelector />  {/* English/Hindi */}
      <NotificationBell />
    </UserActions>
  </Header>
  
  <MainContent>
    <Sidebar>  {/* Sticky sidebar */}
      <LiveMatchesWidget />
      <UpcomingMatchesWidget />
      <TrendingStatsWidget />
    </Sidebar>
    
    <PageContent>
      {/* Route-specific content */}
    </PageContent>
  </MainContent>
  
  <Footer>
    <SocialLinks />
    <Copyright />
    <Links />
  </Footer>
</AppLayout>
```

#### Key UI Patterns
```jsx
// Reusable Component Patterns:

1. Match Card Component
<MatchCard>
  <MatchHeader>
    <TeamLogo team={team1} />
    <VS badge />
    <TeamLogo team={team2} />
  </MatchHeader>
  
  <ScoreLine>
    <Score>{team1Score}</Score>
    <Score>{team2Score}</Score>
  </ScoreLine>
  
  <MatchInfo>
    <Venue>{venue}</Venue>
    <DateTime>{date} {time}</DateTime>
  </MatchInfo>
  
  <WinProbability>
    <ProgressBar team1={65} team2={35} />
  </WinProbability>
  
  <Actions>
    <Button>View Details</Button>
    <Button>Watch Live</Button>
  </Actions>
</MatchCard>

2. Player Card Component
<PlayerCard>
  <PlayerImage src={player.photo} />
  <PlayerName>{player.name}</PlayerName>
  <PlayerRole badge>{player.role}</PlayerRole>
  <PlayerStats>
    <Stat label="Runs" value={player.runs} />
    <Stat label="SR" value={player.strikeRate} />
  </PlayerStats>
  <FormIndicator trend={player.form} />
</PlayerCard>

3. Live Score Ticker (Scrolling)
<LiveScoreTicker>
  {liveMatches.map(match => (
    <TickerItem key={match.id}>
      {match.team1} {match.score1} vs {match.team2} {match.score2}
    </TickerItem>
  ))}
</LiveScoreTicker>

4. Win Probability Gauge
<WinProbabilityGauge>
  <CircularProgress percentage={67.8} color="blue" />
  <TeamName>Mumbai Indians</TeamName>
  <Percentage>67.8%</Percentage>
  <vs>VS</vs>
  <CircularProgress percentage={32.2} color="yellow" />
  <TeamName>Chennai Super Kings</TeamName>
  <Percentage>32.2%</Percentage>
</WinProbabilityGauge>
```

#### Responsive Design
```css
/* Breakpoints */
--breakpoint-sm: 640px;   /* Mobile */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large Desktop */

/* Mobile-first approach */
@media (max-width: 768px) {
  /* Stack components vertically */
  /* Enlarge touch targets (min 44px) */
  /* Hide sidebar, show hamburger menu */
  /* Simplify charts/graphs */
}

/* Tablet optimizations */
@media (min-width: 768px) and (max-width: 1024px) {
  /* 2-column grid layouts */
  /* Collapsible sidebar */
}

/* Desktop optimizations */
@media (min-width: 1024px) {
  /* 3-column layouts */
  /* Always visible sidebar */
  /* Hover states and tooltips */
}
```

#### Animation & Interactions
```jsx
// Micro-interactions:

1. Live Score Updates
   - Pulse animation on score change
   - Confetti on wicket/boundary
   - Smooth number transitions (CountUp animation)

2. Win Probability
   - Animated gauge movement
   - Color shift based on probability changes
   - Particle effects on major swings

3. Page Transitions
   - Fade-in animations
   - Skeleton loaders during data fetch
   - Smooth scroll behavior

4. Hover Effects
   - Card lift on hover
   - Border glow on interactive elements
   - Tooltip appearances

5. Loading States
   - Shimmer effect on loading cards
   - Progress bars for data fetching
   - Pulse animations
```

---

### 8. TECHNICAL STACK & ARCHITECTURE

#### Frontend Technology
```javascript
// Recommended Tech Stack:

const techStack = {
  framework: "Next.js 14 (App Router)",  // React + SSR
  language: "TypeScript",
  styling: {
    primary: "Tailwind CSS",
    components: "shadcn/ui",
    icons: "Lucide Icons / React Icons",
    animations: "Framer Motion"
  },
  
  stateManagement: {
    global: "Zustand" || "Redux Toolkit",
    server: "TanStack Query (React Query)",
    forms: "React Hook Form + Zod"
  },
  
  charts: {
    library: "Recharts" || "Apache ECharts" || "Chart.js",
    advanced: "D3.js (for custom visualizations)"
  },
  
  realtime: {
    websockets: "Socket.io Client",
    sse: "EventSource API (Server-Sent Events)"
  },
  
  dataFetching: {
    rest: "Axios",
    cache: "TanStack Query",
    revalidation: "Next.js ISR (Incremental Static Regeneration)"
  }
}
```

#### Backend Technology
```javascript
const backendStack = {
  runtime: "Node.js 20+",
  framework: "Express.js" || "Fastify",
  language: "TypeScript",
  
  database: {
    primary: "PostgreSQL" || "MongoDB",
    caching: "Redis",
    search: "Elasticsearch (optional)"
  },
  
  orm: "Prisma" || "TypeORM",
  
  apis: {
    cricket: "Cricbuzz API / CricAPI / ESPNcricinfo",
    scraping: "Puppeteer / Cheerio (fallback)"
  },
  
  machineLearning: {
    platform: "Python FastAPI microservice",
    libraries: "scikit-learn, XGBoost, TensorFlow/PyTorch",
    deployment: "Docker container"
  },
  
  jobs: {
    scheduler: "node-cron",
    queue: "Bull (Redis-based)"
  },
  
  realtime: {
    websockets: "Socket.io",
    pubsub: "Redis Pub/Sub"
  }
}
```

#### ML Model Architecture
```python
# Prediction Model Implementation:

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

class IPLMatchPredictor:
    def __init__(self):
        self.models = {
            'random_forest': RandomForestClassifier(n_estimators=200),
            'xgboost': XGBClassifier(n_estimators=200),
            'gradient_boosting': GradientBoostingClassifier(n_estimators=200)
        }
        self.scaler = StandardScaler()
        
    def prepare_features(self, match_data):
        """
        Extract and engineer features from match data
        """
        features = []
        
        # Team features
        features.extend([
            match_data['team1_win_rate_last_5'],
            match_data['team2_win_rate_last_5'],
            match_data['team1_vs_team2_win_rate'],
            match_data['team1_at_venue_win_rate'],
            match_data['team2_at_venue_win_rate'],
        ])
        
        # Player features (aggregate)
        features.extend([
            match_data['team1_avg_batting_sr'],
            match_data['team2_avg_batting_sr'],
            match_data['team1_avg_bowling_economy'],
            match_data['team2_avg_bowling_economy'],
        ])
        
        # Venue features
        features.extend([
            match_data['venue_avg_first_innings_score'],
            match_data['venue_batting_first_win_rate'],
        ])
        
        # Toss features
        features.extend([
            match_data['toss_winner'] == match_data['team1'],
            match_data['toss_decision'] == 'bat',
        ])
        
        # Live match features (if in-play)
        if match_data.get('is_live'):
            features.extend([
                match_data['current_score'],
                match_data['current_wickets'],
                match_data['current_over'],
                match_data['required_run_rate'],
                match_data['current_run_rate'],
            ])
        
        return np.array(features).reshape(1, -1)
    
    def train(self, historical_data):
        """
        Train ensemble of models on historical IPL data
        """
        X = historical_data.drop('winner', axis=1)
        y = historical_data['winner']
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        for name, model in self.models.items():
            model.fit(X_train_scaled, y_train)
            accuracy = model.score(X_test_scaled, y_test)
            print(f"{name} accuracy: {accuracy:.2%}")
    
    def predict(self, match_data):
        """
        Predict match outcome using ensemble voting
        """
        features = self.prepare_features(match_data)
        features_scaled = self.scaler.transform(features)
        
        predictions = []
        probabilities = []
        
        for model in self.models.values():
            pred = model.predict(features_scaled)[0]
            prob = model.predict_proba(features_scaled)[0]
            predictions.append(pred)
            probabilities.append(prob)
        
        # Ensemble voting
        avg_prob = np.mean(probabilities, axis=0)
        
        return {
            'team1_win_probability': float(avg_prob[0]) * 100,
            'team2_win_probability': float(avg_prob[1]) * 100,
            'confidence': float(np.std(probabilities)),
            'model_agreement': len(set(predictions)) == 1
        }

# Usage:
predictor = IPLMatchPredictor()
predictor.train(historical_ipl_data)

# Pre-match prediction
prediction = predictor.predict({
    'team1': 'MI',
    'team2': 'CSK',
    'venue': 'Wankhede Stadium',
    'toss_winner': 'MI',
    'toss_decision': 'bat',
    # ... other features
})

# Live match prediction (updates every over)
live_prediction = predictor.predict({
    'team1': 'MI',
    'team2': 'CSK',
    'is_live': True,
    'current_score': 142,
    'current_wickets': 4,
    'current_over': 15.3,
    'required_run_rate': 8.84,
    # ... other features
})
```

#### API Architecture
```javascript
// Backend API Endpoints:

const apiRoutes = {
  // Live matches
  'GET /api/matches/live': 'Get all live matches',
  'GET /api/matches/live/:matchId': 'Get specific live match data',
  'WS /api/matches/live/:matchId/stream': 'WebSocket for real-time updates',
  
  // Predictions
  'GET /api/predictions/:matchId': 'Get match prediction',
  'GET /api/predictions/:matchId/timeline': 'Get prediction over time',
  'POST /api/predictions/simulate': 'What-if scenario simulation',
  
  // Points table
  'GET /api/points-table/:season': 'Get points table',
  'GET /api/points-table/:season/playoff-scenarios': 'Playoff scenarios',
  
  // Teams
  'GET /api/teams': 'Get all teams',
  'GET /api/teams/:teamId': 'Get team details',
  'GET /api/teams/:teamId/squad': 'Get team squad',
  'GET /api/teams/:teamId/stats': 'Get team statistics',
  
  // Players
  'GET /api/players': 'Get all players',
  'GET /api/players/:playerId': 'Get player details',
  'GET /api/players/:playerId/stats': 'Get player statistics',
  'GET /api/players/:playerId/form': 'Get player recent form',
  
  // Statistics
  'GET /api/stats/leaders': 'Get statistical leaders',
  'GET /api/stats/records': 'Get IPL records',
  'GET /api/stats/h2h/:team1/:team2': 'Head-to-head stats',
  
  // Schedule
  'GET /api/schedule/:season': 'Get match schedule',
  'GET /api/schedule/upcoming': 'Get upcoming matches',
  'GET /api/schedule/results': 'Get recent results',
  
  // Venues
  'GET /api/venues': 'Get all venues',
  'GET /api/venues/:venueId/stats': 'Get venue statistics',
}
```

#### Data Flow Architecture
```
┌─────────────────┐
│  Cricket APIs   │  (Cricbuzz, CricAPI)
└────────┬────────┘
         │ (Poll every 5 seconds)
         ▼
┌─────────────────┐
│  Data Ingestion │
│   Service       │  (Node.js + cron jobs)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  PostgreSQL DB  │  (Historical data)
│  + Redis Cache  │  (Live data)
└────────┬────────┘
         │
         ├──────────────────┬────────────────┐
         ▼                  ▼                ▼
┌─────────────┐   ┌──────────────┐   ┌─────────────┐
│  ML Service │   │  API Server  │   │  WebSocket  │
│  (Python)   │   │  (Express)   │   │   Server    │
└──────┬──────┘   └──────┬───────┘   └──────┬──────┘
       │                 │                  │
       └─────────────────┴──────────────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │  Next.js    │
                  │  Frontend   │
                  └─────────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │    User     │
                  └─────────────┘
```

---

### 9. DATA SOURCES & INTEGRATION

#### Cricket Data APIs
```javascript
// Primary Data Sources:

1. CRICBUZZ API (Recommended)
   - Base URL: https://cricbuzz-cricket.p.rapidapi.com/
   - Features: Live scores, schedules, stats, player info
   - Update frequency: 2-5 seconds
   - Cost: Free tier available (500 requests/day)

2. CRICAPI
   - Base URL: https://api.cricapi.com/v1/
   - Features: Live scores, match details, player stats
   - Update frequency: Real-time
   - Cost: Free tier (100 requests/day)

3. ESPN CRICINFO API (Unofficial)
   - Scraping required
   - Most comprehensive data
   - Ball-by-ball commentary

4. FALLBACK: Web Scraping
   - Use Puppeteer/Cheerio
   - Scrape from Cricbuzz/Cricinfo websites
   - Implement rate limiting
```

#### API Integration Example
```javascript
// Live match data fetching:

import axios from 'axios';

class CricketDataService {
  constructor() {
    this.apiKey = process.env.CRICBUZZ_API_KEY;
    this.baseURL = 'https://cricbuzz-cricket.p.rapidapi.com';
  }
  
  async getLiveMatches() {
    try {
      const response = await axios.get(`${this.baseURL}/matches/v1/live`, {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching live matches:', error);
      throw error;
    }
  }
  
  async getMatchDetails(matchId) {
    const response = await axios.get(
      `${this.baseURL}/mcenter/v1/${matchId}`,
      { headers: this.headers }
    );
    return response.data;
  }
  
  async getCommentary(matchId) {
    const response = await axios.get(
      `${this.baseURL}/mcenter/v1/${matchId}/comm`,
      { headers: this.headers }
    );
    return response.data;
  }
}

// WebSocket setup for real-time updates
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.on('score-update', (data) => {
  // Update UI with new score
  updateLiveScore(data);
  
  // Trigger prediction recalculation
  updatePrediction(data);
});
```

---

### 10. PERFORMANCE OPTIMIZATION

#### Optimization Strategies
```javascript
1. CODE SPLITTING
   - Lazy load routes using Next.js dynamic imports
   - Chunk heavy libraries (charts, ML models)
   
2. CACHING STRATEGY
   - Redis for live match data (TTL: 5 seconds)
   - Next.js ISR for static pages (revalidate: 60)
   - Browser caching for images/assets
   
3. IMAGE OPTIMIZATION
   - Use Next.js Image component
   - WebP format with fallbacks
   - Lazy loading for below-fold images
   
4. DATABASE OPTIMIZATION
   - Index frequently queried columns
   - Use materialized views for complex stats
   - Connection pooling
   
5. API OPTIMIZATION
   - Rate limiting to prevent abuse
   - Response compression (gzip)
   - Pagination for large datasets
   
6. FRONTEND OPTIMIZATION
   - Virtual scrolling for long lists
   - Debounce search inputs
   - Memoize expensive calculations
   - Use React.memo for static components
```

---

### 11. DEPLOYMENT & HOSTING

#### Deployment Stack
```javascript
const deployment = {
  frontend: {
    platform: "Vercel" || "Netlify",
    cdn: "Cloudflare",
    ssl: "Automatic (Let's Encrypt)"
  },
  
  backend: {
    platform: "Railway" || "AWS EC2" || "DigitalOcean",
    container: "Docker",
    orchestration: "Docker Compose"
  },
  
  database: {
    postgres: "Supabase" || "AWS RDS" || "Neon",
    redis: "Upstash" || "AWS ElastiCache"
  },
  
  mlService: {
    platform: "AWS Lambda" || "Google Cloud Run",
    container: "Docker (Python)"
  },
  
  monitoring: {
    errors: "Sentry",
    analytics: "Google Analytics + Plausible",
    logging: "Winston + CloudWatch"
  }
}
```

---

### 12. TESTING & QUALITY ASSURANCE

#### Testing Strategy
```javascript
const testing = {
  unit: "Jest + React Testing Library",
  integration: "Cypress / Playwright",
  e2e: "Cypress",
  
  coverage: {
    target: "80%+",
    critical: "Prediction logic, Live score updates"
  },
  
  performance: {
    tool: "Lighthouse",
    targets: {
      performance: 90,
      accessibility: 95,
      bestPractices: 90,
      seo: 95
    }
  }
}
```

---

### 13. ACCESSIBILITY & SEO

#### Accessibility Requirements
```javascript
const a11y = {
  wcag: "WCAG 2.1 Level AA",
  features: [
    "Keyboard navigation",
    "Screen reader support (ARIA labels)",
    "Color contrast ratios (4.5:1)",
    "Focus indicators",
    "Alt text for images",
    "Captions for videos"
  ]
}
```

#### SEO Optimization
```javascript
const seo = {
  meta: {
    title: "IPL 2025 Live Score, Predictions & Statistics",
    description: "Real-time IPL match predictions, live scores, points table, and comprehensive statistics for all teams and players.",
    keywords: "IPL, cricket, live score, predictions, statistics"
  },
  
  structuredData: {
    type: "SportsEvent",
    schema: "schema.org/SportsEvent"
  },
  
  sitemap: "Auto-generated with Next.js",
  robots: "Allow all",
  
  openGraph: {
    images: "Team logos, match cards",
    type: "website"
  }
}
```

---

### 14. MOBILE APP (BONUS)

#### Progressive Web App (PWA)
```javascript
const pwa = {
  features: [
    "Installable on mobile devices",
    "Offline support (cached data)",
    "Push notifications for:
      - Match start reminders
      - Live score updates
      - Wicket alerts
      - Boundary alerts",
    "Background sync"
  ],
  
  manifest: {
    name: "IPL Predictor",
    shortName: "IPL",
    icons: [
      { src: "/icon-192.png", sizes: "192x192" },
      { src: "/icon-512.png", sizes: "512x512" }
    ],
    theme_color: "#1E3A8A",
    background_color: "#0F172A"
  }
}
```

---

## PROJECT STRUCTURE

```
ipl-predictor/
├── frontend/
│   ├── app/
│   │   ├── (routes)/
│   │   │   ├── page.tsx                 # Home page
│   │   │   ├── live/page.tsx            # Live matches
│   │   │   ├── predictions/page.tsx     # Predictions
│   │   │   ├── points-table/page.tsx    # Points table
│   │   │   ├── teams/[id]/page.tsx      # Team details
│   │   │   ├── players/[id]/page.tsx    # Player profile
│   │   │   ├── stats/page.tsx           # Statistics
│   │   │   └── schedule/page.tsx        # Schedule
│   │   ├── components/
│   │   │   ├── LiveScore/
│   │   │   ├── Prediction/
│   │   │   ├── PointsTable/
│   │   │   ├── Charts/
│   │   │   └── shared/
│   │   ├── lib/
│   │   ├── styles/
│   │   └── types/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   │   ├── cricket-api.service.ts
│   │   │   ├── prediction.service.ts
│   │   │   └── stats.service.ts
│   │   ├── models/
│   │   ├── routes/
│   │   ├── websocket/
│   │   └── utils/
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
│
├── ml-service/
│   ├── models/
│   │   └── predictor.py
│   ├── api/
│   │   └── main.py
│   ├── data/
│   │   └── ipl_historical_data.csv
│   └── requirements.txt
│
└── docker-compose.yml
```

---

## IMPLEMENTATION PHASES

### Phase 1: MVP (Weeks 1-3)
- [ ] Setup Next.js + TypeScript project
- [ ] Basic UI/UX design system
- [ ] Integrate Cricket API for live scores
- [ ] Build live score display components
- [ ] Create points table page
- [ ] Basic team and player pages
- [ ] Deploy MVP

### Phase 2: Prediction Engine (Weeks 4-6)
- [ ] Collect and process IPL historical data
- [ ] Build ML prediction model
- [ ] Create Python FastAPI service
- [ ] Integrate prediction API with frontend
- [ ] Build prediction UI components
- [ ] Test prediction accuracy

### Phase 3: Advanced Features (Weeks 7-9)
- [ ] Real-time WebSocket implementation
- [ ] Advanced statistics and analytics
- [ ] Interactive charts and visualizations
- [ ] Playing XI management
- [ ] Match center with all tabs
- [ ] Schedule and results pages

### Phase 4: Polish & Launch (Weeks 10-12)
- [ ] Performance optimization
- [ ] Mobile responsiveness
- [ ] PWA implementation
- [ ] SEO optimization
- [ ] Testing and bug fixes
- [ ] Production deployment
- [ ] Monitoring and analytics

---

## SUCCESS METRICS

```javascript
const kpis = {
  technical: {
    predictionAccuracy: "75-85%",
    pageLoadTime: "<2 seconds",
    apiResponseTime: "<500ms",
    uptime: "99.9%"
  },
  
  user: {
    dailyActiveUsers: "Target 10,000+",
    averageSessionDuration: "5+ minutes",
    bounceRate: "<40%",
    returnUserRate: ">50%"
  }
}
```

---

## IMPORTANT NOTES FOR THE AI ASSISTANT

1. **USE TYPESCRIPT THROUGHOUT** - Type safety is critical
2. **FOLLOW NEXT.JS 14 APP ROUTER PATTERNS** - Use server/client components appropriately
3. **IMPLEMENT PROPER ERROR HANDLING** - Never show raw errors to users
4. **OPTIMIZE FOR MOBILE FIRST** - 70% of users will be on mobile
5. **CACHE AGGRESSIVELY** - Reduce API calls, use Redis
6. **WRITE CLEAN, COMMENTED CODE** - Future developers will thank you
7. **USE ENVIRONMENT VARIABLES** - Never hardcode API keys
8. **IMPLEMENT LOADING STATES** - Every async operation needs a loader
9. **ADD PROPER LOGGING** - Use Winston or similar
10. **FOLLOW ACCESSIBILITY GUIDELINES** - Screen readers, keyboard nav, etc.

---

## FINAL CHECKLIST BEFORE LAUNCH

- [ ] All API keys secured in environment variables
- [ ] Database indexes optimized
- [ ] Redis caching implemented
- [ ] Error tracking (Sentry) configured
- [ ] Analytics (GA4) integrated
- [ ] SEO meta tags on all pages
- [ ] Mobile responsive on all screen sizes
- [ ] Accessibility audit passed
- [ ] Performance audit (Lighthouse) score >90
- [ ] Security headers configured
- [ ] SSL certificate installed
- [ ] Backup strategy in place
- [ ] Monitoring dashboards setup
- [ ] Rate limiting implemented
- [ ] GDPR/privacy policy pages
- [ ] Terms of service page

---

## AI ASSISTANT: START HERE 👇

```bash
# Step 1: Initialize Next.js project
npx create-next-app@latest ipl-predictor --typescript --tailwind --app

# Step 2: Install core dependencies
npm install axios socket.io-client zustand @tanstack/react-query recharts framer-motion lucide-react

# Step 3: Install UI components
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card table input select

# Step 4: Setup backend
cd backend
npm init -y
npm install express socket.io prisma @prisma/client redis ioredis

# Step 5: Setup ML service
cd ml-service
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn scikit-learn xgboost pandas numpy

# Step 6: Start building!
```

**BEGIN WITH:** Live score display → Then prediction engine → Then stats
**FOCUS ON:** Real-time updates, beautiful UI, accurate predictions
**TEST FREQUENTLY:** Every feature should work on mobile and desktop

Good luck! Build something amazing! 🏏🚀
