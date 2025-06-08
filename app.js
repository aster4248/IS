function selectItem(name) {
  const modelArea = document.getElementById('modelArea');
  // ลบโมเดลเดิมแต่ไม่ลบ floor-3d
  Array.from(modelArea.children).forEach(child => {
    if (!child.classList.contains('floor-3d')) modelArea.removeChild(child);
  });

  if (name && (name.endsWith('.glb') || name.endsWith('.gltf'))) {
    const modelViewer = document.createElement('model-viewer');
    modelViewer.setAttribute('src', name);
    modelViewer.setAttribute('camera-controls', '');
    modelViewer.setAttribute('auto-rotate', '');
    modelViewer.setAttribute('camera-orbit', '0deg 75deg 2.5m');
    modelViewer.setAttribute('min-camera-orbit', 'auto 30deg 1m');
    modelViewer.setAttribute('max-camera-orbit', 'auto 120deg 10m');
    modelViewer.setAttribute('min-field-of-view', '20deg');
    modelViewer.setAttribute('max-field-of-view', '60deg');
    modelViewer.style.width = "400px";
    modelViewer.style.height = "400px";
    modelViewer.style.position = "absolute";
    modelViewer.style.left = "50%";
    modelViewer.style.bottom = "160px";
    modelViewer.style.transform = "translateX(-50%)";
    modelViewer.style.zIndex = "2";
    modelViewer.style.background = "transparent";
    modelArea.appendChild(modelViewer);
  }
}

// ฟังก์ชัน drag & drop
function makeDraggable(element, container) {
  let isDragging = false;
  let offsetX, offsetY;

  element.onmousedown = function(e) {
    isDragging = true;
    const rect = element.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    element.style.cursor = "grabbing";
    document.onmousemove = function(e) {
      if (!isDragging) return;
      const containerRect = container.getBoundingClientRect();
      let x = e.clientX - containerRect.left - offsetX + element.offsetWidth/2;
      let y = e.clientY - containerRect.top - offsetY + element.offsetHeight/2;
      // จำกัดไม่ให้ออกนอกพื้นที่
      x = Math.max(element.offsetWidth/2, Math.min(container.offsetWidth - element.offsetWidth/2, x));
      y = Math.max(element.offsetHeight/2, Math.min(container.offsetHeight - element.offsetHeight/2, y));
      element.style.left = x + "px";
      element.style.top = y + "px";
    };
    document.onmouseup = function() {
      isDragging = false;
      element.style.cursor = "grab";
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
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

function setView(orbit) {
  const modelViewer = document.querySelector('model-viewer');
  if (modelViewer) {
    modelViewer.setAttribute('camera-orbit', orbit);
    modelViewer.cameraOrbit = orbit; // สำหรับบางเวอร์ชัน
  }
}
