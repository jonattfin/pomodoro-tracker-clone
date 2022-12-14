import { assign, createMachine } from "xstate";

interface Context {
  seconds: number;
}

const addTime = assign({
  seconds: (context: any, _event) => context.seconds + 1,
});

const resetTime = assign({
  seconds: (_context: any, _event) => 0,
});

export const timerMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBcCWBbMAnAdKiANmAMQDKAogDLkDCAKoqAA4D2sqaLAdoyAB6IAjABYADDgCcUiQDYArAGYJAdiWDlcgDQgAnogBMMgBw45o86LnKZywaMEKZAXyfa0mXLGQsmTSGToAQQAlBiQQVnZOHnCBBAVVSVEZQTlBCTkJfWs5YW09BENxMwt9IyMFOTNlFzcMbBwvHz8IYhoAeQBZAAVqOnJeSI5Ubl44hIUklLSMrJy83UQFBRNpWX00leE7GtcQdwavAEMsZH9uwIBVCkG2YdHYxDETQSNVcrNs5Pl8oRWcCz2IyGfTCN4yCS1fb1TzIE5nVodHp9AbhIbRMaIFLCHDCCYQ7ISUSVBYFfQiSTSZTKIxzGmWKEHXBMI4AV1g-mC5FIl06qOYdwxj3iiSJ03SmWy8lJBkE+lxVJpdKMDL2TJwLPZ-iRvXI-VuURGMVA41FyVSErm0t+CFplOkCmy6lSyRcey4LAgcF46vwRAN92N-Ce+hthkmgNEskEr0qzjVMMa3l8kADQpNBjSOBpMesGXMwiyYZkEcB0djcnjdQ8SfhqbRgqNmIQaXEsiMMnJ+nsYg2YajpkBVhsdgcVehNc1HIgaabwo28rWWyMwg26WUNpU2cLElpq4hKqMjMTAGMWOgmEQEbOHhmEBpBArdys5OTBCkFP3VmsVdSS2UjwTDwbyDOJXhtdR7RUakNkUTJdhcIA */
  createMachine<Context>(
    {
      context: {
        seconds: 0,
      },
      id: "timer",
      initial: "idle",
      states: {
        idle: {
          on: {
            SELECT: {
              target: "stopped",
            },
          },
        },
        stopped: {
          on: {
            START: {
              target: "started",
            },
          },
        },
        started: {
          on: {
            COUNT_SECONDS: {
              target: "started",
              actions: "addTime",
            },
            PAUSE: {
              target: "paused",
            },
            COMPLETE: {
              target: "completed",
            },
          },
        },
        paused: {
          on: {
            RESUME: {
              target: "started",
            },
            COMPLETE: {
              target: "completed",
            },
          },
        },
        completed: {
          on: {
            RESTART: {
              target: "idle",
              actions: ["resetTime"],
            },
          },
        },
      },
    },
    {
      actions: {
        addTime,
        resetTime,
      },
    }
  );
