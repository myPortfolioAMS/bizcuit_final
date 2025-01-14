export interface Task {
    id: number;
    title: string;
    description: string;
    category: string;
    dueDate: Date;
    sharedTask: boolean;
    sharedUser: string;
    completed: boolean;
}

export interface NewTask {
    title: string;
    description: string;
    category: string;
    dueDate: Date;
    sharedTask: boolean;
    sharedUser: string;
    completed: boolean;
}
