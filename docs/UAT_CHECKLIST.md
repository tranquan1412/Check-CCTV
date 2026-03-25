# UAT Checklist — CCTV Inspection App

## A. Login / Auth
- [ ] Vào `/dashboard` khi chưa login -> bị redirect về `/login`
- [ ] Login đúng email/password -> vào dashboard thành công
- [ ] Login sai password -> báo lỗi rõ ràng
- [ ] Logout -> quay lại login và không vào protected page được nữa

## B. Dashboard
- [ ] Dashboard mở được sau login
- [ ] Link sang `Kiểm tra chung` hoạt động
- [ ] Link sang `Nhập dữ liệu` hoạt động
- [ ] Không có lỗi console khi vào dashboard

## C. Kiểm tra chung (`general_check`)
- [ ] Bấm `Thêm dòng` -> thêm 1 row mới
- [ ] STT tự tăng đúng
- [ ] Nhập `Vị trí trên camera`
- [ ] Chọn `Ngày trong camera`
- [ ] Nhập `Ghi chú`
- [ ] Lưu dữ liệu thành công
- [ ] Reload trang -> dữ liệu vẫn còn
- [ ] Xoá 1 dòng đã lưu -> dòng bị xoá thật

## D. Nhập dữ liệu (`data_entry`)
- [ ] Lặp lại các bước như `general_check`
- [ ] Dữ liệu `data_entry` không lẫn với `general_check`
- [ ] Reload trang -> chỉ thấy đúng dữ liệu của scope hiện tại

## E. Validation
- [ ] Để trống `Vị trí trên camera` -> không cho lưu
- [ ] Để trống `Ngày trong camera` -> không cho lưu
- [ ] Có thông báo lỗi rõ ràng ở đúng dòng/STT

## F. Upload ảnh evidence
- [ ] Upload ảnh JPG/PNG thành công
- [ ] Preview ảnh xuất hiện trong row
- [ ] Click ảnh mở đúng URL ảnh
- [ ] Ảnh thật sự nằm trong bucket `cctv-evidence`
- [ ] URL evidence được lưu vào DB

## G. Export Excel
- [ ] Export được file Excel từ `general_check`
- [ ] Export được file Excel từ `data_entry`
- [ ] Tên sheet đúng:
  - [ ] `KiemTraChung`
  - [ ] `NhapDuLieu`
- [ ] Cột trong file đúng thứ tự
- [ ] Dữ liệu trong file đúng với dữ liệu vừa nhập
- [ ] Ngày hiển thị đúng định dạng business mong muốn
- [ ] Link ảnh evidence xuất ra đúng

## H. Scope / Data isolation
- [ ] User A chỉ thấy dữ liệu của User A
- [ ] User B không thấy dữ liệu của User A
- [ ] Export của mỗi user chỉ chứa dữ liệu của user đó

## I. Storage / Access
- [ ] User login upload được ảnh
- [ ] User khác không được sửa/xoá ảnh trái phép nếu policy yêu cầu
- [ ] Anonymous user không thể truy cập các route protected

## J. UI/UX Review Round
- [ ] Bảng không bị vỡ layout
- [ ] Nút `Thêm dòng`, `Lưu dữ liệu`, `Xuất Excel` dễ hiểu
- [ ] Trạng thái loading rõ ràng
- [ ] Toast tiếng Việt dễ hiểu
- [ ] Preview ảnh đủ lớn để kiểm tra nhanh
- [ ] Mobile/tablet không vỡ nghiêm trọng (nếu cần hỗ trợ)

## K. Bug Log Template
Khi phát hiện lỗi, ghi theo mẫu:
- Page:
- Action:
- Expected:
- Actual:
- Screenshot:
- Data used:
