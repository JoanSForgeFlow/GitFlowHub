// interfaces/types.ts

export interface User {
    id: number;
    email: string;
    username: string | null;
    password: string;
    token: string | null;
    confirmed: boolean;
    location: string | null;
    language: string | null;
    timeZone: string | null;
    image: string | null;
    github_user: string;
    login: string;
    avatar_url: string;
    company_id: number;
  }
  
  export enum Priority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
  }
  
  export interface Pull {
    id: number;
    title: string;
    description: string;
    state: string;
    created_at: string;
    html_url: string;
    repo_name: string;
    user_id: number;
    User: User;
    number: number;
    asigned_user: User;
    review_status: string;
    priority: Priority;
    gitflowHubStatus?:string;
  }
  