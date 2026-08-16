import { Mail, User2Icon, Lock, Sparkles, ArrowRight } from 'lucide-react'
import React, { useState } from 'react'
import api from '../configs/api'
import { useDispatch } from 'react-redux'
import { login } from '../App/features/authSlice'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const query = new URLSearchParams(window.location.search)
    const urlstate = query.get('state')
    const [state, setState] = useState(urlstate || "login")
    const [focusedInput, setFocusedInput] = useState(null)
  
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const {data} = await api.post(`/api/users/${state}`, formData)
            
            if (state === 'register') {
                toast.success(data.message || "Registration successful. Please login.")
                setState('login')
                setFormData({ ...formData, password: '' })
            } else {
                dispatch(login(data))
                localStorage.setItem('token', data.token)
                toast.success(data.message || "Login successful!")
                navigate('/')
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

  return (
    <div className='relative flex items-center justify-center min-h-screen bg-slate-50 overflow-hidden font-sans'>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-teal-300/20 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-300/20 blur-[100px]" />
        <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] rounded-full bg-blue-300/20 blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-md p-6">
        <form onSubmit={handleSubmit} className="w-full bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 rounded-3xl p-8 sm:p-10 transition-all duration-500">
            
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white shadow-lg shadow-teal-500/30 mb-6 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                    <Sparkles size={28} className="animate-pulse" />
                </div>
                <h1 className="text-gray-900 text-3xl font-bold tracking-tight">
                    {state === "login" ? "Welcome back" : "Create account"}
                </h1>
                <p className="text-gray-500 text-sm mt-3 font-medium">
                    {state === "login" 
                        ? "Enter your details to access your account" 
                        : "Sign up to start building your professional resume"}
                </p>
            </div>

            <div className="space-y-4">
                {state !== "login" && (
                    <div className={`flex items-center w-full h-14 rounded-xl overflow-hidden px-4 gap-3 border transition-all duration-300 bg-white/50 ${focusedInput === 'name' ? 'border-teal-500 ring-4 ring-teal-500/10 shadow-sm transition-all' : 'border-gray-200 hover:border-gray-300'}`}>
                        <User2Icon size={18} className={`transition-colors duration-300 ${focusedInput === 'name' ? 'text-teal-500' : 'text-gray-400'}`} />
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Full Name" 
                            className="w-full h-full border-none outline-none ring-0 bg-transparent text-gray-700 placeholder-gray-400 font-medium" 
                            value={formData.name} 
                            onChange={handleChange} 
                            onFocus={() => setFocusedInput('name')}
                            onBlur={() => setFocusedInput(null)}
                            required 
                        />
                    </div>
                )}
                
                <div className={`flex items-center w-full h-14 rounded-xl overflow-hidden px-4 gap-3 border transition-all duration-300 bg-white/50 ${focusedInput === 'email' ? 'border-teal-500 ring-4 ring-teal-500/10 shadow-sm transition-all' : 'border-gray-200 hover:border-gray-300'}`}>
                    <Mail size={18} className={`transition-colors duration-300 ${focusedInput === 'email' ? 'text-teal-500' : 'text-gray-400'}`} />
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email Address" 
                        className="w-full h-full border-none outline-none ring-0 bg-transparent text-gray-700 placeholder-gray-400 font-medium" 
                        value={formData.email} 
                        onChange={handleChange} 
                        onFocus={() => setFocusedInput('email')}
                        onBlur={() => setFocusedInput(null)}
                        required 
                    />
                </div>

                <div className={`flex items-center w-full h-14 rounded-xl overflow-hidden px-4 gap-3 border transition-all duration-300 bg-white/50 ${focusedInput === 'password' ? 'border-teal-500 ring-4 ring-teal-500/10 shadow-sm transition-all' : 'border-gray-200 hover:border-gray-300'}`}>
                    <Lock size={18} className={`transition-colors duration-300 ${focusedInput === 'password' ? 'text-teal-500' : 'text-gray-400'}`} />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        className="w-full h-full border-none outline-none ring-0 bg-transparent text-gray-700 placeholder-gray-400 font-medium" 
                        value={formData.password} 
                        onChange={handleChange} 
                        onFocus={() => setFocusedInput('password')}
                        onBlur={() => setFocusedInput(null)}
                        required 
                    />
                </div>
            </div>

            {state === "login" && (
                <div className="mt-4 flex justify-end">
                    <button type="button" className="text-sm font-medium text-teal-600 hover:text-teal-500 transition-colors">
                        Forgot password?
                    </button>
                </div>
            )}

            <button 
                type="submit" 
                className={`w-full h-14 rounded-xl text-white font-semibold flex flex-row items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/30 active:translate-y-0 active:shadow-md bg-gradient-to-r from-teal-500 to-emerald-400 mt-8 ${state !== 'login' ? 'mt-8' : ''}`}
            >
                {state === "login" ? "Sign In" : "Create Account"}
                <ArrowRight size={18} />
            </button>
            
            <div className="mt-8 pt-6 border-t border-gray-200/60 text-center">
                <p className="text-gray-500 text-sm font-medium">
                    {state === "login" ? "Don't have an account?" : "Already have an account?"} {' '}
                    <button 
                        type="button"
                        onClick={() => setState(prev => prev === "login" ? "register" : "login")} 
                        className="text-teal-600 font-semibold hover:text-teal-500 hover:underline transition-all"
                    >
                        {state === "login" ? "Sign up here" : "Sign in here"}
                    </button>
                </p>
            </div>
        </form>
      </div>
    </div>
  )
}

export default Login