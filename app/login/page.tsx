'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { CheckSquare } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const toastId = toast.loading('Đang đăng nhập...')
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)
    if (error) {
      toast.error(error.message, { id: toastId })
      return
    }

    toast.success('Đăng nhập thành công!', { id: toastId })
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50/50">
      <form onSubmit={handleLogin} className="w-full max-w-md space-y-6 rounded-3xl border bg-white p-10 shadow-lg">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="p-4 bg-gray-100 rounded-2xl">
            <CheckSquare className="h-10 w-10 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-center">Hệ thống CCTV</h1>
          <p className="text-gray-500 text-sm text-center">Đăng nhập để vào trang quản lý</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold mb-1.5 block text-gray-700">Email</label>
            <input 
              required
              type="email"
              className="w-full rounded-xl border-gray-200 border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all" 
              placeholder="admin@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block text-gray-700">Mật khẩu</label>
            <input 
              required
              className="w-full rounded-xl border-gray-200 border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all" 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
        </div>
        
        <button 
          className="w-full rounded-xl bg-black hover:bg-gray-900 active:scale-[0.98] transition-all px-4 py-3.5 mt-4 text-white font-medium flex justify-center items-center h-12" 
          disabled={loading}
        >
          {loading ? (
             <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
          ) : 'Đăng nhập'}
        </button>
      </form>
    </div>
  )
}
