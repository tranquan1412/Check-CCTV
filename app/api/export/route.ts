import { NextResponse } from 'next/server'
import ExcelJS from 'exceljs'
import { createClient } from '@/lib/supabase-server'

export const runtime = 'nodejs'

function formatDateVi(dateInput: string | null | undefined) {
  if (!dateInput) return ''
  const d = new Date(`${dateInput}T00:00:00`)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

function detectImageExtension(contentType: string | null, url: string) {
  const lower = (contentType || '').toLowerCase()
  if (lower.includes('png')) return 'png'
  if (lower.includes('jpeg') || lower.includes('jpg')) return 'jpeg'
  if (lower.includes('webp')) return 'png'

  const cleanUrl = url.split('?')[0].toLowerCase()
  if (cleanUrl.endsWith('.png')) return 'png'
  if (cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg')) return 'jpeg'
  if (cleanUrl.endsWith('.webp')) return 'png'
  return 'png'
}

async function fetchImageBuffer(url: string) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString('base64')
  return {
    base64,
    extension: detectImageExtension(response.headers.get('content-type'), url),
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const pageType = searchParams.get('pageType')

  if (!pageType) {
    return NextResponse.json({ error: 'Missing pageType' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('cctv_inspections')
    .select('*')
    .eq('page_type', pageType)
    .eq('created_by', user.id)
    .order('stt', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet(pageType === 'general_check' ? 'KiemTraChung' : 'NhapDuLieu')

  worksheet.columns = [
    { header: 'STT', key: 'stt', width: 8 },
    { header: 'Vị trí trên camera', key: 'camera_position', width: 32 },
    { header: 'Ảnh bằng chứng', key: 'evidence_image_url', width: 30 },
    { header: 'Ngày trong camera', key: 'camera_date', width: 18 },
    { header: 'Ghi chú', key: 'note', width: 40 },
  ]

  const headerRow = worksheet.getRow(1)
  headerRow.font = { bold: true }
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
  headerRow.height = 22

  for (const row of data || []) {
    const excelRow = worksheet.addRow({
      stt: row.stt,
      camera_position: row.camera_position,
      evidence_image_url: row.evidence_image_url ? 'Ảnh đính kèm' : 'Không có ảnh',
      camera_date: formatDateVi(row.camera_date),
      note: row.note || '',
    })

    excelRow.alignment = { vertical: 'middle', wrapText: true }
    excelRow.height = row.evidence_image_url ? 120 : 28

    if (row.evidence_image_url) {
      try {
        const image = await fetchImageBuffer(row.evidence_image_url)
        const imageId = workbook.addImage({
          base64: `data:image/${image.extension};base64,${image.base64}`,
          extension: image.extension as 'png' | 'jpeg',
        })

        const rowNumber = excelRow.number
        worksheet.addImage(imageId, {
          tl: { col: 2 + 0.12, row: (rowNumber - 1) + 0.12 },
          ext: { width: 190, height: 95 },
          editAs: 'oneCell',
        })
      } catch {
        worksheet.getCell(`C${excelRow.number}`).value = 'Không tải được ảnh'
      }
    }
  }

  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'D1D5DB' } },
        left: { style: 'thin', color: { argb: 'D1D5DB' } },
        bottom: { style: 'thin', color: { argb: 'D1D5DB' } },
        right: { style: 'thin', color: { argb: 'D1D5DB' } },
      }
      if (rowNumber === 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F3F4F6' },
        }
      }
    })
  })

  const buffer = await workbook.xlsx.writeBuffer()

  return new NextResponse(buffer as Buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename=${pageType}.xlsx`,
    },
  })
}
