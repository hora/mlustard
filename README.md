# mlustard

_"Get out the rye bread and **mlustard**, Grandma, it is grand slalami time!"_

[Notdave Niehaus](https://en.wikipedia.org/wiki/Dave_Niehaus#Notable_catchphrases)

**mlustard** takes ~~some rye bread~~
[Blaseball](https://www.blaseball.com/) game event data, and
analyzes it for 'interestingness'.
For instance, it can tell you whether regular old \[redacted\] stuff happened,
like hits, outs, or stolen bases.
But it can also tell you whether there's some tastier stuff on the play, like
blooddrain, allergic reactions, or consumer attacks.
(See [the metadata collected by mlustard](#the-metadata-collected-by-mlustard)
(below) for all currently-implemented event checks).

## Usage

```
npm install mlustard
```

```js
const mlustard = require('mlustard');

// see note below on game events
const gameEvent = {
  // ...
};

const analysis = mlustard.analyzeGameEvent(gameEvent);
```

- `gameEvent` must be a valid game event object from [the official Blaseball API
event
  stream](https://github.com/Society-for-Internet-Blaseball-Research/blaseball-api-spec/blob/master/streamData.md) (the goods are in `data.value.games.schedule`),
  or from
  [Chronicler](https://astrid.stoplight.io/docs/sibr/reference/Chronicler.v1.yaml).

- `analysis` will be an object like in the following example (which registers a
  sacrifice flyout, with a run scored on the play):

```js
{
  id: <the game event id>,

  gameStatus: null,
  runsScored: 1,

  batterUp: false,

  out: true,
  outMeta: {
    kind: 'fly',
    sacrifice: true,
    sacrificeMeta: {
      kind: 'score',
    },
  },

  hit: false,
  hitMeta: {
    kind: null,
    bigBucket: false,
  },

  steal: false,
  stealMeta: {
    success: null,
    baseStolen: null,
  },

  walk: false,

  special: false,
  specialMeta: {
    kind: null,
  },

  maximumBlaseball: false,
}
```

## The metadata collected by mlustard

- `id`: string || undefined
  - the game event ID

- `runsScored`: number
  - how many runs were scored on the play

- `batterUp`: boolean
  - whether a batter just showed up to bat

- `gameStatus`: null || string
  - will be `null` or one of:
  - `'beforeFirstPitch'`, when the first pitch hasn't been thrown yet
  - `'firstHalfInningStart'`, when the first half of an inning is starting (not available for Coronation Era)
  - `'secondHalfInningStart'`, when the second half of an inning is starting (not available for Coronation Era)
  - `'halfInningEnd'`, when any half of an inning is ending on the play
  - `'gameEnd'`, when the game has ended

- `out`: boolean
  - true when there is an out on the play
- `outMeta`: object, with the props:
  - `kind`: null || string
    - will be one of:
    - `'fly'`
    - `'catch'`
    - `'ground'`
    - `'strike'`
    - `'caughtStealing'`
    - `'unspecified'` (as you sometimes see with sacrifice outs)
  - `sacrifice`: boolean
    - true when the out was a sacrifice
  - `sacrificeMeta`: object, with the following props:
    - `kind`: string || null
    - will be one of:
    - `'advance'`
    - `'score'`

- `hit`: boolean
  - true when there is a hit on the play
- `hitMeta`: object, with the props:
  - `kind`: null || string
    - will be one of:
    - `'single'`
    - `'double'`
    - `'triple'`
    - `'homeRun'`
    - `'grandSlam'`
  - `bigBucket`: boolean
    - whether a Big Bucket was activated on the play

- `steal`: boolean
  - true when there is an attempted steal on the play
- `stealMeta`: object, with the props:
  - `success`: boolean
    - true when thief not caught, false otherwise
  - `baseStolen`: null || number
    - the base which was stolen (0-indexed)

- `walk`: boolean
  - true when there is a walk on the play

- `baseRunners`: object, with the props
  - `first`
  - `second`
  - `third`
  - `fourth`
  - all these props are objects, and if there is a runner on that given base,
    they have the following props:
      - `playerName`: string
        - the name of the player on base, or empty string
      - `playerId`: string
        - the ID of the player on base

- `special`: boolean
  - true when there was a special event on the play
- `specialMeta`: object, with the props:
  - `kind`: null || string
    - will be one of:
    - `'blooddrain'`
    - `'isPartying'`
    - `'reverb'`
    - `'birdsCircle'`
    - `'birdsPecked'`
    - `'justBirds'`
    - `'allergicReaction'`
    - `'incinerated'`
    - `'becameMagmatic'`
    - `'feedback'`
    - `'electricity'`
    - `'unstable'`
    - `'flickering'`
    - `'consumersAttack'`
    - `'consumersAttackDefended'`
    - `'salmon'`

- `maximumBlaseball`: boolean
  - true when we're at MAXIMUM BLASEBALL

## Contributors

- [hora](https://github.com/hora)
- [RangerRick](https://github.com/RangerRick)

## Acknowledgments

You need a lot of things to make a node module, but at the very least, thanks go
to:

- [The Game Band](https://thegameband.com/), because we are all love blaseball.
- [The Society for Internet Blaseball Research](https://sibr.dev/), for providing
  many of the ingredients that go into mlustard, including help with the APIs
  and overall Blaseball Knowledge.
- [RangerRick](https://github.com/RangerRick), for writing the code that
  identifies MAXIMUM BLASEBALL and the special events, and for sharing it.

## Some last words

mlustard is not endorsed by nor affiliated with [The Game
Band](https://thegameband.com/).
The Commisioner is doing a Great Job.

