import Link from 'next/link'
import { CheckSquare, Database } from 'lucide-react'

export default function DashboardPage() {
  return (
    <main className="min-h-[calc(100vh-73px)] p-6 md:p-12 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Quản lý kiểm tra CCTV</h1>
        <p className="text-gray-500">Chọn một trong các chức năng bên dưới để bắt đầu.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/general-check" className="group rounded-3xl border bg-white p-8 shadow-sm hover:shadow-md hover:border-black/20 transition-all">
          <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <CheckSquare className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">Page 1 - Kiểm tra chung</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Nhập dữ liệu kiểm tra tổng quát. Dùng cho việc giám sát chung các thiết bị camera an ninh và ghi nhận tình trạng cơ bản.
          </p>
        </Link>
        <Link href="/data-entry" className="group rounded-3xl border bg-white p-8 shadow-sm hover:shadow-md hover:border-black/20 transition-all">
          <div className="h-12 w-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Database className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">Page 2 - Nhập dữ liệu</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Nhập dữ liệu chi tiết, các thông số cụ thể và bảo trì, có thể xuất báo cáo bằng chứng dưới dạng Excel.
          </p>
        </Link>
      </div>
    </main>
  )
}
