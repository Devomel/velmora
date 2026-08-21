// Keyword → emoji map for product USP bullets. Patterns combine the German,
// Romanian, Russian and Norwegian wording used across locales/*/home.json so
// the same lookup works for every market. Order matters: more specific
// patterns are checked first.
const RULES: [RegExp, string][] = [
  [/(induktion|inducţi|inducti|induksj)/i, '⚡'],
  [/(antihaft|antiaderent|антипригар|antihefte)/i, '🍳'],
  [/(dampf|abur|пар|damp)/i, '💨'],
  [/(deckel|capac|крышк|lokk|glas|sticl[ăa]|стекл|glass)/i, '👀'],
  [/(spülmaschine|mașina de spălat|посудомо|oppvaskmaskin)/i, '🧼'],
  [/(griff|mâner|ручк|håndtak)/i, '🖐️'],
  [/(klinge|messer|schärf|scharf|lam[ăa]|cuțit|лезви|\bнож|kniv|blad)/i, '🔪'],
  [/(maßskala|scal[aă]|gradaț|шкал|skala)/i, '📏'],
  [/(balance|echilibr|баланс)/i, '⚖️'],
  [/(design|stilvoll|\bstil\b|дизайн|стиль|stilig)/i, '✨'],
  [/(verzerrungsresistent|deformationsresist|rezisten|durabil|прочн|долговеч|solid|holdbar|vollmetall)/i, '💪'],
  [/(\bholz\b|\blemn\b|дерев|\btre\b)/i, '🪵'],
  [/(ungiftig|netoxic|нетоксич|безопас|ugiftig|trygg|\bsicher\b|\bsigur\b)/i, '🌿'],
  [/(reinig|curăț|чист|rengjør)/i, '🧽'],
  [/(edelstahl|oțel|сталь|stål|aluminium|aluminiu|алюмини)/i, '⭐'],
  [/(wärme|erwärmung|kapselboden|heiz|cald|încălzire|termic|нагрев|тепло|varme)/i, '🔥'],
  [/(behälter|recipient|контейнер|beholder|keramik|ceramic|керамик)/i, '🫙'],
];

export function featureIcon(text: string): string {
  for (const [pattern, emoji] of RULES) {
    if (pattern.test(text)) return emoji;
  }
  return '✅';
}
