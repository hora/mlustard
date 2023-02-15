const beforeFirstPitch = {
            "game_id": "bee5d007-25b0-4517-b7c1-c3cd7099daf1",
            "timestamp": "2023-01-09T15:05:58.413Z",
            "data": {
                "changedState": {},
                "displayDelay": 4,
                "displayOrder": 0,
                "displayText": "Play Ball!",
                "displayTime": "2023-01-09T15:05:58.413Z"
            }
        };

const endFirstHalf = {
            "game_id": "c445d88e-7c55-4c34-9f07-490d5446096e",
            "timestamp": "2023-01-09T15:31:45.133Z",
            "data": {
                "changedState": {
                    "balls": 0,
                    "baserunners": [],
                    "batter": null,
                    "defenders": [],
                    "inning": 1,
                    "outs": 0,
                    "pitcher": null,
                    "started": true,
                    "strikes": 0,
                    "topOfInning": false
                },
                "displayDelay": 4,
                "displayOrder": 188,
                "displayText": "End of the top of the 2.",
                "displayTime": "2023-01-09T15:31:45.133Z"
            }
        };

const endSecondHalf = {
            "game_id": "c445d88e-7c55-4c34-9f07-490d5446096e",
            "timestamp": "2023-01-09T15:33:10.16Z",
            "data": {
                "changedState": {
                    "balls": 0,
                    "baserunners": [],
                    "batter": null,
                    "defenders": [],
                    "inning": 2,
                    "outs": 0,
                    "pitcher": null,
                    "started": true,
                    "strikes": 0,
                    "topOfInning": true
                },
                "displayDelay": 4,
                "displayOrder": 239,
                "displayText": "End of the bottom of the 2.",
                "displayTime": "2023-01-09T15:33:10.160Z"
            }
        };

const gameOver = {"game_id":"bee5d007-25b0-4517-b7c1-c3cd7099daf1","timestamp":"2023-01-09T16:04:05.236Z","data":{"changedState":{"balls":0,"baserunners":[],"batter":null,"complete":true,"defenders":[],"inning":8,"outs":0,"pitcher":null,"started":true,"strikes":0,"topOfInning":false},"displayDelay":4,"displayOrder":1272,"displayText":"Game Over.","displayTime":"2023-01-09T16:04:05.236Z"}}

module.exports = {
  beforeFirstPitch,
  endFirstHalf,
  endSecondHalf,
  gameOver,
};
