export type DemoUser = {
  id: string
  username: string
  email: string
  password: string
}

export const DEMO_USER: DemoUser = {
  id: "demo",
  username: "demo",
  email: "demoskin123@gmail.com",
  password: "Demo@123",
}

// Simple in-memory store for demo purposes (resets on reload)
export const usersMemory: DemoUser[] = [DEMO_USER]
