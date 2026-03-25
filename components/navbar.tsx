'use client'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { LogOut, LayoutDashboard, CheckSquare, Database, UserRound } from 'lucide-react'

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUserEmail(user?.email ?? null)
    }
    loadUser()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Hide navbar on login page
  if (pathname === '/login') return null

  return (
    <nav className="flex items-center justify-between border-b px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
      <div className="flex gap-8 items-center">
        <Link href="/dashboard" className="text-xl font-bold flex items-center gap-2 text-black">
          <LayoutDashboard className="h-6 w-6" />
          CCTV Manager
        </Link>
        
        <div className="flex gap-6 items-center">
          <Link href="/general-check" className={`text-sm flex items-center gap-1.5 transition-colors ${pathname === '/general-check' ? 'font-semibold text-black' : 'text-gray-500 hover:text-black'}`}>
            <CheckSquare className="h-4 w-4" /> Kiểm tra chung
          </Link>
          <Link href="/data-entry" className={`text-sm flex items-center gap-1.5 transition-colors ${pathname === '/data-entry' ? 'font-semibold text-black' : 'text-gray-500 hover:text-black'}`}>
            <Database className="h-4 w-4" /> Nhập dữ liệu
          </Link>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {userEmail && (
          <div className="hidden md:flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
            <UserRound className="h-4 w-4" />
            <span>{userEmail}</span>
          </div>
        )}
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" /> Đăng xuất
        </button>
      </div>
    </nav>
  )
}
