export type PageType = 'general_check' | 'data_entry'

export interface InspectionRow {
  id?: string
  page_type: PageType
  stt: number
  camera_position: string
  evidence_image_url?: string | null
  camera_date: string // yyyy-MM-dd trong DB
  note?: string | null
  created_at?: string
  updated_at?: string
}
