# CCTV Inspection App

Ứng dụng Next.js + Supabase để nhập liệu và kiểm tra CCTV theo 2 scope:
- `general_check` (Kiểm tra chung)
- `data_entry` (Nhập dữ liệu)

## Tính năng hiện có
- Đăng nhập bằng Supabase Auth
- Bảo vệ route bằng middleware
- Bảng nhập liệu động: thêm dòng, xoá dòng, lưu hàng loạt
- Upload ảnh evidence lên bucket `cctv-evidence`
- Export Excel theo scope hiện tại
- Thông báo UI bằng `sonner`

## Cấu trúc dữ liệu hiện tại
App hiện đang bám vào:
- Table: `public.cctv_inspections`
- Storage bucket: `cctv-evidence`

Tham khảo chi tiết:
- `docs/SUPABASE_SCHEMA.md`
- `docs/UAT_CHECKLIST.md`
- `docs/HARDENING_NOTES.md`

## Chạy local
```bash
npm install
npm run dev
```

Mở http://localhost:3000

## Setup Supabase bắt buộc trước khi dùng
Nếu app báo các lỗi như:
- `Bucket not found`
- `Could not find the table 'public.cctv_inspections'`

thì cần chạy file sau trong **Supabase SQL Editor**:
- `supabase/setup.sql`

File này sẽ tạo:
- bảng `public.cctv_inspections`
- bucket `cctv-evidence`
- trigger `updated_at`
- RLS policies cơ bản cho MVP

## Biến môi trường cần có
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Flow nghiệp vụ hiện tại
1. Đăng nhập
2. Vào `Kiểm tra chung` hoặc `Nhập dữ liệu`
3. Thêm/sửa/xoá các dòng kiểm tra
4. Upload ảnh bằng chứng nếu có
5. Lưu dữ liệu
6. Export Excel theo đúng scope hiện tại

## Next Step khuyến nghị
1. Chạy UAT đầu-cuối với dữ liệu mẫu thật
2. Xác nhận schema Supabase + required fields
3. Verify RLS và storage policies
4. Duyệt file Excel export với business user
5. Gom các lỗi UI/UX cho refinement round
