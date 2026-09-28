# Contra Mario: Ôn Tập Kiến Thức 🎮⭐

Trò chơi hành động platformer kết hợp giữa Contra và Super Mario Bros với hệ thống câu hỏi trắc nghiệm ôn tập kiến thức theo chủ đề, rào chắn cổng phong ấn, bộ chỉ số HP & Mana, kỹ năng khiên hộ thể / đạn nổ lớn và bộ quản lý CRUD tùy chỉnh đề thi linh hoạt.

---

## 🚀 Hướng Dẫn Đẩy Lên GitHub & Triển Khai GitHub Pages (Miễn Phí)

Dự án đã được build sẵn đầy đủ các tệp tĩnh **HTML, JS, CSS** tương thích 100% với GitHub Pages. Bạn có 2 cách cực kỳ nhanh chóng để đưa game lên mạng:

### 🌟 Cách 1: Sử dụng thư mục `docs/` đã build sẵn (Đơn giản nhất - Không cần cài đặt gì)

Toàn bộ mã nguồn tĩnh đã được đóng gói sẵn trong thư mục `docs/` (chứa `index.html`, thư mục `assets/` gồm JS, CSS, hình ảnh với đường dẫn tương đối `./`).

1. **Khởi tạo và đẩy lên GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Contra Mario Game"
   git branch -M main
   git remote add origin https://github.com/<tai-khoan-cua-ban>/<ten-repo>.git
   git push -u origin main
   ```

2. **Kích hoạt GitHub Pages:**
   - Truy cập vào repository của bạn trên GitHub.
   - Bấm vào mục **Settings** (Cài đặt) -> chọn thẻ **Pages** ở thanh bên trái.
   - Tại mục **Build and deployment** -> **Source**: Chọn **Deploy from a branch**.
   - Tại dòng **Branch**: Chọn nhánh `main` và chọn thư mục `/docs` (thay vì `/root`).
   - Bấm **Save**. Sau 1-2 phút, game sẽ chạy online tại: `https://<tai-khoan-cua-ban>.github.io/<ten-repo>/`!

---

### ⚙️ Cách 2: Triển khai tự động bằng GitHub Actions (Chuyên nghiệp)

Dự án đã được tích hợp sẵn tệp cấu hình `.github/workflows/deploy.yml`:

1. Đẩy mã nguồn lên GitHub như bình thường.
2. Vào **Settings** -> **Pages** trên GitHub repository.
3. Tại mục **Source**, chọn **GitHub Actions**.
4. GitHub sẽ tự động biên dịch và triển khai game mỗi khi bạn push code mới!

---

## 🛠️ Chạy Thử & Phát Triển Cục Bộ (Localhost)

Nếu muốn chỉnh sửa code và chạy trên máy cá nhân:

```bash
# 1. Cài đặt các thư viện cần thiết
npm install

# 2. Chạy môi trường phát triển (Dev server)
npm run dev

# 3. Tạo bản build mới nhất ra thư mục dist/
npm run build

# 4. Cập nhật thư mục docs/ để đẩy lên GitHub Pages
cp -r dist/* docs/
```

---

## 🕹️ Phím Điều Khiển Game

- **A / D hoặc Mũi tên Trái / Phải**: Chạy trái / phải.
- **W / Phím Space / Mũi tên Lên**: Nhảy lên các bậc địa hình.
- **S / Mũi tên Xuống**: Cúi người né đường đạn của quái vật.
- **Phím J hoặc Click chuột**: Bắn đạn thẳng hoặc bắn chéo.
- **Phím K (Tốn 35 Mana)**: Kích hoạt Kỹ năng Mana (Khiên hộ thể bất tử 6s hoặc Đạn nổ lớn).
- **Phím L**: Chuyển đổi giữa 2 loại kỹ năng Mana (Khiên hộ thể / Đạn nổ lớn).
- **Phím 1, 2, 3, 4**: Trả lời trắc nghiệm nhanh khi chạm Cổng Phong Ấn / Khối '?'.
