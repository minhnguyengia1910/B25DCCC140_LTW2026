# Nhanh như chớp – Bài 3

Đã hoàn thành Bài 1, Bài 2 và Bài 3 bằng React và CSS thuần.

## Chạy chương trình

```sh
npm install
npm start
```

Mở http://localhost:3000.

## Chức năng

- Bài 1: khung điều hướng, ngân hàng 18 câu hỏi, lọc, tìm kiếm, sắp xếp, chi tiết và trang 404.
- Bài 2: nhập tên người chơi; đếm ngược 3, 2, 1; chơi 15 câu chính thức, mỗi câu 15 giây; tính điểm và xếp sao; xem lại kết quả và chơi lại.
- Bài 3: ba quyền trợ giúp Đổi câu hỏi, Nhân đôi, Dừng giờ; chọn đáp án bằng phím mũi tên và Enter; lịch sử, thống kê, kỷ lục và tiêu đề tab theo câu đang chơi.

Trả lời đúng được điểm mức độ + số giây còn lại × 10. Sai hoặc hết giờ được 0 điểm và vẫn sang câu tiếp theo sau 1,5 giây.

Luồng chơi ở `src/pages/Play.js`: `countdown` → `answering` → `revealed` → câu tiếp theo hoặc kết quả. Các hàm tính điểm nằm trong `src/utils.js`. Timer và sự kiện bàn phím được dọn trong cleanup của useEffect khi rời trang.

Lịch sử lưu bằng localStorage với key `ltw_chop_history`. Trang `/history` hiển thị các lượt chơi theo điểm giảm dần, có thống kê và nút xóa từng lượt hoặc toàn bộ lịch sử.

## Kiểm tra

```sh
npm test -- --watchAll=false --runInBand
npm run build
```
