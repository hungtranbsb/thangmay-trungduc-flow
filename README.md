# Trung Đức Flow MVP

Web app cơ bản cho doanh nghiệp thiết kế và lắp đặt thang máy, theo luồng:

`Báo giá → Hợp đồng → Tiến độ thanh toán → Công nợ phải thu → Báo cáo tài chính`

## Chức năng hiện có

- Dashboard điều hành và luồng hồ sơ.
- Lập báo giá theo cấu hình thang máy: loại thang, tải trọng, điểm dừng, tốc độ, số lượng, đơn giá, chiết khấu và VAT.
- Danh sách hợp đồng, tiến độ triển khai và số tiền đã thu.
- Lịch thu tiền, công nợ đến hạn và quá hạn.
- Tổng hợp doanh thu, tiền thực thu và biểu đồ dòng tiền.
- Bản demo lưu báo giá mới trên chính trình duyệt đang sử dụng, chưa cần cấu hình cơ sở dữ liệu.
- Giao diện responsive cho máy tính và điện thoại.

## Chạy dự án

Yêu cầu Node.js 20.9 trở lên.

```bash
npm ci
npm run dev
```

## Triển khai trên Vercel

Import repository này vào Vercel và giữ các thiết lập mặc định:

- Framework Preset: `Next.js`
- Root Directory: `./`
- Build Command, Output Directory và Install Command: để mặc định
- Environment Variables: chưa cần nhập ở bản demo

Đây là bản MVP. Dữ liệu minh họa giúp nhìn ngay toàn bộ luồng; báo giá mới chỉ được lưu riêng trên từng trình duyệt. Khi chuyển sang dùng thật cho nhiều nhân viên, bước tiếp theo là nối Supabase để đồng bộ dữ liệu, tài khoản và phân quyền.
