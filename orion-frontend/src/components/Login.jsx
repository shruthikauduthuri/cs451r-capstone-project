import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Star } from "lucide-react"
import { supabase } from "../supabaseClient"

export default function Login() {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  async function handleLogin(e) {
    e.preventDefault()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setMessage(error.message)
    } else {
      navigate("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">

      <div className="w-full max-w-md px-4">

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-blue-100">

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="relative">
              <Star className="w-10 h-10 text-blue-500 fill-blue-500" />
              <div className="absolute inset-0 blur-md bg-blue-500 opacity-50"></div>
            </div>

            <span className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Orion
            </span>
          </div>

          <h1 className="text-2xl font-semibold text-slate-900 text-center mb-2">
            Welcome back
          </h1>

          <p className="text-slate-600 text-center mb-6">
            Sign in to manage your finances
          </p>

          <form onSubmit={handleLogin} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                className="mt-1 w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                type="password"
                placeholder="Enter your password"
                className="mt-1 w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold p-3 rounded-lg"
            >
              Login
            </button>

          </form>

          {message && (
            <p className="text-red-500 text-center mt-4">{message}</p>
          )}

          <p className="text-center mt-6 text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Create account
            </Link>
          </p>

        </div>

      </div>

    </div>
  )
}
