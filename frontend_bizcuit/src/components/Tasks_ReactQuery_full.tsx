import { useEffect, useState } from "react";
import {
    useQuery,
    UseQueryOptions,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import axios from "../api/axios";
import { toast } from "react-toastify";
import BizcuitLogo from "../assets/Bizcuit-logo.png";

import { Task, NewTask } from "../types/task";

export default function Tasks() {
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        category: "",
        dueDate: new Date(),
        sharedTask: false,
        sharedUser: "",
        completed: false,
    });
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [updatedTask, setUpdatedTask] = useState<{
        title: string;
        description: string;
        category: string;
        dueDate: Date;
        sharedTask: boolean;
        sharedUser: string;
        completed: boolean;
    }>({
        title: "",
        description: "",
        category: "",
        dueDate: new Date(),
        sharedTask: false,
        sharedUser: "",
        completed: false,
    });

    const useDeleteTask = () => {
        const queryClient = useQueryClient();

        const mutation = useMutation({
            mutationFn: async (taskId: number) => {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Authentication token is missing.");
                }

                const response = await axios.delete(`/tasks/${taskId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                return response.data;
            },
            onSuccess: (_, taskId) => {
                queryClient.setQueryData(
                    ["tasks"],
                    (oldTasks: Task[] | undefined) =>
                        oldTasks
                            ? oldTasks.filter((task) => task.id !== taskId)
                            : []
                );

                toast.success(`Task ${taskId} deleted successfully!`);
            },
            onError: (error, taskId) => {
                toast.error(
                    `Failed to delete task ${taskId}: ${error.message}`
                );
            },
        });

        return mutation;
    };

    const useEditTask = () => {
        const queryClient = useQueryClient();

        const mutation = useMutation({
            mutationFn: async ({
                taskId,
                updatedTask,
            }: {
                taskId: number;
                updatedTask: Partial<Task>;
            }) => {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Authentication token is missing.");
                }

                const response = await axios.put(
                    `/tasks/${taskId}`,
                    updatedTask,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                return response.data;
            },
            onSuccess: (data, variables) => {
                const { taskId, updatedTask } = variables;
                queryClient.setQueryData(
                    ["tasks"],
                    (oldTasks: Task[] | undefined) =>
                        oldTasks
                            ? oldTasks.map((task) =>
                                  task.id === taskId
                                      ? { ...task, ...updatedTask }
                                      : task
                              )
                            : []
                );
                toast.success(`Task ${taskId} updated successfully!`);
            },
            onError: (error: any, variables) => {
                const { taskId } = variables;
                toast.error(
                    `Failed to update task ${taskId}: ${error.message}`
                );
            },
        });

        return mutation;
    };

    const { mutate: deleteTask } = useDeleteTask();
    const { mutate: editTask, isPending: isEditing } = useEditTask();

    const queryClient = useQueryClient();

    const createTask = useMutation({
        mutationFn: async (newTask: NewTask) => {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication token is missing.");
            }

            const response = await axios.post(
                "http://localhost:3000/tasks",
                newTask,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });

    const { mutate, isPending, isError, error } = createTask;

    const handleCreateTask = () => {
        mutate(newTask, {
            onSuccess: () => {
                setNewTask({
                    title: "",
                    description: "",
                    category: "",
                    dueDate: new Date(),
                    sharedTask: false,
                    sharedUser: "",
                    completed: false,
                });
                toast.success("Task created successfully!");
            },
            onError: (error) => {
                toast.error(`Failed to create task: ${error.message}`);
            },
        });
    };

    const fetchTasks = async (): Promise<Task[]> => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
            throw new Error(
                "Authentication information is missing. Please log in."
            );
        }

        const response = await fetch(
            `http://localhost:3000/tasks/userId/${userId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const responseText = await response.text();

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error fetching tasks: ${errorText}`);
        }

        try {
            return JSON.parse(responseText);
        } catch (error) {
            throw new Error("Failed to parse JSON response");
        }
    };

    const {
        data: fetchedTasks,
        error: queryError,
        isLoading,
    } = useQuery<Task[], Error>({
        queryKey: ["tasks"],
        queryFn: fetchTasks,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        retry: 3,
    } as UseQueryOptions<Task[], Error>);

    if (isLoading) return <p> Loading...</p>;
    if (queryError) return <p>Error fetching tasks: {queryError.message}</p>;

    const handleCheckboxChangeSharedTask = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setNewTask({
            ...newTask,
            sharedTask: e.target.checked,
        });
    };

    const handleCheckboxChangeCompleted = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setNewTask({
            ...newTask,
            completed: e.target.checked,
        });
    };

    const handleEditTask = (taskId: number, updatedTask: Partial<Task>) => {
        editTask({ taskId, updatedTask });
    };

    const handleDeleteTask = (taskId: number) => {
        deleteTask(taskId);
    };
    const handleSetCompleted = (taskId: number) => {
        // setNewTask({
        //     ...newTask,
        //     completed: e.target.checked,
        // });
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return (
        <div className="p-4">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateTask();
                }}
                className="space-y-4"
            >
                <div className="flex justify-center mb-4">
                    <img
                        src={BizcuitLogo}
                        alt="Bizcuit Logo"
                        className="h-32 w-auto"
                    />
                </div>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Tasks</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-white rounded hover:bg-orange-600"
                        style={{ backgroundColor: "#fc8404" }}
                    >
                        Logout
                    </button>
                </div>
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-orange-500"
                    >
                        Title
                    </label>
                    <input
                        type="text"
                        placeholder="Add your task title here"
                        value={newTask.title}
                        onChange={(e) =>
                            setNewTask({ ...newTask, title: e.target.value })
                        }
                        className="block w-full p-2 border rounded mt-2"
                    />
                </div>
                <div>
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-orange-500"
                    >
                        Description
                    </label>
                    <textarea
                        placeholder="Add the task description here"
                        value={newTask.description}
                        onChange={(e) =>
                            setNewTask({
                                ...newTask,
                                description: e.target.value,
                            })
                        }
                        className="block w-full p-2 border rounded mt-2"
                    />
                </div>
                <div>
                    <label
                        htmlFor="category"
                        className="block text-sm font-medium text-orange-500"
                    >
                        Category
                    </label>
                    <select
                        id="category"
                        value={newTask.category}
                        onChange={(e) =>
                            setNewTask({ ...newTask, category: e.target.value })
                        }
                        className="block w-full p-2 border rounded bg-neutral-50 mt-2"
                    >
                        <option value="" disabled>
                            Select a category
                        </option>
                        <option value="Personal">Personal</option>
                        <option value="Family">Family</option>
                        <option value="Friends">Friends</option>
                        <option value="Work">Work</option>
                        <option value="Housekeeping">Housekeeping</option>
                        <option value="Leisure">Leisure</option>
                        <option value="Sports">Sports</option>
                        <option value="Bills">Bills</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Vacation">Vacation</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
                <div>
                    <label
                        htmlFor="due-date"
                        className="block text-sm font-medium text-orange-500"
                    >
                        Due Date
                    </label>
                    <input
                        type="date"
                        value={newTask.dueDate.toISOString().split("T")[0]}
                        onChange={(e) =>
                            setNewTask((prev) => ({
                                ...prev,
                                dueDate: new Date(e.target.value),
                            }))
                        }
                        className="block w-full p-2 border rounded mt-2"
                    />
                </div>
                <div>
                    <div>
                        <input
                            type="checkbox"
                            id="sharedTask"
                            name="sharedTask"
                            checked={newTask.sharedTask}
                            onChange={handleCheckboxChangeSharedTask}
                            className="mr-2"
                        />
                        <label htmlFor="sharedTask">
                            Is this a shared task ?
                        </label>
                    </div>

                    {newTask.sharedTask && (
                        <div className="flex items-center justify-between mt-4">
                            <label
                                htmlFor="shareduser"
                                className="block text-sm font-medium text-orange-500"
                            >
                                Shared User
                            </label>
                            <input
                                type="text"
                                id="shareduser"
                                placeholder="Add the user Id to share the task"
                                value={newTask.sharedUser}
                                onChange={(e) =>
                                    setNewTask({
                                        ...newTask,
                                        sharedUser: e.target.value,
                                    })
                                }
                                className="block w-full p-2 border rounded mt-2"
                            />
                        </div>
                    )}
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="completed"
                        name="completed"
                        checked={newTask.completed}
                        onChange={handleCheckboxChangeCompleted}
                        className="mr-2"
                    />
                    <label htmlFor="completed">Has it been completed ?</label>
                </div>
                <div className="flex justify-center">
                    <button
                        className="px-4 py-2 text-white rounded hover:bg-orange-600"
                        style={{ backgroundColor: "#fc8404" }}
                        type="submit"
                    >
                        Add Task
                    </button>
                </div>

                <div className="flex justify-center space-x-4">
                    <button
                        className="px-4 py-2 text-white rounded hover:bg-orange-600"
                        style={{ backgroundColor: "#fc8404" }}
                        type="submit"
                    >
                        Order By Status
                    </button>
                    <button
                        className="px-4 py-2 text-white rounded hover:bg-orange-600"
                        style={{ backgroundColor: "#fc8404" }}
                        type="submit"
                    >
                        Order By Data
                    </button>

                    <button
                        className="px-4 py-2 text-white rounded hover:bg-orange-600"
                        style={{ backgroundColor: "#fc8404" }}
                        type="submit"
                    >
                        Order By Category
                    </button>
                </div>
            </form>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fetchedTasks?.map((task) => (
                    <div
                        key={task.id}
                        className="p-6 bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        style={{
                            borderColor: task.sharedUser
                                ? "#fc8404"
                                : "border-gray-300",
                            backgroundColor: task.completed
                                ? "#f0fdf4"
                                : "#fafafa",
                        }}
                    >
                        {editingTaskId === task.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={updatedTask.title || task.title}
                                    onChange={(e) =>
                                        setUpdatedTask({
                                            ...updatedTask,
                                            title: e.target.value,
                                        })
                                    }
                                    className="block w-full p-2 border rounded mt-2"
                                    placeholder="Task Title"
                                />
                                <textarea
                                    value={
                                        updatedTask.description ||
                                        task.description
                                    }
                                    onChange={(e) =>
                                        setUpdatedTask({
                                            ...updatedTask,
                                            description: e.target.value,
                                        })
                                    }
                                    className="block w-full p-2 border rounded mt-2"
                                    placeholder="Task Description"
                                />
                                <input
                                    type="text"
                                    value={updatedTask.category || ""}
                                    onChange={(e) =>
                                        setUpdatedTask({
                                            ...updatedTask,
                                            category: e.target.value,
                                        })
                                    }
                                    className="block w-full p-2 border rounded mt-2"
                                    placeholder="Task Category"
                                />
                                <input
                                    type="date"
                                    value={
                                        updatedTask.dueDate
                                            ? new Date(updatedTask.dueDate)
                                                  .toISOString()
                                                  .split("T")[0]
                                            : ""
                                    }
                                    onChange={(e) =>
                                        setUpdatedTask({
                                            ...updatedTask,
                                            dueDate: new Date(e.target.value),
                                        })
                                    }
                                    className="block w-full p-2 border rounded mt-2"
                                />
                                <div className="flex items-center mt-2">
                                    <input
                                        type="checkbox"
                                        checked={
                                            updatedTask.sharedTask || false
                                        }
                                        onChange={(e) =>
                                            setUpdatedTask({
                                                ...updatedTask,
                                                sharedTask: e.target.checked,
                                            })
                                        }
                                        className="mr-2"
                                    />
                                    <label className="text-sm">
                                        Is this a shared task?
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    value={updatedTask.sharedUser || ""}
                                    onChange={(e) =>
                                        setUpdatedTask({
                                            ...updatedTask,
                                            sharedUser: e.target.value,
                                        })
                                    }
                                    className="block w-full p-2 border rounded mt-2"
                                    placeholder="Shared With"
                                />
                                <div className="flex items-center mt-2">
                                    <input
                                        type="checkbox"
                                        checked={updatedTask.completed || false}
                                        onChange={(e) =>
                                            setUpdatedTask({
                                                ...updatedTask,
                                                completed: e.target.checked,
                                            })
                                        }
                                        className="mr-2"
                                    />
                                    <label className="text-sm">
                                        Is this task completed?
                                    </label>
                                </div>
                                <div className="flex justify-end mt-4 space-x-2">
                                    <button
                                        onClick={() => {
                                            handleEditTask(
                                                task.id,
                                                updatedTask
                                            );
                                            setEditingTaskId(null);
                                        }}
                                        className="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditingTaskId(null)}
                                        className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {task.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {task.description}
                                </p>
                                <div className="mt-4">
                                    <p className="text-sm text-gray-500">
                                        <strong>Category:</strong>{" "}
                                        {task.category}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        <strong>Due Date:</strong>{" "}
                                        {new Date(
                                            task.dueDate
                                        ).toLocaleDateString()}
                                    </p>
                                    {task.sharedUser && (
                                        <p className="text-sm text-gray-500">
                                            <strong>Shared With:</strong>{" "}
                                            {task.sharedUser}
                                        </p>
                                    )}
                                    <p className="mt-2 text-sm text-gray-500">
                                        <strong>Status:</strong>{" "}
                                        <span
                                            className={`inline-block py-1 text-xs font-semibold rounded-full ${
                                                task.completed
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {task.completed
                                                ? "Completed"
                                                : "Pending"}
                                        </span>
                                    </p>
                                </div>

                                <div className="flex justify-end mt-4 space-x-2">
                                    <button
                                        onClick={() => {
                                            setEditingTaskId(task.id);
                                            setUpdatedTask({
                                                title: task.title,
                                                description: task.description,
                                                category: task.category,
                                                dueDate: task.dueDate,
                                                sharedTask: task.sharedTask,
                                                sharedUser: task.sharedUser,
                                                completed: task.completed,
                                            });
                                        }}
                                        className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDeleteTask(task.id)
                                        }
                                        className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleSetCompleted(task.id)
                                        }
                                        className={`px-2 py-1 text-sm rounded ${
                                            task.completed
                                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                : "bg-green-500 text-white hover:bg-green-600"
                                        }`}
                                        disabled={task.completed}
                                    >
                                        {task.completed
                                            ? "Completed"
                                            : "Mark Completed"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
