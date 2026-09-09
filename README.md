# Trung Đức Flow MVP

Web app cơ bản cho doanh nghiệp thiết kế và lắp đặt thang máy, theo luồng:

`Báo giá → Hợp đồng → Tiến độ thanh toán → Công nợ phải thu → Báo cáo tài chính`

## Chức năng hiện có

- Dashboard điều hành và luồng hồ sơ.
- Lập báo giá theo cấu hình thang máy: loại thang, tải trọng, điểm dừng, tốc độ, số lượng, đơn giá, chiết khấu và VAT.
- Danh sách hợp đồng, tiến độ triển khai và số tiền đã thu.
- Lịch thu tiền, công nợ đến hạn và quá hạn.
- Tổng hợp doanh thu, tiền thực thu và biểu đồ dòng tiền.
- Cơ sở dữ liệu D1 với các bảng báo giá, hợp đồng, lịch thanh toán và phiếu thu.
- Giao diện responsive cho máy tính và điện thoại.

## Chạy dự án

Yêu cầu Node.js 22.13 trở lên.

```bash
npm ci
npm run db:generate
npm run dev
```

Đây là bản MVP. Dữ liệu minh họa trên dashboard giúp nhìn ngay toàn bộ luồng; báo giá mới được lưu vào cơ sở dữ liệu khi triển khai.
