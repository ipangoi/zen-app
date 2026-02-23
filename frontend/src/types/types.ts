export interface BaseEntity {
    id: number;
    created_at: string;
}

export interface User extends BaseEntity {
    username: string;
    email: string;
}

export interface Task extends BaseEntity {
    user_id: number;
    title: string;
    body: string;
    status: string;
    updated_at: string;
    user: User;
}

export interface Session extends BaseEntity {
    user_id: number;
    task_id: number | null;
    start_time: string;
    end_time: string | null;
    duration: number;
    user: User;
    task: Task;
}

export interface Chat extends BaseEntity {
    user_id: number;
    role: string;
    content: string;
    user: User;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface ApiResponse<T> {
    message: string;
    data: T;
}