import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "./TodoList.css";
import { FaCheckCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BASE_URL } from "../config"
import { IoReload } from "react-icons/io5";


export type Todo = {
  _id: number;
  body: string;
  completed: boolean;
};

export default function TodoList() {
  const queryClient = useQueryClient();
  const { data: todos, isLoading } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/todos`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      return data;
    },
  });

  const { mutate: updateTodo, isPending: isUpdating } = useMutation({
    mutationKey: ["updateTodo"],
    mutationFn: async (todo: Todo) => {
      const response = await fetch(`${BASE_URL}/todos/${todo._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (!response.ok) {
        throw new Error("Failed to update todo");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const { mutate: deleteTodo, isPending: isDeleting } = useMutation({
    mutationKey: ["deleteTodo"],
    mutationFn: async (id: number) => {
      const response = await fetch(`${BASE_URL}/todos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <div>
      {!isLoading && todos?.length === 0 && (
        <div>No tasks found. Please add a task.</div>
      )}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {todos && todos?.length > 0 && <h2>Todo List</h2>}
          <ul>
            {todos?.map((todo: Todo) => (
              <li
                key={todo._id}
                className={`${todo.completed ? "completed" : "inprogress"}`}
              >
                <div className="task">
                  <div className="task-title">{todo.body}</div>{" "}
                  <div className="task-status">
                    {new Date().toLocaleDateString()}{" "}
                    {todo.completed ? "Completed" : "In Progress"}
                  </div>
                </div>
                <div className="tools">
                  <div onClick={() => updateTodo(todo)}>
                    {!isUpdating && (
                      <FaCheckCircle
                        color={todo.completed ? "green" : "orange"}
                        size={20}
                      />
                    )}
                    {isUpdating && (
                      <IoReload color="gray" size={20} className="spin" />
                    )}
                  </div>
                  <div onClick={() => deleteTodo(todo._id)}>
                    {!isDeleting && <MdDelete color="red" size={20} />}
                    {isDeleting && (
                      <IoReload color="gray" size={20} className="spin" />
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
