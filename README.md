# CCTV Inspection App

Ứng dụng Next.js + Supabase để nhập liệu và kiểm tra CCTV theo 2 scope:
- `general_check` — Kiểm tra chung
- `data_entry` — Nhập dữ liệu

Ứng dụng hỗ trợ:
- đăng nhập người dùng
- nhập liệu theo bảng động
- upload ảnh bằng chứng
- lưu dữ liệu theo user
- export báo cáo Excel

---

## Demo / Screenshots

> Có thể thêm ảnh minh họa vào thư mục `docs/images/` và gắn tại đây sau.

Ví dụ:
```md
![Login](docs/images/login.png)
![Dashboard](docs/images/dashboard.png)
![Data Entry](docs/images/data-entry.png)
```

---

## Tính năng chính

- Đăng nhập bằng Supabase Auth
- Bảo vệ route bằng middleware
- Dashboard điều hướng nhanh
- Bảng nhập liệu động: thêm dòng, xoá dòng, lưu hàng loạt
- Upload ảnh bằng chứng lên bucket `cctv-evidence`
- Preview ảnh nhanh trong bảng
- Export Excel theo đúng scope hiện tại
- Thông báo trạng thái bằng `sonner`

---

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Database
- Supabase Storage
- Excel export (`exceljs`)

---

## Cấu trúc dữ liệu hiện tại

App hiện đang bám vào:
- **Table:** `public.cctv_inspections`
- **Storage bucket:** `cctv-evidence`

Tài liệu chi tiết:
- `docs/SUPABASE_SCHEMA.md`
- `docs/UAT_CHECKLIST.md`
- `docs/HARDENING_NOTES.md`
- `supabase/setup.sql`

---

## Quick Start

### 1. Clone repo
```bash
git clone https://github.com/tranquan1412/Check-CCTV.git
cd Check-CCTV/cctv-inspection-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Tạo file môi trường
Tạo file `.env.local` với 2 biến:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Setup Supabase
Mở **Supabase SQL Editor** và chạy file:
- `supabase/setup.sql`

File này sẽ tạo:
- bảng `public.cctv_inspections`
- bucket `cctv-evidence`
- trigger `updated_at`
- RLS policies cơ bản cho MVP

### 5. Run app
```bash
npm run dev
```

Mở:
- `http://localhost:3000`

---

## Hướng dẫn chạy Supabase

### Bắt buộc trước khi dùng app
Nếu app báo các lỗi như:
- `Bucket not found`
- `Could not find the table 'public.cctv_inspections'`
- lỗi lưu dữ liệu hoặc upload ảnh

thì gần như chắc chắn bạn chưa chạy:
- `supabase/setup.sql`

### Cách chạy setup.sql
1. Mở đúng project trong Supabase Dashboard
2. Vào **SQL Editor**
3. Mở file `supabase/setup.sql`
4. Copy toàn bộ nội dung
5. Paste vào SQL Editor
6. Bấm **Run**

### Sau khi chạy xong nên kiểm tra
- có bảng `public.cctv_inspections`
- có bucket `cctv-evidence`

---

## Hướng dẫn Login

1. Tạo user trong Supabase Auth
2. Đảm bảo user có password hợp lệ
3. Nếu project bật email confirmation, hãy confirm email trước khi login
4. Mở app và đăng nhập bằng email/password đã tạo

### Nếu login báo `Invalid API key`
Kiểm tra lại `.env.local`, đặc biệt:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Sau khi sửa env:
```bash
npm run dev
```
hoặc restart sạch dev server nếu cần.

---

## Hướng dẫn Upload ảnh

1. Vào `Kiểm tra chung` hoặc `Nhập dữ liệu`
2. Chọn một dòng dữ liệu
3. Upload ảnh bằng chứng
4. Nếu upload thành công:
   - ảnh sẽ có preview
   - URL sẽ được lưu vào DB

### Nếu upload lỗi
Các lỗi phổ biến:
- `Bucket not found` → chưa tạo bucket `cctv-evidence`
- policy storage chưa đúng
- user chưa đăng nhập

---

## Hướng dẫn Lưu dữ liệu

1. Nhập các field bắt buộc:
   - `camera_position`
   - `camera_date`
2. Bấm **Lưu dữ liệu**
3. App sẽ lưu theo đúng:
   - `page_type`
   - `created_by = auth user`

### Nếu lưu lỗi
Các lỗi phổ biến:
- `public.cctv_inspections` chưa tồn tại
- RLS chưa đúng
- dữ liệu thiếu field bắt buộc

---

## Hướng dẫn Export Excel

1. Nhập và lưu dữ liệu trước
2. Bấm **Xuất Excel**
3. File sẽ export theo đúng scope hiện tại:
   - `general_check`
   - hoặc `data_entry`

### Export hiện tại hỗ trợ
- STT
- Vị trí trên camera
- Ảnh bằng chứng
- Ngày trong camera
- Ghi chú

### Lưu ý
Route export hiện dùng `exceljs` để có thể nhúng ảnh thật vào báo cáo Excel thay vì chỉ xuất link.

---

## Flow nghiệp vụ hiện tại

1. Đăng nhập
2. Vào `Kiểm tra chung` hoặc `Nhập dữ liệu`
3. Thêm / sửa / xoá các dòng kiểm tra
4. Upload ảnh bằng chứng nếu có
5. Lưu dữ liệu
6. Export Excel theo đúng scope

---

## Cấu trúc thư mục chính

```text
app/
  api/export/route.ts
  dashboard/page.tsx
  data-entry/page.tsx
  general-check/page.tsx
  login/page.tsx
components/
  inspection-table.tsx
  navbar.tsx
docs/
  UAT_CHECKLIST.md
  SUPABASE_SCHEMA.md
  HARDENING_NOTES.md
supabase/
  setup.sql
types/
  inspection.ts
```

---

## Tài liệu vận hành

- `docs/SUPABASE_SCHEMA.md` — schema hiện tại của app
- `docs/UAT_CHECKLIST.md` — checklist test end-to-end
- `docs/HARDENING_NOTES.md` — các ghi chú bảo mật / RLS / storage / export

---

## Next Step khuyến nghị

1. Chạy UAT đầu-cuối với dữ liệu mẫu thật
2. Xác nhận schema Supabase + required fields với business
3. Verify RLS và storage policies
4. Duyệt file Excel export với người dùng nghiệp vụ
5. Gom các lỗi UI/UX cho refinement round

---

## Troubleshooting nhanh

### `Invalid API key`
Kiểm tra `.env.local` và restart app.

### `Bucket not found`
Chạy `supabase/setup.sql` hoặc tạo bucket `cctv-evidence`.

### `Could not find table public.cctv_inspections`
Chạy `supabase/setup.sql`.

### Export ra link thay vì ảnh
Kiểm tra route export và khả năng truy cập ảnh trong bucket.

---

## Repository

GitHub repo:
- `https://github.com/tranquan1412/Check-CCTV.git`
