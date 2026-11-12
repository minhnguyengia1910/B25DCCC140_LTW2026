# Nhanh như chớp – Bài 1

Dự án hiện chỉ hoàn thành Bài 1: khung ứng dụng và ngân hàng câu hỏi.

## Chạy chương trình

```sh
npm install
npm start
```

Mở http://localhost:3000/questions.

## Chức năng Bài 1

- Nested routes với Layout, Outlet và NavLink.
- Tải 18 câu hỏi bằng axios; xử lý loading, lỗi và hủy request khi unmount.
- Lọc Tất cả / Chính thức / Dự bị.
- Tìm kiếm không phân biệt hoa thường, kết hợp với lọc và sắp xếp.
- Xem chi tiết, hiện/ẩn đáp án và giải thích.
- Xử lý ID không tồn tại và trang 404.

Các trang `/`, `/play`, `/result`, `/history` chỉ có tiêu đề tạm. Bài 2 và Bài 3 sẽ làm sau.

## Kiểm tra

```sh
npm test -- --watchAll=false --runInBand
npm run build
```
