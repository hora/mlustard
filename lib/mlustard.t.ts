interface MlustardInput {
  content: any;
}

interface Meta {
  kind?: string;
}

interface OutMeta extends Meta {
  sacrifice?: boolean;
  sacrificeMeta?: Meta;
  freeRefill?: boolean;
}

interface stealMeta {
  success?: boolean;
  baseStolen?: number;
}

interface HitMeta extends Meta {
  bigBucket?: boolean;
}

interface WalkMeta {
  mindTrick?: boolean;
}

interface BaseRunner {
  playerName?: string;
  playerId?: string;
}

interface BaseRunners {
  first?: BaseRunner;
  second?: BaseRunner;
  third?: BaseRunner;
  fourth?: BaseRunner;
}

interface MlustardAnalysis {
  _chroniclerVersion: string;
  id: string;
  era: string;
  gameStatus: string;
  score: boolean;
  runsScored: number;
  unrunsScored: number;
  batterUp: boolean;
  out: boolean;
  outMeta: outMeta;
  hit: boolean;
  hitMeta: hitMeta;
  steal: boolean;
  stealMeta: stealMeta;
  walk: boolean;
  walkMeta: walkMeta;
  special: boolean;
  specialMeta: Meta;
  baseRunners: BaseRunners;
  maximumBlaseball: boolean;
}

export function analyzeGameEvent(Box): MlustardAnalysis;

