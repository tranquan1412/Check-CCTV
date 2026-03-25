import { InspectionTable } from '@/components/inspection-table'
import { Database } from 'lucide-react'

export default function DataEntryPage() {
  return (
    <main className="p-6 md:p-8 max-w-[1600px] mx-auto min-h-[calc(100vh-73px)]">
      <div className="mb-8 flex items-center gap-3">
        <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
          <Database className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Nhập dữ liệu</h1>
          <p className="text-gray-500 text-sm mt-1">Cập nhật chi tiết dữ liệu camera và bằng chứng</p>
        </div>
      </div>
      
      <InspectionTable pageType="data_entry" title="NhapDuLieu" />
    </main>
  )
}
