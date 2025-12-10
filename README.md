Muốn thấy rõ câu thư mục, trên web github hãy chọn chế độ CODE thay vì REVIEW
Thực hiện tải node về máy tính
 https://nodejs.org/en/download

Sau khi cài đặt chạy thử cmd
    node -v # Should print "v24.11.1".
    # Verify npm version:
    npm -v # Should print "11.6.2"

Di chuyển đến thư mục của project
 Cách 1: dùng lệnh cd rồi di chuyển vào thư mục .\christmas-gift
 Cách 2: mở thư mục đó như bình thường, trên đường dẫn nhập cmd nó cũng sẽ mở cmd nằm ngay thư mục

Lệnh CMD: 
 npm install -> nó sẽ thực hiện tải và download các thư viện được cấu hình ở trong package.json
 lệnh npm install xong sẽ tạo ra thư mục node_modules -> thư viện off

 Sau khi cài xong thực hiện lệnh
   npm run dev 
 Lưu ý lệnh cmd đề phải thực hiện ở thư mục gốc của dự án.

📁 Cấu Trúc Thư Mục Project
 christmas-gift-exchange/
├── app/
│   ├── layout.js
│   ├── page.js                    # Trang chủ
│   ├── create/
│   │   └── page.js                # Trang tạo quà
│   ├── open/
│   │   └── page.js                # Trang mở quà
│   ├── globals.css
│   └── api/
│       ├── gifts/
│       │   └── route.js           # API tạo quà
│       └── random-gift/
│       |    └── route.js           # API lấy quà ngẫu nhiên
│       ├── login/
│       │   └── route.js           # API đăng nhập
│       └── logout/
│           └── route.js           # API đăng xuất
├── components/
│   ├── Snowfall.jsx               # Hiệu ứng tuyết rơi
│   ├── Sparkles.jsx               # Hiệu ứng lấp lánh
│   ├── GiftBox.jsx                # Animation hộp quà
│   ├── Confetti.jsx               # Hiệu ứng confetti
│   └── GradientBackground.jsx     # Background gradient động
├── lib/
│   └── supabase.js                # Supabase client
├── hooks/
│   └── useConfetti.js             # Custom hook confetti
├── public/
│   └── images/
├── .env.local
├── next.config.js
├── tailwind.config.js
├── jsconfig.json
├── postcss.config.js               # Hỗ trợ load goabl.css và tailwind, file này rất quan trọng nếu không có sẽ bị lỗi CSS
├── package.json
├── middleware.js                 # quản lý phần authen
└── README.md


