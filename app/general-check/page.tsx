import { InspectionTable } from '@/components/inspection-table'
import { CheckSquare } from 'lucide-react'

export default function GeneralCheckPage() {
  return (
    <main className="p-6 md:p-8 max-w-[1600px] mx-auto min-h-[calc(100vh-73px)]">
      <div className="mb-8 flex items-center gap-3">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
          <CheckSquare className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Kiểm tra chung</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý và cập nhật thông tin tổng quát các camera</p>
        </div>
      </div>
      
      <InspectionTable pageType="general_check" title="KiemTraChung" />
    </main>
  )
}
