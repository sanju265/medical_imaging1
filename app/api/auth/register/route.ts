import { usersMemory, DEMO_USER, type DemoUser } from "../users-store"

export async function POST(req: Request) {
  try {
    const { email, username, password } = await req.json()

    if (!email || !username || !password) {
      return Response.json({ error: "Missing fields" }, { status: 400 })
    }

    // Reject if email already exists in memory (including demo)
    const exists = usersMemory.some((u) => u.email === email) || email === DEMO_USER.email
    if (exists) {
      return Response.json({ error: "Email already registered" }, { status: 409 })
    }

    const newUser: DemoUser = {
      id: `u_${Date.now()}`,
      email,
      username,
      password, // demo-only, do not store plaintext in real apps
    }
    usersMemory.push(newUser)

    const { password: _pw, ...safeUser } = newUser
    return Response.json({ user: safeUser }, { status: 201 })
  } catch (err) {
    return Response.json({ error: "Bad Request" }, { status: 400 })
  }
}
