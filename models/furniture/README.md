# คำแนะนำสำหรับการเพิ่มโมเดล 3D

## การเตรียมโมเดลจาก Blender

1. **ในการส่งออกโมเดลจาก Blender**
   - ไปที่ `File > Export > glTF 2.0 (.glb/.gltf)`
   - แนะนำให้ใช้รูปแบบ `.glb` เนื่องจากเป็นไฟล์เดียวที่รวมทั้งเจโอเมทรีและเท็กซ์เจอร์
   - ใช้การตั้งค่าต่อไปนี้:
     - ✅ +Y Up (เพื่อให้ตรงกับระบบพิกัดของ Three.js)
     - ✅ Apply Modifiers
     - ✅ Include textures
     - ✅ Compression (ถ้าต้องการลดขนาดไฟล์)

2. **ข้อแนะนำเกี่ยวกับโมเดล**
   - ใช้จำนวนโพลีต่ำ (Low Poly) ไม่เกิน 10,000 polygons ต่อโมเดล
   - รักษาขนาดเท็กซ์เจอร์ไม่เกิน 1024x1024 pixels
   - ลดความซับซ้อนของวัสดุ (Materials)
   - ตั้งชื่อโมเดลที่มีความหมายและใช้เฉพาะตัวอักษรภาษาอังกฤษ ตัวเลข และเครื่องหมาย underscore (_)

## การเพิ่มโมเดลในแอปพลิเคชัน

1. **เพิ่มไฟล์โมเดล**
   - วางไฟล์ `.glb` หรือ `.gltf` ใน `/models/furniture/`

2. **อัปเดตข้อมูลเฟอร์นิเจอร์**
   - แก้ไขฟังก์ชัน `initFurnitureData()` ใน `main.js`
   - กำหนด `hasModel: true` และระบุพาธไปยังโมเดล `modelPath: '/models/furniture/[ชื่อโมเดล].glb'`
   - กำหนดค่า `scale` และ `rotation` ตามความเหมาะสม

3. **ตัวอย่างการเพิ่มข้อมูลโมเดล**
   ```javascript
   {
     id: 'modern-sofa',
     name: 'โซฟาโมเดิร์น',
     nameTh: 'โซฟาโมเดิร์น',
     nameEn: 'Modern Sofa',
     type: 'sofa',
     modelPath: '/models/furniture/modern_sofa.glb',
     hasModel: true,
     preview: '/images/furniture/modern_sofa.jpg',
     color: '#4682B4',
     size: { width: 2.5, height: 0.8, depth: 1 },
     scale: { x: 1, y: 1, z: 1 },
     rotation: { x: 0, y: 0, z: 0 }
   }
   ```
