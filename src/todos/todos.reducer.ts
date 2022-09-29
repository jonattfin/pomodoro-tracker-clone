import produce from "immer";
import { v4 as uuidv4 } from "uuid";

export type Todo = {
  guid: string;
  text: string;
  count: number;
};

export type TodoType = {
  selectedTodoGuid?: string;
  todos: Todo[];
  completedTodos: Todo[];
};

export type ActionType = {
  type: ActionTypeValue;
  payload: string;
};

export const initialState: TodoType = {
  selectedTodoGuid: undefined,
  todos: [],
  completedTodos: [],
};

export enum ActionTypeValue {
  AddTodo,
  SetSelectedTodoGuid,
  IncreaseCounter,
  DecreaseCounter,
  DeleteTodo,
  CompleteTodo,
}

export const reducer = (state: TodoType, action: ActionType) => {
  const { type, payload } = action;

  switch (type) {
    case ActionTypeValue.SetSelectedTodoGuid: {
      return produce(state, (draftState) => {
        draftState.selectedTodoGuid = payload;
      });
    }

    case ActionTypeValue.AddTodo: {
      return produce(state, (draftState) => {
        draftState.todos.push({
          guid: uuidv4(),
          text: action.payload,
          count: 1,
        });
      });
    }

    case ActionTypeValue.CompleteTodo: {
      return produce(state, (draftState) => {
        const todoObj = state.todos.find((t) => t.guid === payload);
        if (todoObj) {
          const { guid, text } = todoObj;

          const foundItem = draftState.completedTodos.find(
            (t) => t.text === text
          );
          if (foundItem) {
            foundItem.count += 1;
          } else {
            draftState.completedTodos.push({ guid, text, count: 1 });
          }
        }
      });
    }

    case ActionTypeValue.IncreaseCounter: {
      return produce(state, (draftState) => {
        const todoObj = draftState.todos.find((t) => t.guid === payload);
        if (todoObj) {
          todoObj.count++;
        }
      });
    }
    case ActionTypeValue.DecreaseCounter: {
      return produce(state, (draftState) => {
        const todoObj = draftState.todos.find((t) => t.guid === payload);
        if (todoObj) {
          todoObj.count--;
        }
      });
    }
    case ActionTypeValue.DeleteTodo: {
      return produce(state, (draftState) => {
        draftState.todos = draftState.todos.filter((t) => t.guid != payload);
      });
    }
    default:
      return state;
  }
};
