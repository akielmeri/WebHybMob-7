import {
  StyleSheet,
  Text,
  Pressable,
  SafeAreaView,
  FlatList,
} from "react-native";
import React, { useCallback, useReducer } from "react";
import uuid from "react-native-uuid";
import Row from "./components/Row.js";
import Add from "./components/Add.js";

/*
 * In this exercise, I reused the code from the previous TODO list exercise,
 * and modified it to use useReducer instead of useState.
 * 
 * You can add tasks with the 'Add' button, and mark them as completed by tapping on them.
 * If you press the 'Edit Task List' button, you can remove tasks by tapping the trash icon on them.
 * The 'Done Editing' button will exit the edit mode.
 */

const initialState = {
  tasks: [],
  selectedId: null,
  editMode: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TASK":
      const newItem = {
        id: uuid.v4(),
        name: action.payload,
        completed: false,
      };
      return {
        ...state,
        tasks: [...state.tasks, newItem],
      };
    case "REMOVE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case "TOGGLE_TASK_COMPLETION":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload ? { ...task, completed: !task.completed } : task
        ),
      };
    case "TOGGLE_EDIT_MODE":
      return {
        ...state,
        editMode: !state.editMode,
      };
    case "SET_SELECTED_ID":
      return {
        ...state,
        selectedId: action.payload,
      };
    default:
      return state;
  }
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addTask = useCallback((name) => {
    dispatch({ type: "ADD_TASK", payload: name });
  }, []);

  const removeTask = useCallback((id) => {
    dispatch({ type: "REMOVE_TASK", payload: id });
  }, []);

  const toggleTaskCompletion = useCallback((id) => {
    dispatch({ type: "TOGGLE_TASK_COMPLETION", payload: id });
  }, []);

  const toggleEditMode = () => {
    dispatch({ type: "TOGGLE_EDIT_MODE" });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>ToDo List</Text>
      <Add add={addTask} />
      <Pressable
        style={[styles.toggleButton, state.editMode && styles.toggleButtonActive]}
        onPress={toggleEditMode}
      >
        <Text>{state.editMode ? "Done Editing" : "Edit Task List"}</Text>
      </Pressable>
      <FlatList
        data={state.tasks}
        keyExtractor={(item) => item.id}
        extraData={[state.selectedId, state.editMode]}
        renderItem={({ item }) => (
          <Row
            item={item}
            selectedId={state.selectedId}
            remove={removeTask}
            toggleComplete={toggleTaskCompletion}
            select={(id) => dispatch({ type: "SET_SELECTED_ID", payload: id })}
            editMode={state.editMode}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 10,
  },
  toggleButton: {
    alignSelf: 'flex-start',
    marginLeft: 30,
    backgroundColor: "#e0e0e0",
    padding: 8,
    borderRadius: 5,
    marginBottom: 32,
    marginTop: 8,
  },
  toggleButtonActive: {
    backgroundColor: "#ff6347",
  },
});
