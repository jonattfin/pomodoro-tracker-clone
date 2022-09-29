import styled from "@emotion/styled";
import { Button, Stack } from "@mui/material";
import _ from "lodash";
import { useEffect } from "react";

export interface TimerProps {
  text: string;
  current: any;
  send: any;
}

export default function Timer({ text, current, send }: TimerProps) {
  const machine = parseMachineStates(current);

  useEffect(() => {
    if (!machine.isStarted) {
      return;
    }

    const interval = setInterval(() => {
      send("COUNT_SECONDS");
    }, 100);
    return () => clearInterval(interval);
  }, [machine.isStarted]);

  const { seconds } = current.context;
  const time = calculateRemainingTime(seconds);

  return (
    <MainContainer>
      <MainTitle>{`${time.minutes} : ${time.seconds}`}</MainTitle>
      <TextTitle>{text || "N/A"}</TextTitle>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        {machine.isIdle && (
          <Button
            variant="contained"
            onClick={() => {
              send("SELECT");
            }}
            disabled={!text}
          >
            Select
          </Button>
        )}
        {machine.isStopped && (
          <>
            <Button
              variant="contained"
              onClick={() => {
                send("START");
              }}
            >
              Start
            </Button>
          </>
        )}
        {machine.isStarted && (
          <>
            <Button
              variant="contained"
              onClick={() => {
                send("PAUSE");
              }}
            >
              Pause
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                send("COMPLETE");
              }}
            >
              Complete
            </Button>
          </>
        )}
        {machine.isPaused && (
          <>
            <Button
              variant="contained"
              onClick={() => {
                send("RESUME");
              }}
            >
              Resume
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                send("COMPLETE");
              }}
            >
              Complete
            </Button>
          </>
        )}
        {machine.isComplete && (
          <Button
            variant="contained"
            onClick={() => {
              send("RESTART");
            }}
          >
            Restart
          </Button>
        )}
      </Stack>
    </MainContainer>
  );
}

const MainTitle = styled.div`
  font-size: 4em;
  text-align: center;
`;

const TextTitle = styled.div`
  font-size: 1em;
  text-align: center;
  color: blue;
  /* margin: 20px; */
`;

const MainContainer = styled.div`
  background-color: brown;
  opacity: 0.9;
  height: 20vh;
  padding: 75px 150px;
`;

function parseMachineStates(current: any) {
  const isMatch = (state: string) => current.matches(state);

  return {
    isIdle: isMatch("idle"),
    isStopped: isMatch("stopped"),
    isStarted: isMatch("started"),
    isPaused: isMatch("paused"),
    isComplete: isMatch("completed"),
  };
}

function calculateRemainingTime(seconds: number) {
  const remainingMinutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return {
    minutes: _.padStart(remainingMinutes.toString(), 2, "0"),
    seconds: _.padStart(remainingSeconds.toString(), 2, "0"),
  };
}
