# วิธีเริ่มต้นใช้งาน 3D Interior Designer

เนื่องจากโปรเจกต์นี้ต้องการเซิร์ฟเวอร์เว็บในการทำงาน ผมแนะนำให้ใช้เครื่องมือต่อไปนี้:

## วิธีที่ 1: ใช้ VS Code Live Server (วิธีที่แนะนำ)

1. ติดตั้งส่วนขยาย Live Server ใน VS Code:
   - เปิด VS Code Extensions (Ctrl+Shift+X)
   - ค้นหา "Live Server"
   - ติดตั้งส่วนขยาย Live Server โดย Ritwick Dey

2. เปิดไฟล์ index.html และคลิกที่ปุ่ม "Go Live" ที่มุมล่างขวาของ VS Code
   (หรือคลิกขวาที่ index.html และเลือก "Open with Live Server")

3. เว็บเบราว์เซอร์จะเปิดขึ้นโดยอัตโนมัติกับโปรเจกต์ 3D Interior Designer

## วิธีที่ 2: ใช้ Python HTTP Server

1. เปิด Command Prompt หรือ PowerShell ในโฟลเดอร์ของโปรเจกต์
2. รันคำสั่ง:

```
# Python 3
python -m http.server

# Python 2
python -m SimpleHTTPServer
```

3. เปิดเว็บเบราว์เซอร์และไปที่ `http://localhost:8000`

## วิธีที่ 3: ติดตั้ง Node.js และใช้ Vite

1. ติดตั้ง Node.js จาก https://nodejs.org/
2. เปิด Command Prompt หรือ PowerShell ในโฟลเดอร์ของโปรเจกต์
3. รันคำสั่งต่อไปนี้:

```
npm install
npm run dev
```

4. เปิดเว็บเบราว์เซอร์และไปที่ URL ที่แสดงบน console (โดยปกติคือ `http://localhost:3000`)

## คำแนะนำเพิ่มเติม

- โปรเจกต์นี้ใช้ Three.js สำหรับการแสดงผล 3D ซึ่งต้องการการทำงานผ่าน web server
- หากพบข้อผิดพลาด "Cross-Origin Request Blocked" ให้ใช้ web server แทนการเปิดไฟล์ HTML โดยตรง
- หากต้องการเพิ่มเฟอร์นิเจอร์ สามารถแก้ไขในฟังก์ชัน `initFurnitureData()` ในไฟล์ main.js
- หากต้องการปรับแต่งลักษณะการแสดงผล สามารถแก้ไขได้ในไฟล์ style.css

โปรดเพลิดเพลินกับการออกแบบภายในของคุณ!
