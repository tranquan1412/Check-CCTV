# Hardening Notes — CCTV Inspection App

## 1) RLS / Data isolation
Hiện app client-side đang query trực tiếp `cctv_inspections` và lọc thêm theo `created_by = user.id`.

Cần xác nhận policy RLS tại Supabase để đảm bảo:
- user chỉ `select` được row có `created_by = auth.uid()`
- user chỉ `insert` row có `created_by = auth.uid()`
- user chỉ `update/delete` row có `created_by = auth.uid()`

### Gợi ý policy cần có
- SELECT own rows
- INSERT own rows
- UPDATE own rows
- DELETE own rows

## 2) Storage bucket `cctv-evidence`
Hiện app upload client-side rồi lấy `publicUrl`.

Cần xác nhận:
- bucket có thực sự nên public không?
- nếu không muốn public, cần chuyển sang signed URL
- policy upload/download phải giới hạn theo user hoặc path scope

### Rủi ro hiện tại
Nếu bucket public quá rộng:
- ai có URL có thể xem ảnh
- khó kiểm soát quyền truy cập ảnh bằng chứng

## 3) Export Excel
Route export đang dùng session user và query theo `created_by`.
Điểm này đúng hướng.

Nhưng cần kiểm:
- timezone/date formatting có đúng không
- `toLocaleDateString('vi-VN')` có ổn định trên môi trường deploy không
- nếu cần format chặt hơn, nên format ngày thủ công theo `dd/MM/yyyy`

## 4) Validation nghiệp vụ
Hiện mới validate:
- `camera_position`
- `camera_date`

Có thể cần thêm validate nếu business yêu cầu:
- ảnh bằng chứng bắt buộc hay không
- không cho trùng STT trong cùng page_type của cùng user
- `camera_position` không được trùng lặp trong cùng scope

## 5) Upload file naming
Hiện đang dùng `Math.random()` để tạo tên file.
Khuyến nghị đổi sang:
- `crypto.randomUUID()`
hoặc
- `${user.id}/${page_type}/${Date.now()}-${random}`

để tránh trùng tên và dễ trace hơn.

## 6) README / Handover
Repo ban đầu chưa có tài liệu thực tế.
Đã bổ sung:
- `docs/SUPABASE_SCHEMA.md`
- `docs/UAT_CHECKLIST.md`
- `docs/HARDENING_NOTES.md`

## 7) Suggested next engineering tasks
1. confirm DB schema with business user
2. confirm RLS policies in Supabase dashboard
3. confirm storage bucket access model
4. run full UAT with sample records
5. fix export date formatting if business complains
6. refine UI based on UAT notes
