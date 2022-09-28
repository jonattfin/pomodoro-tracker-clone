import styled from "@emotion/styled";
import { Button, Stack } from "@mui/material";
import { useMachine } from "@xstate/react";
import _ from "lodash";
import { useEffect, useState } from "react";
import { timerMachine } from "./timer.machine";

export default function App() {
  const [current, send] = useMachine(timerMachine);
  const machine = parseMachineStates(current);

  const [seconds, setSeconds] = useState(30 * 60);

  useEffect(() => {
    if (!machine.isStarted) {
      return;
    }

    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [machine.isStarted]);

  const time = calculateRemainingTime(seconds);

  return (
    <MainContainer>
      <MainTitle>{`${time.minutes} : ${time.seconds}`}</MainTitle>
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
        {machine.isComplete && "Is Completed!"}
      </Stack>
    </MainContainer>
  );
}

const MainTitle = styled.div`
  font-size: 8em;
`;

const MainTask = styled.div`
  font-size: 2em;
  text-align: center;
  color: black;
  padding-bottom: 25px;
`;

const MainContainer = styled.div`
  background-color: brown;
  opacity: 0.9;
  height: 30vh;
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
    minutes: _.pad(remainingMinutes.toString(), 2, "0"),
    seconds: _.pad(remainingSeconds.toString(), 2, "0"),
  };
}
