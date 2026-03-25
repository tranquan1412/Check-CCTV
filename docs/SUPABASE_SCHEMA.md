# Supabase Schema Confirmation

## 1) Table đang được app sử dụng
### `public.cctv_inspections`

Từ code hiện tại, app đang đọc/ghi các field sau:

- `id` (uuid, optional khi insert)
- `page_type` (`general_check` | `data_entry`)
- `stt` (number)
- `camera_position` (text)
- `evidence_image_url` (text, nullable)
- `camera_date` (date string `yyyy-MM-dd`)
- `note` (text, nullable)
- `created_by` (uuid user id)
- `created_at`
- `updated_at`

## 2) Required fields theo app hiện tại
App đang validate bắt buộc:
- `camera_position`
- `camera_date`

App KHÔNG bắt buộc:
- `evidence_image_url`
- `note`

## 3) Scope nghiệp vụ
`page_type` hiện phân thành 2 scope:
- `general_check`
- `data_entry`

Dữ liệu đang được lọc theo:
- `page_type`
- `created_by = current auth user`

## 4) Storage bucket
### Bucket: `cctv-evidence`

Ảnh evidence được upload theo path:
- `general_check/<random>.<ext>`
- `data_entry/<random>.<ext>`

Sau khi upload, app đang lấy `publicUrl` để lưu vào `evidence_image_url`.

## 5) Export Excel hiện tại
API route hiện dùng:
- `app/api/export/route.ts`

Export đang lấy dữ liệu từ `cctv_inspections` theo:
- `page_type`
- `created_by = current user`

Các cột export hiện tại:
- STT
- Vị trí trên camera
- Ảnh bằng chứng
- Ngày trong camera
- Ghi chú

## 6) Điểm cần xác nhận với business
Trước khi coi schema là chốt, cần xác nhận:
1. `camera_position` có đủ chưa hay cần thêm `camera_name` / `line` / `floor`
2. `camera_date` là ngày kiểm tra hay ngày hiển thị trong footage
3. `note` có cần tách thành nhiều cột không
4. `evidence_image_url` có cần nhiều ảnh cho một dòng không
5. `stt` có phải unique trong từng scope hay chỉ để hiển thị

## 7) Khuyến nghị kỹ thuật
Nếu nghiệp vụ sẽ mở rộng sau này, cân nhắc thêm:
- `inspection_status`
- `inspection_result`
- `site_code`
- `camera_code`
- `checked_by`
- `submitted_at`
