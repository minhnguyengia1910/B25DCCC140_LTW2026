# Nhanh như chớp – Bài 2

Đã hoàn thành Bài 1 và Bài 2 bằng React và CSS thuần.

## Chạy chương trình

```sh
npm install
npm start
```

Mở http://localhost:3000.

## Chức năng

- Bài 1: khung điều hướng, ngân hàng 18 câu hỏi, lọc, tìm kiếm, sắp xếp, chi tiết và trang 404.
- Bài 2: nhập tên người chơi; đếm ngược 3, 2, 1; chơi 15 câu chính thức, mỗi câu 15 giây; tính điểm và xếp sao; xem lại kết quả và chơi lại.

Trả lời đúng được điểm mức độ + số giây còn lại × 10. Sai hoặc hết giờ được 0 điểm và vẫn sang câu tiếp theo sau 1,5 giây.

Luồng chơi ở `src/pages/Play.js`: `countdown` → `answering` → `revealed` → câu tiếp theo hoặc kết quả. Các hàm tính điểm nằm trong `src/utils.js`. Các timer được dọn bằng cleanup của useEffect khi rời trang.

Trang `/history` vẫn chỉ có tiêu đề tạm. Trợ giúp, phím tắt, lịch sử, kỷ lục và tiêu đề tab theo câu để Bài 3.

## Kiểm tra

```sh
npm test -- --watchAll=false --runInBand
npm run build
```
