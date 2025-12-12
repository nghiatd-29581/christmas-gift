Thực hiện tải node về máy tính
 https://nodejs.org/en/download

Sau khi cài đặt chạy thử cmd
    node -v # Should print "v24.11.1".
    # Verify npm version:
    npm -v # Should print "11.6.2"

Thực hiện tải cloen source về máy
 Thực hiện tạo một file .evn.local
 gồm các key như sau
  # .env.local
NEXT_PUBLIC_SUPABASE_URL={URL được lấy từ trang của supabase}
NEXT_PUBLIC_SUPABASE_ANON_KEY={Key được lấy từ trang của supabase}
ADMIN_USERNAME=admin    # user để login trang mở quà
ADMIN_PASSWORD=meo   # pass để login trang mở quà

# Secret key for session (generate random string)
SESSION_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9


Di chuyển đến thư mục của project
 Cách 1: dùng lệnh cd rồi di chuyển vào thư mục .\christmas-gift
 Cách 2: mở thư mục đó như bình thường, trên đường dẫn nhập cmd nó cũng sẽ mở cmd nằm ngay thư mục

Lệnh CMD: 
 npm install -> nó sẽ thực hiện tải và download các thư viện được cấu hình ở trong package.json
 lệnh npm install xong sẽ tạo ra thư mục node_modules -> thư viện off

 Sau khi cài xong thực hiện lệnh
   npm run dev 
 Lưu ý lệnh cmd đề phải thực hiện ở thư mục gốc của dự án.

-----------------------------------------------------------------------
Thực hiện tạo table cho database Supabase

-- Tạo bảng gifts
CREATE TABLE gifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gift_code VARCHAR(10) UNIQUE NOT NULL,
  message TEXT NOT NULL,
  is_opened BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tạo index để tăng tốc query
CREATE INDEX idx_gift_code ON gifts(gift_code);
CREATE INDEX idx_is_opened ON gifts(is_opened);

-- Enable Row Level Security (optional, có thể bật sau)
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;

-- Policy cho phép mọi người đọc và tạo
CREATE POLICY "Enable read access for all users" ON gifts
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON gifts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON gifts
  FOR UPDATE USING (true);

-----STORE SQL----
-- Create a PostgreSQL function for atomic random gift selection
-- This prevents race conditions by locking the selected row

CREATE OR REPLACE FUNCTION get_random_gift()
RETURNS TABLE (
  id UUID,
  gift_code VARCHAR(10),
  message TEXT,
  is_opened BOOLEAN,
  created_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
AS $$
DECLARE
  selected_gift_id UUID;
BEGIN
  -- Step 1: Select a random unopened gift ID and lock it
  -- FOR UPDATE SKIP LOCKED prevents two requests from getting the same gift
  SELECT g.id INTO selected_gift_id
  FROM gifts g
  WHERE g.is_opened = false
  ORDER BY RANDOM()
  LIMIT 1
  FOR UPDATE SKIP LOCKED;  -- KEY: Lock this row, skip if already locked
  
  -- Step 2: Check if we found a gift
  IF selected_gift_id IS NULL THEN
    RETURN;  -- No unopened gifts available
  END IF;
  
  -- Step 3: Update the gift as opened
  UPDATE gifts
  SET is_opened = true
  WHERE gifts.id = selected_gift_id;
  
  -- Step 4: Return the gift data
  RETURN QUERY
  SELECT 
    g.id,
    g.gift_code,
    g.message,
    g.is_opened,
    g.created_at
  FROM gifts g
  WHERE g.id = selected_gift_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_random_gift() TO anon;
GRANT EXECUTE ON FUNCTION get_random_gift() TO authenticated;


-----------SQL SCRIPT----------------
#script này dành cho việc push realtime
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│  Tablet     │         │   Supabase   │         │  Phone B    │
│  (Anh A)    │───────▶│   Realtime   │────────▶│  (Anh B)    │
│  /open      │  Mở quà │   Channel    │  Push   │  /result    │
└─────────────┘         └──────────────┘         └─────────────┘

-- Enable Realtime for gifts table
-- Run this in Supabase SQL Editor

-- 1. Enable realtime on the gifts table
ALTER PUBLICATION supabase_realtime ADD TABLE gifts;

-- 2. Create a new table to track opened gifts for broadcasting
CREATE TABLE IF NOT EXISTS gift_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gift_code VARCHAR(10) NOT NULL,
  message TEXT NOT NULL,
  opened_at TIMESTAMPTZ DEFAULT NOW(),
  event_type VARCHAR(20) DEFAULT 'opened'
);

-- 3. Enable RLS on gift_events
ALTER TABLE gift_events ENABLE ROW LEVEL SECURITY;

-- 4. Allow everyone to read gift_events
CREATE POLICY "Enable read access for all users" ON gift_events
  FOR SELECT USING (true);

-- 5. Allow insert for all users (when opening gifts)
CREATE POLICY "Enable insert for all users" ON gift_events
  FOR INSERT WITH CHECK (true);

-- 6. Enable realtime for gift_events
ALTER PUBLICATION supabase_realtime ADD TABLE gift_events;

-- 7. Auto-delete old events after 1 hour (optional - keeps table clean)
CREATE OR REPLACE FUNCTION delete_old_gift_events()
RETURNS void AS $$
BEGIN
  DELETE FROM gift_events 
  WHERE opened_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;


-----------------------------------------------------------------------
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
└── README.md