import {
  Button,
  List,
  Stack,
  TextField,
  ListItem,
  ListItemText,
  IconButton,
  ListItemSecondaryAction,
} from "@mui/material";
import { Fragment, useReducer, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { pink } from "@mui/material/colors";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import styled from "@emotion/styled";

import { reducer, initialState, ActionTypeValue, Todo } from "./todos.reducer";

export type TodosProps = {
  text: string;
  onChange: (s: string) => void;
  remainingTodos: Todo[];
  completedTodos: Todo[];
  timerDuration: number;
  selectedTodoGuid?: string;

  onSelected: (guid: string) => void;

  onAdd: () => void;
  onIncrease: (guid: string) => void;
  onDecrease: (guid: string) => void;
  onDelete: (guid: string) => void;
};

export type TodosContainerProps = {
  onTodoSelected: any;
  canBeSelected: boolean;
};

export function TodosContainer({
  onTodoSelected,
  canBeSelected,
}: TodosContainerProps) {
  const [text, setText] = useState("");
  const [todosState, todosDispatch] = useReducer(reducer, initialState);

  function onSelected(todoGuid: string) {
    if (!canBeSelected) {
      return;
    }

    todosDispatch({
      type: ActionTypeValue.SetSelectedTodoGuid,
      payload: todoGuid,
    });

    const selectedTodo = todosState.todos.find((x) => x.guid == todoGuid);
    onTodoSelected(selectedTodo);
  }

  const onChange = (text: string) => {
    setText(text);
  };

  const onAdd = () => {
    todosDispatch({
      type: ActionTypeValue.AddTodo,
      payload: text,
    });

    setText("");
  };

  const onIncrease = (guid: string) => {
    todosDispatch({
      type: ActionTypeValue.IncreaseCounter,
      payload: guid,
    });
  };

  const onDecrease = (guid: string) => {
    todosDispatch({
      type: ActionTypeValue.DecreaseCounter,
      payload: guid,
    });
  };

  const onDelete = (guid: string) => {
    todosDispatch({
      type: ActionTypeValue.DeleteTodo,
      payload: guid,
    });
  };

  const props = {
    text,
    onChange,
    remainingTodos: todosState.todos.filter((t) => t.count >= 1),
    completedTodos: todosState.completedTodos,
    timerDuration: 30,
    selectedTodoGuid: todosState.selectedTodoGuid,
    onSelected,
    onAdd,
    onIncrease,
    onDecrease,
    onDelete,
  };

  return <TodosComponent {...props} />;
}

export function TodosComponent(props: TodosProps) {
  const { hours: remainingHours, minutes: remainingMinutes } =
    getHoursAndMinutes(props.remainingTodos, props.timerDuration);
  const { hours: completedHours, minutes: completedMinutes } =
    getHoursAndMinutes(props.completedTodos, props.timerDuration);

  return (
    <Stack spacing={1}>
      <WrapperDiv>
        Todo list ({props.remainingTodos.length}) [{remainingHours}h :{" "}
        {remainingMinutes}
        m]
      </WrapperDiv>
      <Stack spacing={1} direction="row">
        <TextField
          label="Add new todo"
          variant="outlined"
          size="small"
          data-testid="add-new-todo"
          fullWidth
          value={props.text}
          onChange={(ev) => props.onChange(ev.target.value)}
        />
        <Button
          variant="contained"
          onClick={() => props.onAdd()}
          data-testid="add-button"
          disabled={props.text.length == 0}
        >
          Add
        </Button>
      </Stack>
      {props.remainingTodos.length == 0 && (
        <WrapperDiv>Todo list is empty.</WrapperDiv>
      )}
      {props.remainingTodos.length > 0 && (
        <List>
          {props.remainingTodos.map(({ guid, text, count }) => {
            return (
              <ListItem
                button
                key={`todo_${guid}`}
                divider
                selected={guid === props.selectedTodoGuid}
                onClick={(event) => props.onSelected(guid)}
              >
                <ListItemText primary={text}></ListItemText>
                <ListItemSecondaryAction>
                  <Fragment>
                    [{count}]
                    <IconButton
                      edge="end"
                      data-testid="increase-button"
                      onClick={() => props.onIncrease(guid)}
                    >
                      <AddCircleIcon color="success" />
                    </IconButton>
                    <IconButton
                      edge="end"
                      data-testid="decrease-button"
                      disabled={count == 1}
                      onClick={() => props.onDecrease(guid)}
                    >
                      <RemoveCircleOutlineIcon color="success" />
                    </IconButton>
                    <IconButton
                      edge="end"
                      data-testid="delete-button"
                      onClick={() => props.onDelete(guid)}
                      disabled={props.selectedTodoGuid == guid}
                    >
                      <DeleteIcon sx={{ color: pink[500] }} />
                    </IconButton>
                  </Fragment>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      )}
      {props.completedTodos.length > 0 && (
        <>
          <WrapperDiv>
            Completed todo list ({props.completedTodos.length}) [
            {completedHours}h : {completedMinutes}m]
          </WrapperDiv>
          <List>
            {props.completedTodos.map(({ guid, text, count }) => (
              <ListItem button key={`completed_todo_${guid}`} divider>
                <ListItemText primary={text}></ListItemText>
                <ListItemSecondaryAction>
                  <Fragment>[{count}]</Fragment>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Stack>
  );
}

// styled components

const WrapperDiv = styled.div`
  text-align: center;
`;

function getHoursAndMinutes(todos: Todo[], timerDuration: number) {
  const totalMinutes = todos.reduce(
    (prevValue: number, currentValue) =>
      prevValue + currentValue.count * timerDuration,
    0
  );

  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);

  return { hours, minutes };
}
