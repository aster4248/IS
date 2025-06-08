function selectItem(name) {
  // ถ้าเป็นไฟล์โมเดล 3D ให้แสดง model-viewer ตรงกลาง และหมุนกล้องได้
  if (name.endsWith('.glb') || name.endsWith('.gltf')) {
    document.getElementById('displayBox').innerHTML = `
      <model-viewer src="${name}" alt="3D model"
        auto-rotate
        camera-controls
        style="width: 100%; height: 100%; max-width: 400px; max-height: 400px; background: transparent;">
      </model-viewer>
    `;
    document.getElementById('selectedInfo').innerText = ""; // ลบข้อความ "คุณเลือก: โมเดล 3D"
  }
  // ถ้าเป็นไฟล์รูปภาพ
  else if (
    name.endsWith('.png') ||
    name.endsWith('.jpg') ||
    name.endsWith('.jpeg')
  ) {
    document.getElementById('displayBox').innerHTML = `
      <img src="${name}" alt="selected" style="max-width:100%;max-height:250px;">
    `;
    document.getElementById('selectedInfo').innerText = "คุณเลือก: รูปภาพ";
  }
  // กรณีอื่นๆ
  else {
    document.getElementById('displayBox').innerText = name;
    document.getElementById('selectedInfo').innerText = "คุณเลือก: " + name;
  }
}

// ฟังก์ชันสำหรับแสดง/ซ่อน gallery หมวด furniture
function toggleGallery() {
  var gallery = document.getElementById('gallerySection');
  var searchBox = document.getElementById('searchBox');
  searchBox.classList.add('active');
  setTimeout(function() {
    searchBox.classList.remove('active');
  }, 200);

  if (!gallery.classList.contains('show')) {
    gallery.classList.add('show');
  } else {
    gallery.classList.remove('show');
  }
}

// ฟังก์ชันสำหรับแสดง/ซ่อน gallery หมวด bedroom
function toggleGalleryBedroom() {
  var gallery = document.getElementById('gallerySectionBedroom');
  var searchBox = document.getElementById('searchBoxBedroom');
  searchBox.classList.add('active');
  setTimeout(function() {
    searchBox.classList.remove('active');
  }, 200);

  if (!gallery.classList.contains('show')) {
    gallery.classList.add('show');
  } else {
    gallery.classList.remove('show');
  }
}
