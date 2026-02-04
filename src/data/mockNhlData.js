// Mock NHL data that can be swapped for a real API later.
// Dates are ISO strings so time-based cutoffs are easy to enforce.

const now = new Date();
const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 30, 0));
const tomorrow = new Date(today);

tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

today.setUTCHours(23, 30, 0, 0);
tomorrow.setUTCHours(23, 30, 0, 0);

const addHours = (date, hours) => new Date(date.getTime() + hours * 60 * 60 * 1000);

export const teams = [
  "Boston Bruins",
  "New York Rangers",
  "Toronto Maple Leafs",
  "Montreal Canadiens",
  "Edmonton Oilers",
  "Vancouver Canucks",
  "Colorado Avalanche",
  "Chicago Blackhawks"
];

export const players = [
  "Connor McDavid",
  "Auston Matthews",
  "Nathan MacKinnon",
  "Connor Bedard",
  "Artemi Panarin",
  "Elias Pettersson"
];

export const games = [
  {
    id: "NYR@BOS",
    home: "Boston Bruins",
    away: "New York Rangers",
    startTime: addHours(today, -3).toISOString(),
    status: "final",
    result: {
      winner: "Boston Bruins",
      score: "4-2",
      scorer: "Brad Marchand"
    }
  },
  {
    id: "MTL@TOR",
    home: "Toronto Maple Leafs",
    away: "Montreal Canadiens",
    startTime: addHours(today, 2).toISOString(),
    status: "scheduled",
    result: null
  },
  {
    id: "EDM@VAN",
    home: "Vancouver Canucks",
    away: "Edmonton Oilers",
    startTime: addHours(tomorrow, -2).toISOString(),
    status: "scheduled",
    result: null
  },
  {
    id: "COL@CHI",
    home: "Chicago Blackhawks",
    away: "Colorado Avalanche",
    startTime: addHours(tomorrow, 2).toISOString(),
    status: "scheduled",
    result: null
  }
];

export const getGamesByDate = (date) => {
  const target = new Date(date);
  return games.filter((game) => {
    const gameDate = new Date(game.startTime);
    return (
      gameDate.getUTCFullYear() === target.getUTCFullYear() &&
      gameDate.getUTCMonth() === target.getUTCMonth() &&
      gameDate.getUTCDate() === target.getUTCDate()
    );
  });
};
