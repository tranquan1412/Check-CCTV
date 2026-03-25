'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { type InspectionRow, type PageType } from '@/types/inspection'
import { toast } from 'sonner'
import { ExternalLink, Trash2, Plus, Save, Download, CheckSquare } from 'lucide-react'

interface InspectionTableProps {
  pageType: PageType
  title: string
}

const INSPECTIONS_TABLE = 'cctv_inspections'
const EVIDENCE_BUCKET = 'cctv-evidence'

function explainSupabaseError(message: string) {
  const raw = message || ''
  if (raw.toLowerCase().includes('bucket not found')) {
    return `Bucket '${EVIDENCE_BUCKET}' chưa tồn tại trên Supabase. Hãy tạo bucket này hoặc chạy file supabase/setup.sql.`
  }
  if (raw.toLowerCase().includes('could not find the table') || raw.toLowerCase().includes('schema cache')) {
    return `Bảng '${INSPECTIONS_TABLE}' chưa tồn tại trên Supabase. Hãy chạy file supabase/setup.sql trong SQL Editor.`
  }
  return raw
}

export function InspectionTable({ pageType, title }: InspectionTableProps) {
  const [rows, setRows] = useState<InspectionRow[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from(INSPECTIONS_TABLE)
      .select('*')
      .eq('page_type', pageType)
      .eq('created_by', user.id)
      .order('stt', { ascending: true })

    if (error) {
      toast.error('Lỗi khi tải dữ liệu: ' + explainSupabaseError(error.message), { duration: 8000 })
    } else {
      setRows(data || [])
    }
    setLoading(false)
  }

  const addRow = () => {
    const nextStt = rows.length > 0 ? Math.max(...rows.map(r => r.stt)) + 1 : 1
    const newRow: InspectionRow = {
      page_type: pageType,
      stt: nextStt,
      camera_position: '',
      camera_date: new Date().toISOString().split('T')[0],
      note: ''
    }
    setRows([...rows, newRow])
  }

  const updateRow = (index: number, field: keyof InspectionRow, value: any) => {
    const newRows = [...rows]
    newRows[index] = { ...newRows[index], [field]: value }
    setRows(newRows)
  }

  const removeRow = async (index: number) => {
    const row = rows[index]
    if (row.id) {
      const toastId = toast.loading('Đang xoá dòng...')
      const { error } = await supabase.from(INSPECTIONS_TABLE).delete().eq('id', row.id)
      if (error) {
        toast.error('Lỗi khi xoá: ' + explainSupabaseError(error.message), { id: toastId, duration: 8000 })
        return
      }
      toast.success('Đã xoá dòng', { id: toastId })
    }
    const newRows = rows.filter((_, i) => i !== index)
    setRows(newRows)
  }

  const uploadImage = async (file: File, index: number) => {
    const toastId = toast.loading('Đang tải ảnh lên...')
    const fileExt = file.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`
    const filePath = `${pageType}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from(EVIDENCE_BUCKET)
      .upload(filePath, file)

    if (uploadError) {
      toast.error('Lỗi upload: ' + explainSupabaseError(uploadError.message), { id: toastId, duration: 8000 })
      return
    }

    const { data } = supabase.storage.from(EVIDENCE_BUCKET).getPublicUrl(filePath)
    
    updateRow(index, 'evidence_image_url', data.publicUrl)
    toast.success('Tải ảnh thành công!', { id: toastId })
  }

  const validateRows = () => {
    for (const row of rows) {
      if (!row.camera_position.trim()) {
        toast.error(`Dòng STT ${row.stt}: Vui lòng nhập vị trí trên camera`)
        return false
      }
      if (!row.camera_date) {
        toast.error(`Dòng STT ${row.stt}: Vui lòng chọn ngày trong camera`)
        return false
      }
    }
    return true
  }

  const saveAll = async () => {
    if (!validateRows()) return

    const toastId = toast.loading('Đang lưu dữ liệu...')
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      toast.error('Chưa đăng nhập', { id: toastId })
      return
    }

    const rowsToUpsert = rows.map(r => {
      const dbRow: any = {
        page_type: r.page_type,
        stt: r.stt,
        camera_position: r.camera_position,
        evidence_image_url: r.evidence_image_url,
        camera_date: r.camera_date,
        note: r.note,
        created_by: user.id
      }
      if (r.id) dbRow.id = r.id
      return dbRow
    })

    const { data, error } = await supabase
      .from(INSPECTIONS_TABLE)
      .upsert(rowsToUpsert, { onConflict: 'id' })
      .select()

    if (error) {
      toast.error('Lỗi khi lưu: ' + explainSupabaseError(error.message), { id: toastId, duration: 8000 })
    } else {
      toast.success('Đã lưu thành công!', { id: toastId })
      if (data) setRows(data as InspectionRow[])
    }
  }

  const exportExcel = async () => {
    const toastId = toast.loading('Đang xuất Excel...')
    try {
      const res = await fetch(`/api/export?pageType=${pageType}`)
      if (!res.ok) throw new Error('Yêu cầu xuất Excel thất bại')
      
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title}.xlsx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      
      toast.success('Xuất Excel thành công!', { id: toastId })
    } catch (error: any) {
      toast.error('Lỗi xuất Excel: ' + error.message, { id: toastId })
    }
  }

  if (loading) {
    return (
      <div className="p-12 flex justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-black border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <button onClick={addRow} className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
          <Plus className="h-4 w-4" /> Thêm dòng
        </button>
        <button onClick={saveAll} className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors shadow-sm">
          <Save className="h-4 w-4" /> Lưu dữ liệu
        </button>
        <button onClick={exportExcel} className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
          <Download className="h-4 w-4" /> Xuất Excel
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <table className="min-w-full border-collapse text-sm text-left align-top">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-700 w-20">STT</th>
              <th className="p-4 font-semibold text-gray-700 min-w-[250px]">Vị trí trên camera</th>
              <th className="p-4 font-semibold text-gray-700 min-w-[200px]">Ảnh bằng chứng</th>
              <th className="p-4 font-semibold text-gray-700 w-48">Ngày trong camera</th>
              <th className="p-4 font-semibold text-gray-700 min-w-[300px]">Ghi chú</th>
              <th className="p-4 font-semibold text-gray-700 w-16 text-center">Xoá</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row, index) => (
              <tr key={row.id || index} className="hover:bg-gray-50/50 transition-colors group">
                <td className="p-4 align-top">
                  <input
                    type="number"
                    className="w-16 rounded-lg border border-gray-200 px-3 py-2 text-center focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    value={row.stt}
                    onChange={(e) => updateRow(index, 'stt', Number(e.target.value))}
                  />
                </td>
                <td className="p-4 align-top">
                  <input
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    value={row.camera_position}
                    onChange={(e) => updateRow(index, 'camera_position', e.target.value)}
                    placeholder="Tên camera / vị trí"
                  />
                </td>
                <td className="p-4 align-top space-y-3">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                    onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], index)} 
                  />
                  {row.evidence_image_url && (
                    <div className="relative group/img overflow-hidden rounded-md inline-block border">
                      <img src={row.evidence_image_url} alt="Evidence" className="h-20 w-32 object-cover" />
                      <a href={row.evidence_image_url} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity text-white">
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    </div>
                  )}
                </td>
                <td className="p-4 align-top">
                  <input
                    type="date"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    value={row.camera_date}
                    onChange={(e) => updateRow(index, 'camera_date', e.target.value)}
                  />
                </td>
                <td className="p-4 align-top">
                  <textarea
                    className="min-h-[90px] w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black resize-y"
                    value={row.note || ''}
                    onChange={(e) => updateRow(index, 'note', e.target.value)}
                    placeholder="Ghi chú bằng tiếng Việt"
                  />
                </td>
                <td className="p-4 align-top text-center pt-5">
                  <button 
                    onClick={() => removeRow(index)}
                    className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Xoá dòng"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <CheckSquare className="h-8 w-8 text-gray-300" />
                    <p>Chưa có dữ liệu. Bấm <b>Thêm dòng</b> để bắt đầu.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
