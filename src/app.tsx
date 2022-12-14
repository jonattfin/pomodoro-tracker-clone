import styled from "@emotion/styled";
import { Box, Grid, Stack } from "@mui/material";
import { useMachine } from "@xstate/react";
import _ from "lodash";
import { useState } from "react";
import { Timer } from "./timer";
import { timerMachine } from "./timer/timer.machine";
import { TodosContainer } from "./todos/todos";
import { Todo } from "./todos/todos.reducer";

export default function App() {
  const [current, send] = useMachine(timerMachine);
  const [text, setText] = useState("");

  const onTodoSelected = (todo: Todo) => {
    setText(todo.text);
    send("SELECT");
  };

  const canBeSelected = _.every(
    [
      current.matches("started"),
      current.matches("paused"),
      current.matches("completed"),
    ],
    (x) => !x
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <Timer {...{ text, current, send }} />
          <Separator />
          <TodosContainer {...{ onTodoSelected, canBeSelected }} />
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid>
    </Box>
  );
}

const Separator = styled.div`
  margin: 50px 0px;
`;
