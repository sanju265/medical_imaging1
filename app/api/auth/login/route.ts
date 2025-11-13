import { DEMO_USER, usersMemory } from "../users-store"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    // Find user in memory store
    const found =
      usersMemory.find((u) => u.email === email && u.password === password) ||
      (email === DEMO_USER.email && password === DEMO_USER.password ? DEMO_USER : null)

    if (!found) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Never return password in response
    const { password: _pw, ...user } = found
    return Response.json({ user }, { status: 200 })
  } catch (err) {
    return Response.json({ error: "Bad Request" }, { status: 400 })
  }
}
