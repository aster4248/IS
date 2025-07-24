// Use THREE from global scope (CDN)
// const THREE is now available globally

// Language system
class LanguageManager {
  constructor() {
    // Load language preference from localStorage or default to Thai
    this.currentLanguage = localStorage.getItem('language') || 'th';
    this.translations = {
      th: {
        'Home': 'หน้าแรก',
        'Examples': 'ตัวอย่าง',
        'Documents': 'เอกสาร', 
        'Gallery': 'ผลงาน',
        'About': 'เกี่ยวกับ',
        'Get Started': 'เริ่มต้นใช้งาน',
        'Dark': 'มืด',
        'Light': 'สว่าง'
      },
      en: {
        'หน้าแรก': 'Home',
        'ตัวอย่าง': 'Examples',
        'เอกสาร': 'Documents',
        'ผลงาน': 'Gallery',
        'เกี่ยวกับ': 'About',
        'เริ่มต้นใช้งาน': 'Get Started',
        'มืด': 'Dark',
        'สว่าง': 'Light'
      }
    };
  }

  switchLanguage(language) {
    this.currentLanguage = language;
    localStorage.setItem('language', language);
    this.updateElements();
  }

  updateElements() {
    const elements = document.querySelectorAll('[data-en][data-th]');
    elements.forEach(element => {
      const text = this.currentLanguage === 'en' ? element.dataset.en : element.dataset.th;
      element.textContent = text;
    });

    // Update placeholders
    const inputs = document.querySelectorAll('[data-en-placeholder][data-th-placeholder]');
    inputs.forEach(input => {
      const placeholder = this.currentLanguage === 'en' ? input.dataset.enPlaceholder : input.dataset.thPlaceholder;
      input.placeholder = placeholder;
    });

    // Update language selector if it exists
    const languageSelect = document.getElementById('universal-language-select');
    if (languageSelect) {
      languageSelect.value = this.currentLanguage;
    }

    console.log('Language updated to:', this.currentLanguage);
  }

  // Initialize language on page load
  init() {
    this.updateElements();
  }
}

// Theme manager
class ThemeManager {
  constructor() {
    this.currentTheme = 'light';
    this.init();
  }

  init() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  toggle() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}

// Navigation manager
class NavigationManager {
  constructor() {
    this.currentPage = 'welcome';
    this.scrollTimeout = null;
    this.init();
  }

  init() {
    // Smooth scroll navigation
    window.addEventListener('wheel', (e) => {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        if (this.currentPage === 'welcome') {
          this.handleWelcomePageScroll(e.deltaY);
        }
      }, 100);
    });

    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('href').substring(1);
        this.scrollToSection(section);
      });
    });

    // Get started button
    const getStartedBtn = document.querySelector('.get-started-btn');
    if (getStartedBtn) {
      getStartedBtn.addEventListener('click', () => {
        this.showPage('creative');
      });
    }
  }

  handleWelcomePageScroll(deltaY) {
    const sections = ['welcome', 'examples', 'documents', 'gallery', 'about'];
    const currentIndex = sections.indexOf(this.getCurrentSection());
    
    if (deltaY > 0 && currentIndex < sections.length - 1) {
      this.scrollToSection(sections[currentIndex + 1]);
    } else if (deltaY < 0 && currentIndex > 0) {
      this.scrollToSection(sections[currentIndex - 1]);
    }
  }

  getCurrentSection() {
    const sections = document.querySelectorAll('.section');
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    for (let section of sections) {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
        return section.id;
      }
    }
    return 'welcome';
  }

  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      this.updateActiveNavLink(sectionId);
      this.updateBackground(sectionId);
    }
  }

  updateActiveNavLink(sectionId) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[href="#${sectionId}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  updateBackground(sectionId) {
    const bg1 = document.querySelector('.background-1');
    const bg2 = document.querySelector('.background-2');
    
    if (sectionId === 'examples' || sectionId === 'gallery') {
      bg2.style.transform = 'translateY(0)';
    } else {
      bg2.style.transform = 'translateY(100%)';
    }
  }

  showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById(`${pageName}-page`);
    if (targetPage) {
      targetPage.classList.add('active');
      this.currentPage = pageName;
      
      // ถ้าเป็นหน้า editor ให้ทำการปรับขนาดหน้าจอให้ถูกต้อง
      if (pageName === 'editor' && window.editorApp) {
        // รอเวลาสักครู่เพื่อให้ DOM ได้อัปเดตขนาด
        setTimeout(() => {
          console.log('Triggering window resize for editor page');
          // ตรวจสอบว่า viewport มีขนาดถูกต้อง
          const viewport = document.getElementById('viewport');
          if (viewport) {
            console.log('Viewport dimensions:', viewport.clientWidth, 'x', viewport.clientHeight);
          }
          window.editorApp.onWindowResize();
        }, 200);
      }
    }
  }
}

// Examples carousel
class ExamplesCarousel {
  constructor() {
    this.currentIndex = 0;
    this.items = document.querySelectorAll('.example-item');
    this.indicators = document.querySelectorAll('.indicator');
    this.autoplayInterval = null;
    this.init();
  }

  init() {
    this.startAutoplay();
    
    // Click handlers for indicators
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        this.goToSlide(index);
      });
    });
  }

  goToSlide(index) {
    this.items[this.currentIndex].classList.remove('active');
    this.indicators[this.currentIndex].classList.remove('active');
    
    this.currentIndex = index;
    
    this.items[this.currentIndex].classList.add('active');
    this.indicators[this.currentIndex].classList.add('active');
  }

  nextSlide() {
    const nextIndex = (this.currentIndex + 1) % this.items.length;
    this.goToSlide(nextIndex);
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }
}

// Projects manager
class ProjectsManager {
  constructor() {
    this.projects = JSON.parse(localStorage.getItem('projects') || '[]');
    this.init();
  }

  init() {
    this.renderProjects();
    
    // Create project button
    const createBtn = document.querySelector('.create-project-btn');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        this.showCreateModal();
      });
    }

    // Modal handlers
    this.initModal();
  }

  renderProjects() {
    const grid = document.querySelector('.projects-grid');
    const emptyState = document.getElementById('empty-state');
    
    if (this.projects.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      
      // Clear existing project items except template
      const existingItems = grid.querySelectorAll('.project-item:not([style*="display: none"])');
      existingItems.forEach(item => item.remove());
      
      // Add projects
      this.projects.forEach(project => {
        const projectElement = this.createProjectElement(project);
        grid.appendChild(projectElement);
      });
    }
  }

  createProjectElement(project) {
    const element = document.createElement('div');
    element.className = 'project-item';
    element.innerHTML = `
      <div class="project-thumbnail">
        <div class="project-image" style="background: ${project.color}"></div>
        <button class="fav-model-btn ${project.favorite ? 'active' : ''}" title="${project.favorite ? 'Remove from Favorites' : 'Add to Favorites'}">★</button>
      </div>
      <div class="project-info">
        <h4 class="project-name">${project.name}</h4>
        <p class="project-date">Created: ${project.date}</p>
      </div>
    `;
    
    // Open project on click
    element.addEventListener('click', (e) => {
      // Don't open project if clicking the favorite button
      if (!e.target.closest('.fav-model-btn')) {
        this.openProject(project);
      }
    });
    
    // Add favorite button functionality
    const favBtn = element.querySelector('.fav-model-btn');
    if (favBtn) {
      favBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent opening project
        project.favorite = !project.favorite;
        favBtn.classList.toggle('active');
        favBtn.title = project.favorite ? 'Remove from Favorites' : 'Add to Favorites';
        
        // Update project in localStorage
        this.updateProject(project);
        
        // Show feedback
        this.showFeedback(project.favorite ? 'Added to favorites' : 'Removed from favorites');
      });
    }
    
    return element;
  }

  showCreateModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.add('open');
  }

  hideCreateModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('open');
    
    // Reset modal
    document.getElementById('step-1').style.display = 'block';
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('project-name-input').value = '';
    document.querySelectorAll('.size-option').forEach(option => {
      option.classList.remove('selected');
    });
  }

  initModal() {
    const modal = document.getElementById('project-modal');
    const cancelBtn = document.getElementById('cancel-project');
    const nextBtn = document.getElementById('next-step');
    const backBtn = document.getElementById('back-step');
    const createBtn = document.getElementById('create-project');
    const backToProjectsBtn = document.getElementById('back-to-projects');
    
    // Cancel/close modal
    cancelBtn.addEventListener('click', () => {
      this.hideCreateModal();
    });
    
    // Back to projects button (new back button)
    if (backToProjectsBtn) {
      backToProjectsBtn.addEventListener('click', () => {
        this.hideCreateModal();
      });
    }
    
    // Click outside to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.hideCreateModal();
      }
    });
    
    // Next step
    nextBtn.addEventListener('click', () => {
      const projectName = document.getElementById('project-name-input').value.trim();
      if (projectName) {
        document.getElementById('step-1').style.display = 'none';
        document.getElementById('step-2').style.display = 'block';
      }
    });
    
    // Back step
    backBtn.addEventListener('click', () => {
      document.getElementById('step-2').style.display = 'none';
      document.getElementById('step-1').style.display = 'block';
    });
    
    // Size selection
    document.querySelectorAll('.size-option').forEach(option => {
      option.addEventListener('click', () => {
        document.querySelectorAll('.size-option').forEach(opt => {
          opt.classList.remove('selected');
        });
        option.classList.add('selected');
      });
    });
    
    // Create project
    createBtn.addEventListener('click', () => {
      const projectName = document.getElementById('project-name-input').value.trim();
      const selectedSize = document.querySelector('.size-option.selected');
      
      if (projectName && selectedSize) {
        this.createProject(projectName, selectedSize.dataset.size);
      }
    });
  }

  createProject(name, size) {
    const project = {
      id: Date.now(),
      name: name,
      size: size,
      date: new Date().toISOString().split('T')[0],
      color: this.getRandomColor()
    };
    
    this.projects.push(project);
    localStorage.setItem('projects', JSON.stringify(this.projects));
    
    this.hideCreateModal();
    this.renderProjects();
    
    // Open the editor
    this.openProject(project);
  }

  openProject(project) {
    // Store current project
    localStorage.setItem('currentProject', JSON.stringify(project));
    
    // Update project title
    document.getElementById('project-title').textContent = project.name;
    
    // Navigate to editor
    const nav = new NavigationManager();
    nav.showPage('editor');
    
    // เพิ่มการหน่วงเวลาเล็กน้อยเพื่อให้แน่ใจว่า DOM ได้รับการอัปเดตและ viewport มีขนาดที่ถูกต้องก่อนที่จะเริ่ม 3D scene
    setTimeout(() => {
      // Initialize 3D scene
      if (window.editorApp) {
        console.log('Initializing 3D scene for project:', project.name);
        window.editorApp.initScene(project);
      }
    }, 100); // รอ 100ms
  }

  updateProject(project) {
    // Find and update the project in the array
    const index = this.projects.findIndex(p => p.id === project.id);
    if (index !== -1) {
      this.projects[index] = project;
      // Update in localStorage
      localStorage.setItem('projects', JSON.stringify(this.projects));
      return true;
    }
    return false;
  }

  showFeedback(message, type = 'success') {
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = `feedback ${type}`;
    feedback.textContent = message;
    document.body.appendChild(feedback);
    
    // Show and then hide after a delay
    setTimeout(() => {
      feedback.classList.add('show');
      setTimeout(() => {
        feedback.classList.remove('show');
        setTimeout(() => feedback.remove(), 300);
      }, 2000);
    }, 100);
  }

  getRandomColor() {
    const colors = [
      'linear-gradient(45deg, #667eea, #764ba2)',
      'linear-gradient(45deg, #f093fb, #f5576c)',
      'linear-gradient(45deg, #4facfe, #00f2fe)',
      'linear-gradient(45deg, #43e97b, #38f9d7)',
      'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
      'linear-gradient(45deg, #45b7d1, #96ceb4)'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

// 3D Editor
class EditorApp {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.currentProject = null;
    this.undoStack = [];
    this.redoStack = [];
    this.furnitureData = this.initFurnitureData();
    this.init();
  }

  init() {
    this.currentTool = 'select';
    this.copiedObjects = null;
    this.selectedObjects = [];
    
    this.initEventListeners();
    this.initKeyboardShortcuts();
    
    // Check if we need to load existing project
    const currentProject = localStorage.getItem('currentProject');
    if (currentProject) {
      try {
        const project = JSON.parse(currentProject);
        this.initScene(project);
      } catch (e) {
        console.error('Failed to load existing project:', e);
      }
    }
  }

  initScene(project) {
    this.currentProject = project;
    const canvas = document.getElementById('three-canvas');
    
    if (!canvas) {
      console.error('Canvas element not found!');
      return;
    }
    
    // ตรวจสอบว่า viewport มีขนาดที่ถูกต้อง
    const viewport = document.getElementById('viewport');
    if (viewport) {
      console.log('Viewport size:', viewport.clientWidth, 'x', viewport.clientHeight);
      if (viewport.clientWidth === 0 || viewport.clientHeight === 0) {
        console.warn('Viewport size is zero, forcing size.');
        viewport.style.minHeight = '500px';
        viewport.style.minWidth = '300px';
      }
    }
    
    // ตรวจสอบขนาดของ canvas
    console.log('Canvas size:', canvas.clientWidth, 'x', canvas.clientHeight);
    
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);

    // Camera setup เหมือนเว็บอ้างอิง
    this.camera = new THREE.PerspectiveCamera(65, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    this.camera.position.set(10, 8, 10); // มุมมองเฉียงเริ่มต้น
    this.camera.lookAt(0, 0, 0);

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    // Initialize grid and floor with the project size
    const areaSize = project.size || 'medium'; // Default to medium if not specified
    
    // Set the area size dropdown to match the project size
    const areaSizeSelect = document.getElementById('area-size-select');
    if (areaSizeSelect) {
      areaSizeSelect.value = areaSize;
    }
    
    // Create the grid and floor
    this.updateAreaSize(areaSize);

      // Add OrbitControls - แก้ไขการทำงานของมุมกล้อง
    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      
      // ปรับแต่งค่าให้เหมือนเว็บ https://aster4248.github.io/IS/ (ไม่ใช้การควบคุมแบบ Blender)
      this.controls.enableDamping = true; // ทำให้การเคลื่อนที่ลื่นไหลขึ้น
      this.controls.dampingFactor = 0.15; // เพิ่มความลื่นไหล
      this.controls.screenSpacePanning = true; // ปรับการ pan ให้เป็นแบบ screen space
      
      // ล็อก view point ไว้ที่จุดศูนย์กลาง
      this.controls.target.set(0, 0, 0); // กำหนดจุดศูนย์กลางที่กล้องจะมองตลอดเวลา
      
      // ปรับการควบคุมเมาส์เพื่อให้สามารถหมุนรอบ view point ได้
      this.controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE, // คลิกซ้าย = หมุนรอบ view point
        MIDDLE: THREE.MOUSE.DOLLY, // คลิกกลาง = ซูม
        RIGHT: THREE.MOUSE.PAN // คลิกขวา = เลื่อนพื้นที่วางโมเดล
      };
      
      // แก้ไขบัคการหมุนกล้อง - จำกัดการหมุนในพื้นที่ที่เหมาะสม
      this.controls.minPolarAngle = Math.PI * 0.05; // ป้องกันการหมุนลงใต้พื้น
      this.controls.maxPolarAngle = Math.PI * 0.85; // จำกัดไม่ให้มองใต้พื้นมากเกินไป
      
      // เปิดให้หมุนในแนวราบได้อิสระ 360 องศา
      this.controls.minAzimuthAngle = -Infinity; // ไม่จำกัดการหมุนแนวราบ
      this.controls.maxAzimuthAngle = Infinity; // สามารถหมุนได้รอบทิศทาง
      
      // แก้ไขบัคเมื่อเมาส์ออกจากพื้นที่แล้วยังหมุนต่อ
      this.controls.autoRotate = false; // ปิดการหมุนอัตโนมัติ
      this.controls.enableKeys = false; // ปิดการใช้คีย์บอร์ดเพื่อควบคุม (ป้องกันการหมุนต่อเมื่อกดปุ่มค้าง)      // เปิดใช้งานการหมุนแบบ orbit (หมุนรอบวัตถุที่เป็นจุดศูนย์กลาง)
      this.controls.enableRotate = true; // เปิดการหมุนรอบ view point
      this.controls.enablePan = true; // อนุญาตให้เลื่อนพื้นที่วางโมเดล
      
      // ปรับความเร็วของการควบคุมต่างๆ
      this.controls.enableZoom = true; // เปิดการซูม
      this.controls.zoomSpeed = 1.2; // เพิ่มความเร็วในการซูมเล็กน้อย
      this.controls.rotateSpeed = 0.8; // ปรับความเร็วในการหมุนรอบ view point
      this.controls.panSpeed = 1.0; // ปรับความเร็วในการเลื่อนพื้นที่วางโมเดล
      this.controls.minDistance = 2; // กำหนดระยะใกล้สุดที่ซูมเข้าได้
      this.controls.maxDistance = 30; // กำหนดระยะไกลสุดที่ซูมออกได้
      
      // กำหนดจุด view point ที่จะใช้เป็นศูนย์กลางในการขยับมุมกล้อง
      this.controls.target.set(0, 0, 0); // กำหนดจุดเป้าหมายของกล้อง (view point)
    } else {
      // Fallback to manual mouse controls if OrbitControls is not available
      this.initMouseControls();
      console.warn('OrbitControls not found, using fallback mouse controls');
    }
    
    // Start render loop
    this.animate();

    // Handle resize
    window.addEventListener('resize', () => this.onWindowResize());
    
    // ป้องกัน context menu เมื่อคลิกขวาที่ canvas
    document.getElementById('three-canvas').addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    // Setup rotation controls
    this.setupRotationControls();

    // Add axis helper for orientation with subtle colors
    const axesHelper = new THREE.AxesHelper(5);
    // Make the axes more subtle with semi-transparent colors
    if (axesHelper.material) {
      axesHelper.material.opacity = 0.5;
      axesHelper.material.transparent = true;
    }
    this.scene.add(axesHelper);
  }

  initMouseControls() {
    const canvas = document.getElementById('three-canvas');
    let isDragging = false;
    let isRightDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let viewPointDragging = false;

    canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) { // คลิกซ้าย
        isDragging = true;
        viewPointDragging = true;
      } else if (e.button === 2) { // คลิกขวา
        isRightDragging = true;
      }
      previousMousePosition = { x: e.clientX, y: e.clientY };
      
      // ป้องกันการเลือกข้อความ
      e.preventDefault();
    });

    canvas.addEventListener('mousemove', (e) => {
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
      };
      
      // หากคลิกซ้ายและลาก ใช้สำหรับหมุนรอบ view point
      if (isDragging && viewPointDragging) {
        // คำนวณการหมุนรอบ view point จากการลากเมาส์
        const viewPoint = new THREE.Vector3(0, 0, 0); // จุดศูนย์กลางที่จะหมุนรอบ
        
        // คำนวณการหมุนจากการเลื่อนเมาส์ (ลากซ้าย-ขวาหมุนแกน Y, ลากขึ้น-ลงหมุนแกน X)
        const rotationSpeed = 0.01;
        const deltaRotationQuaternion = new THREE.Quaternion()
          .setFromEuler(new THREE.Euler(
            -deltaMove.y * rotationSpeed, // หมุนตามแกน X (ขึ้น-ลง)
            -deltaMove.x * rotationSpeed, // หมุนตามแกน Y (ซ้าย-ขวา)
            0,
            'XYZ'
          ));
        
        // คำนวณตำแหน่งกล้องใหม่โดยยึด view point เป็นจุดศูนย์กลาง
        const cameraOffset = new THREE.Vector3().subVectors(this.camera.position, viewPoint);
        cameraOffset.applyQuaternion(deltaRotationQuaternion);
        this.camera.position.copy(viewPoint).add(cameraOffset);
        
        // ให้กล้องยังคงมองไปที่ viewpoint
        this.camera.lookAt(viewPoint);
      }
      
      // การเลื่อนขึ้น-ลงด้วยคลิกขวา (สำหรับใช้เมื่อไม่มี OrbitControls)
      if (isRightDragging && !this.controls) {
        const moveSpeed = 0.05;
        this.camera.position.y += deltaMove.y * moveSpeed;
        // ให้กล้องยังมองที่ view point เสมอ
        if (this.controls && this.controls.target) {
          this.camera.lookAt(this.controls.target);
        } else {
          this.camera.lookAt(0, 0, 0);
        }
      }
      
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    canvas.addEventListener('mouseup', (e) => {
      if (e.button === 0) { // คลิกซ้าย
        isDragging = false;
        viewPointDragging = false;
      } else if (e.button === 2) { // คลิกขวา
        isRightDragging = false;
      }
    });

    canvas.addEventListener('wheel', (e) => {
      // การซูมแบบยึดตาม view point
      const zoomSpeed = 0.05;
      const direction = e.deltaY > 0 ? 1 : -1;
      const factor = 1 + direction * zoomSpeed;
      
      // หา vector ทิศทางจากกล้องไปยัง view point
      const viewPoint = this.controls ? this.controls.target : new THREE.Vector3(0, 0, 0);
      const offset = new THREE.Vector3().subVectors(this.camera.position, viewPoint);
      
      // ปรับระยะทางของกล้อง
      offset.multiplyScalar(factor);
      this.camera.position.copy(viewPoint).add(offset);
      
      // ให้กล้องยังมองที่ view point เสมอ
      this.camera.lookAt(viewPoint);
      
      e.preventDefault();
    });
  }

  getGridSize(projectSize) {
    switch (projectSize) {
      case 'small': return 6;
      case 'medium': return 10;
      case 'large': return 16;
      default: return 10;
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    
    // ตรวจสอบว่ามี scene, camera และ renderer หรือไม่
    if (!this.scene || !this.camera || !this.renderer) {
      console.warn('Scene, camera or renderer not initialized');
      return;
    }
    
    // Update controls if they exist
    if (this.controls && this.controls.update) {
      // ทำให้กล้องมองที่จุด view point (target) เสมอ
      if (this.controls.target) {
        this.camera.lookAt(this.controls.target);
      }
      
      this.controls.update();
    }
    
    this.renderer.render(this.scene, this.camera);
  }
  
  setupRotationControls() {
    // Setup rotation X control
    
    // Setup keyboard shortcuts
    this.initKeyboardShortcuts();
    const rotationXInput = document.getElementById('rotation-x');
    if (rotationXInput) {
      rotationXInput.addEventListener('input', (e) => {
        const selectedObjects = this.getSelectedObjects();
        if (selectedObjects.length > 0) {
          const angle = (parseInt(e.target.value) * Math.PI) / 180;
          selectedObjects.forEach(obj => {
            obj.rotation.x = angle;
          });
        }
      });
    }
    
    // Setup rotation Y control
    const rotationYInput = document.getElementById('rotation-y');
    if (rotationYInput) {
      rotationYInput.addEventListener('input', (e) => {
        const selectedObjects = this.getSelectedObjects();
        if (selectedObjects.length > 0) {
          const angle = (parseInt(e.target.value) * Math.PI) / 180;
          selectedObjects.forEach(obj => {
            obj.rotation.y = angle;
          });
        }
      });
    }
    
    // Setup grid density control
    const gridSizeInput = document.getElementById('grid-size');
    if (gridSizeInput) {
      gridSizeInput.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        this.updateGridSize(value);
      });
    }
    
    // Setup area size control
    const areaSizeSelect = document.getElementById('area-size-select');
    if (areaSizeSelect) {
      areaSizeSelect.addEventListener('change', (e) => {
        const sizeType = e.target.value; // 'small', 'medium', or 'large'
        this.updateAreaSize(sizeType);
      });
    }
  }
  
  updateGridSize(size) {
    // Determine current area size
    const areaSizeSelect = document.getElementById('area-size-select');
    const currentSizeType = areaSizeSelect ? areaSizeSelect.value : 'medium';
    
    // Get area size based on selected size type
    const areaSize = this.getGridSize(currentSizeType);
    
    // Remove old grid and axis helper
    this.scene.children.forEach(child => {
      if (child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper) {
        this.scene.remove(child);
      }
    });
    
    // Add new grid with correct density
    const grid = new THREE.GridHelper(areaSize, size);
    
    // Make grid lines more visible in light theme
    if (document.documentElement.getAttribute('data-theme') === 'light') {
      if (grid.material) {
        grid.material.opacity = 0.35;
        grid.material.transparent = true;
      }
    }
    
    this.scene.add(grid);
    
    // Re-add axes helper with appropriate size
    const axisSize = areaSize / 2;
    const axesHelper = new THREE.AxesHelper(axisSize);
    // Make the axes more subtle
    if (axesHelper.material) {
      axesHelper.material.opacity = 0.5;
      axesHelper.material.transparent = true;
    }
    this.scene.add(axesHelper);
  }
  
  // อัพเดทขนาดพื้นที่วางโมเดล - Update model placement area size
  updateAreaSize(sizeType) {
    // Remove old grid and floor
    this.scene.children.forEach(child => {
      if (child instanceof THREE.GridHelper || 
          (child instanceof THREE.Mesh && child.userData.type === 'floor') ||
          child instanceof THREE.AxesHelper) {
        this.scene.remove(child);
      }
    });
    
    // Get new grid size based on selected size
    const gridSize = this.getGridSize(sizeType);
    
    // Add new grid with more visible lines in light theme
    const gridDensity = parseInt(document.getElementById('grid-size').value) || 10;
    const grid = new THREE.GridHelper(gridSize, gridDensity);
    
    // Make grid lines more visible in light theme
    if (document.documentElement.getAttribute('data-theme') === 'light') {
      if (grid.material) {
        grid.material.opacity = 0.35; 
        grid.material.transparent = true;
      }
    }
    
    this.scene.add(grid);
    
    // Add new floor with shadow for light theme
    const floorGeometry = new THREE.PlaneGeometry(gridSize, gridSize);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff, 
      side: THREE.DoubleSide,
      transparent: true,
      opacity: document.documentElement.getAttribute('data-theme') === 'light' ? 0.9 : 0.8,
      // Add slight shadow for better visibility in light theme
      shadowSide: THREE.DoubleSide
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    floor.userData.type = 'floor';
    this.scene.add(floor);
    
    // Re-add axes helper with appropriate size relative to grid
    const axisSize = gridSize / 2;
    const axesHelper = new THREE.AxesHelper(axisSize);
    // Make the axes more subtle
    if (axesHelper.material) {
      axesHelper.material.opacity = 0.5;
      axesHelper.material.transparent = true;
    }
    this.scene.add(axesHelper);
  }
  
  getSelectedObjects() {
    // In a real app, this would return objects that have been clicked/selected
    // For demo purposes, return all furniture objects
    return this.scene.children.filter(child => 
      child.userData && child.userData.type === 'furniture'
    );
  }

  onWindowResize() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    // รีเซ็ตขนาดของ canvas เพื่อให้แน่ใจว่าได้รับขนาดที่ถูกต้อง
    const viewport = document.getElementById('viewport');
    if (viewport) {
      // ตรวจสอบว่า viewport มีขนาดที่ถูกต้อง
      if (viewport.clientWidth === 0 || viewport.clientHeight === 0) {
        console.warn('Viewport size is zero!');
      }
      
      // ตั้งค่าความกว้างและสูงของ canvas ให้เต็ม viewport
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    }

    // อัปเดตกล้องและ renderer
    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    
    // ใช้ขนาดจริงของ canvas
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    
    // ปรับปรุง controls หลังจากการปรับขนาด
    if (this.controls) {
      this.controls.update();
    }
    
    console.log('Resized canvas to', canvas.clientWidth, 'x', canvas.clientHeight);
  }

  initEventListeners() {
    // Sidebar tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchTab(btn.dataset.tab);
      });
    });

    // Category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.showFurnitureCategory(btn.dataset.category);
      });
    });

    // Settings panel
    const settingsBtn = document.getElementById('settings-btn');
    const settingsPanel = document.getElementById('settings-panel');
    const closeSettings = document.getElementById('close-settings');

    settingsBtn.addEventListener('click', () => {
      settingsPanel.classList.add('open');
    });

    closeSettings.addEventListener('click', () => {
      settingsPanel.classList.remove('open');
    });

    // Viewport help panel
    const helpBtn = document.getElementById('viewport-help');
    const helpPanel = document.getElementById('viewport-help-panel');
    const closeHelpBtn = document.querySelector('.close-help-btn');

    if (helpBtn && helpPanel && closeHelpBtn) {
      helpBtn.addEventListener('click', () => {
        helpPanel.classList.toggle('visible');
      });

      closeHelpBtn.addEventListener('click', () => {
        helpPanel.classList.remove('visible');
      });
      
      // ปิด help panel เมื่อคลิกนอกพื้นที่
      document.addEventListener('click', (e) => {
        if (!helpPanel.contains(e.target) && e.target !== helpBtn) {
          helpPanel.classList.remove('visible');
        }
      });
    }

  // Undo/Redo buttons
  const undoBtn = document.getElementById('undo-btn');
  const redoBtn = document.getElementById('redo-btn');
  
  if (undoBtn) {
    undoBtn.addEventListener('click', () => {
      if (window.editorApp) {
        window.editorApp.undo();
      }
    });
  }

  if (redoBtn) {
    redoBtn.addEventListener('click', () => {
      if (window.editorApp) {
        window.editorApp.redo();
      }
    });
  }    // Back button
    document.querySelector('.back-btn').addEventListener('click', () => {
      const nav = new NavigationManager();
      nav.showPage('creative');
    });
  }

  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    document.getElementById(`${tabName}-panel`).classList.add('active');
  }

  showFurnitureCategory(category) {
    const furnitureItems = document.getElementById('furniture-items');
    furnitureItems.innerHTML = '';

    const categoryData = this.furnitureData[category] || [];
    
    // กรณีไม่มีเฟอร์นิเจอร์ในหมวดหมู่
    if (categoryData.length === 0) {
      furnitureItems.innerHTML = `
        <div class="no-items">
          <p data-en="No items in this category" data-th="ไม่มีรายการในหมวดหมู่นี้">
            ไม่มีรายการในหมวดหมู่นี้
          </p>
        </div>
      `;
      return;
    }
    
    categoryData.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'furniture-item';
      
      // เตรียมแสดงรูปตัวอย่าง
      let previewContent = '';
      
      // ตรวจสอบว่ามีรูปตัวอย่างหรือไม่
      if (item.preview && item.preview.endsWith('.jpg') || item.preview.endsWith('.png')) {
        previewContent = `<img src="${item.preview}" alt="${item.name}" onerror="this.onerror=null;this.src='';this.style.background='${item.color}';this.innerHTML='${item.name[0]}'">`;
      } else {
        // ถ้าไม่มีรูปตัวอย่าง ให้ใช้สีและตัวอักษรแรกแทน
        previewContent = `<div style="background-color:${item.color};width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;">${item.name[0]}</div>`;
      }
      
      // เลือกชื่อตามภาษาปัจจุบัน
      const lang = this.languageManager ? this.languageManager.currentLanguage : 'th';
      const displayName = lang === 'en' && item.nameEn ? item.nameEn : item.name;
      
      // สร้าง HTML สำหรับแสดงรายการเฟอร์นิเจอร์
      itemElement.innerHTML = `
        <div class="furniture-preview">
          ${previewContent}
          ${item.hasModel ? '<div class="model-badge">3D</div>' : ''}
        </div>
        <span data-en="${item.nameEn || item.name}" data-th="${item.nameTh || item.name}">
          ${displayName}
        </span>
      `;
      
      // เพิ่ม event listener
      itemElement.addEventListener('click', () => {
        this.addFurnitureToScene(item);
      });
      
      furnitureItems.appendChild(itemElement);
    });
  }

  // เพิ่มฟังก์ชันสำหรับโหลดโมเดล GLTF
  loadGLTFModel(modelPath) {
    return new Promise((resolve, reject) => {
      console.log('Loading GLTF model from:', modelPath);
      
      // ตรวจสอบว่า THREE มีอยู่หรือไม่
      if (typeof THREE === 'undefined') {
        console.error('THREE is not available');
        reject(new Error('THREE not available'));
        return;
      }
      
      // แก้ไข path ถ้าจำเป็น
      const adjustedPath = modelPath.startsWith('/') ? modelPath.substring(1) : modelPath;
      console.log('Using adjusted path:', adjustedPath);
      
      // ตรวจสอบว่า GLTFLoader มีอยู่หรือไม่
      const GLTFLoaderClass = THREE.GLTFLoader || window.GLTFLoader;
      if (!GLTFLoaderClass) {
        console.error('GLTFLoader is not available');
        reject(new Error('GLTFLoader not available'));
        return;
      }
      
      // สร้าง GLTFLoader
      const loader = new GLTFLoaderClass();
      
      // ตรวจสอบว่า DRACOLoader มีอยู่หรือไม่
      const DRACOLoaderClass = THREE.DRACOLoader || window.DRACOLoader;
      if (DRACOLoaderClass) {
        const dracoLoader = new DRACOLoaderClass();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        loader.setDRACOLoader(dracoLoader);
      }
      
      console.log('Starting to load model with adjusted path:', adjustedPath);
      
      loader.load(
        adjustedPath,
        (gltf) => {
          console.log('GLTF model loaded successfully:', gltf);
          const model = gltf.scene;
          
          // ปรับแต่งโมเดล - ให้ทุกส่วนสร้างเงา
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              
              // หากต้องการปรับ material เพิ่มเติมสามารถทำได้ที่นี่
              if (child.material) {
                child.material.needsUpdate = true;
              }
            }
          });
          
          console.log('Model processed and ready to add to scene');
          resolve(model);
        },
        (xhr) => {
          // แสดงความคืบหน้าการโหลด
          const progress = xhr.loaded / xhr.total * 100;
          console.log(`Loading model: ${progress.toFixed(2)}% loaded`);
        },
        (error) => {
          console.error('Error loading GLTF model:', error);
          console.error('Failed path:', adjustedPath);
          reject(error);
        }
      );
    });
  }

  addFurnitureToScene(furnitureItem) {
    if (!this.scene) return;

    // แสดงผลการโหลดเพื่อให้ผู้ใช้ทราบว่ากำลังดำเนินการอยู่
    console.log('Adding furniture to scene:', furnitureItem.name);
    
    // ตรวจสอบว่ามีโมเดล GLTF หรือไม่
    if (furnitureItem.hasModel && furnitureItem.modelPath) {
      // แสดงตัวโหลดชั่วคราว
      const loadingBox = new THREE.Mesh(
        new THREE.BoxGeometry(
          furnitureItem.size.width,
          furnitureItem.size.height,
          furnitureItem.size.depth
        ),
        new THREE.MeshBasicMaterial({ 
          color: 0xaaaaaa,
          wireframe: true,
          opacity: 0.5,
          transparent: true
        })
      );
      
      // ตั้งตำแหน่งสำหรับตัวโหลด
      loadingBox.position.set(
        Math.random() * 4 - 2,
        furnitureItem.size.height / 2,
        Math.random() * 4 - 2
      );
      
      this.scene.add(loadingBox);
      
      // แสดง loading feedback
      this.showFeedback('กำลังโหลดโมเดล...', 'viewport-help');
      
      // แสดงข้อมูลดีบัก
      console.log('Furniture details:', {
        name: furnitureItem.name,
        hasModel: furnitureItem.hasModel,
        modelPath: furnitureItem.modelPath
      });
      
      // ตรวจสอบว่าไฟล์โมเดลมีอยู่หรือไม่
      const adjustedPath = furnitureItem.modelPath.startsWith('/') 
        ? furnitureItem.modelPath.substring(1)
        : furnitureItem.modelPath;
      
      console.log('Attempting to load model from:', adjustedPath);
      
      // ทดลองเช็คดูว่า THREE.GLTFLoader มีอยู่หรือไม่
      console.log('THREE availability check:', {
        THREE: typeof THREE !== 'undefined',
        GLTFLoader: typeof THREE !== 'undefined' && typeof THREE.GLTFLoader !== 'undefined',
        windowGLTFLoader: typeof window.GLTFLoader !== 'undefined'
      });
      
      // โหลดโมเดล GLTF
      this.loadGLTFModel(adjustedPath) // ใช้ adjustedPath ที่แก้ไขแล้ว
        .then(model => {
          // ปรับขนาดโมเดล
          if (furnitureItem.scale) {
            model.scale.set(
              furnitureItem.scale.x, 
              furnitureItem.scale.y, 
              furnitureItem.scale.z
            );
          }
          
          // ปรับการหมุนโมเดล
          if (furnitureItem.rotation) {
            model.rotation.set(
              furnitureItem.rotation.x * Math.PI / 180,
              furnitureItem.rotation.y * Math.PI / 180,
              furnitureItem.rotation.z * Math.PI / 180
            );
          }
          
          // ใช้ตำแหน่งเดียวกับตัวโหลด
          model.position.copy(loadingBox.position);
          
          // เพิ่มข้อมูลสำหรับการจัดการวัตถุ
          model.userData = { 
            type: 'furniture', 
            item: furnitureItem, 
            selected: false,
            outline: null
          };
          
          // ลบตัวโหลด
          this.scene.remove(loadingBox);
          
          // เพิ่มโมเดลลงในฉาก
          this.scene.add(model);
          
          // ทำให้โมเดลสามารถโต้ตอบได้
          this.makeInteractive(model);
          
          // บันทึกสถานะเพื่อ undo
          this.saveState();
          
          // แสดง success feedback
          this.showFeedback('เพิ่มเฟอร์นิเจอร์แล้ว', 'viewport-help');
          
          return model;
        })
        .catch(error => {
          // ลบตัวโหลด
          this.scene.remove(loadingBox);
          
          console.error('Failed to load furniture model:', error);
          console.error('Model path that failed:', furnitureItem.modelPath);
          
          // แสดงข้อมูลเพิ่มเติมเกี่ยวกับการโหลดโมเดล
          console.warn('Warning: Check if file exists and paths are correct.');
          console.warn('Check if GLTFLoader and DRACOLoader are properly loaded from:', document.scripts);
          
          this.showFeedback('ไม่สามารถโหลดโมเดลได้ จะแสดงกล่องแทน', 'viewport-help');
          
          // สร้างโมเดลกล่องเป็น fallback
          return this.createBoxModel(furnitureItem);
        });
    } else {
      // สร้างกล่องเป็น fallback หากไม่มีโมเดล GLTF
      return this.createBoxModel(furnitureItem);
    }
  }
  
  // แยกฟังก์ชันการสร้างโมเดลกล่องออกมา
  createBoxModel(furnitureItem) {
    // สร้างกล่องแทนเฟอร์นิเจอร์
    const geometry = new THREE.BoxGeometry(
      furnitureItem.size.width,
      furnitureItem.size.height,
      furnitureItem.size.depth
    );
    const material = new THREE.MeshLambertMaterial({ 
      color: furnitureItem.color,
      transparent: true,
      opacity: 0.8 
    });
    const furniture = new THREE.Mesh(geometry, material);
    
    // ตั้งตำแหน่งบนพื้น
    furniture.position.set(
      Math.random() * 4 - 2,
      furnitureItem.size.height / 2,
      Math.random() * 4 - 2
    );
    
    furniture.castShadow = true;
    furniture.userData = { type: 'furniture', item: furnitureItem, selected: false };
    furniture.userData.outline = null;
    
    // Make interactive
    this.makeInteractive(furniture);
    
    // Animation for appearing
    furniture.scale.set(0.01, 0.01, 0.01);
    this.scene.add(furniture);
    
    // Animate scale to full size
    const targetScale = { x: 1, y: 1, z: 1 };
    gsap.to(furniture.scale, {
      x: targetScale.x,
      y: targetScale.y,
      z: targetScale.z,
      duration: 0.5,
      ease: "back.out(1.7)"
    });
    
    // Save state for undo
    this.saveState();
    
    return furniture;
  }
  
  makeInteractive(object) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let selectedObject = null;
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0));
    const planeIntersect = new THREE.Vector3();
    const offset = new THREE.Vector3();
    
    // Add event listeners to canvas
    const canvas = this.renderer.domElement;
    
    // ตัวแปรเพื่อเก็บว่าเมาส์กดลงที่ไหน (สำหรับแยกระหว่างคลิกและลาก)
    let mouseDownTime = 0;
    let mouseDownPos = { x: 0, y: 0 };
    
    canvas.addEventListener('mousedown', (event) => {
      // บันทึกตำแหน่งและเวลาที่กดเมาส์
      mouseDownTime = Date.now();
      mouseDownPos = { x: event.clientX, y: event.clientY };
      
      // Calculate normalized mouse coordinates
      mouse.x = (event.clientX / canvas.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / canvas.clientHeight) * 2 + 1;
      
      // Update raycaster
      raycaster.setFromCamera(mouse, this.camera);
      
      // Check intersections
      const intersects = raycaster.intersectObjects(this.scene.children);
      
      if (intersects.length > 0) {
        // Find first furniture object that was intersected
        const intersectedFurniture = intersects.find(intersect => 
          intersect.object.userData && intersect.object.userData.type === 'furniture'
        );
        
        if (intersectedFurniture) {
          // ไม่ปิด orbit controls ทันที รอดูว่าผู้ใช้ต้องการจะลากวัตถุหรือไม่
          selectedObject = intersectedFurniture.object;
          
          // เลือกวัตถุแต่ไม่แสดง popup
          this.selectObject(selectedObject);
          
          // Calculate drag offset
          raycaster.ray.intersectPlane(plane, planeIntersect);
          offset.copy(planeIntersect).sub(selectedObject.position);
          
          // รอลากก่อนค่อยกำหนดเป็น dragging
          // isDragging = true;
        }
      }
    });
    
    canvas.addEventListener('mousemove', (event) => {
      // ตรวจสอบว่าเรากำลังลากวัตถุหรือเป็นเพียงแค่การขยับเมาส์ทั่วไป
      if (selectedObject && !isDragging) {
        // ตรวจสอบว่าผู้ใช้เริ่มลากวัตถุหรือไม่ (เมาส์ขยับไปมากกว่า 5 พิกเซล)
        const dx = event.clientX - mouseDownPos.x;
        const dy = event.clientY - mouseDownPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
          // เริ่มลากวัตถุ - ปิด orbit controls แต่เฉพาะเมื่อมีการเลือกวัตถุเท่านั้น
          isDragging = true;
          
          if (this.controls) {
            this.controls.enabled = false;
          }
        }
      }
      
      if (isDragging && selectedObject) {
        // Calculate normalized mouse coordinates
        mouse.x = (event.clientX / canvas.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / canvas.clientHeight) * 2 + 1;
        
        // Update raycaster
        raycaster.setFromCamera(mouse, this.camera);
        
        // Calculate new position
        raycaster.ray.intersectPlane(plane, planeIntersect);
        selectedObject.position.copy(planeIntersect).sub(offset);
        selectedObject.position.y = selectedObject.userData.item.size.height / 2; // Keep at correct height
      }
    });
    
    canvas.addEventListener('mouseup', (event) => {
      const mouseUpTime = Date.now();
      const clickDuration = mouseUpTime - mouseDownTime;
      
      // ตรวจสอบว่าเป็นการคลิกปกติ (คลิกสั้นๆ) หรือการลากวัตถุ
      if (clickDuration < 200 && !isDragging) {
        // เป็นการคลิกปกติ - ไม่ทำอะไรเพิ่มเติม (ไม่แสดง popup)
      }
      
      // หากกำลังลากวัตถุ ให้หยุดลากและรีเซ็ตสถานะ
      if (isDragging) {
        isDragging = false;
        selectedObject = null;
        
        // เปิดใช้งาน orbit controls เมื่อเลิกลากวัตถุ
        if (this.controls) {
          this.controls.enabled = true;
        }
      } else {
        // กรณีคลิกปกติที่ไม่ได้ลากวัตถุ
        isDragging = false;
        selectedObject = null;
        
        // ให้แน่ใจว่า orbit controls เปิดใช้งานอยู่เสมอเพื่อให้สามารถหมุนได้
        if (this.controls) {
          this.controls.enabled = true;
        }
      }
    });
    
    // Click handler for viewport buttons
    document.querySelectorAll('.viewport-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-en');
        if (action === 'Reset View') {
          this.resetCamera();
        } else if (action === 'Top View') {
          this.setTopView();
        } else if (action === 'Side View') {
          this.setSideView();
        }
      });
    });
  }
  
  selectObject(object) {
    // Deselect all objects first
    this.scene.children.forEach(child => {
      if (child.userData && child.userData.type === 'furniture' && child.userData.outline) {
        child.userData.outline.visible = false;
        child.userData.selected = false;
      }
    });
    
    // Select this object without showing outline or popup
    object.userData.selected = true;
    
    // เราไม่แสดง outline เมื่อเลือกวัตถุตามที่ผู้ใช้ต้องการ
    // if (object.userData.outline) {
    //   object.userData.outline.visible = true;
    // }
    
    // Update rotation controls to match selected object
    const rotX = document.getElementById('rotation-x');
    const rotY = document.getElementById('rotation-y');
    
    if (rotX && rotY) {
      rotX.value = (object.rotation.x * 180 / Math.PI) % 360;
      rotY.value = (object.rotation.y * 180 / Math.PI) % 360;
    }
  }
  
  resetCamera() {
    // มุมมองเริ่มต้นเหมือนเว็บอ้างอิง (https://aster4248.github.io/IS/) และล็อก view point ไว้ที่ตรงกลาง
    this.camera.position.set(10, 8, 10);
    this.camera.lookAt(0, 0, 0);
    if (this.controls) {
      this.controls.reset();
      
      // ล็อค view point ไว้ที่จุดศูนย์กลาง (0, 0, 0)
      this.controls.target.set(0, 0, 0);
      
      // อนุญาตให้หมุนมุมมองได้อิสระในแนวดิ่ง (ขึ้น-ลง)
      this.controls.minPolarAngle = 0; // สามารถมองจากด้านบนได้
      this.controls.maxPolarAngle = Math.PI * 0.85; // จำกัดไม่ให้มองใต้พื้นมากเกินไป
      
      // อนุญาตให้หมุนในแนวราบได้อิสระ 360 องศา
      this.controls.minAzimuthAngle = -Infinity; // ไม่จำกัดการหมุนแนวราบ
      this.controls.maxAzimuthAngle = Infinity; // สามารถหมุนได้รอบทิศทาง
      
      // แสดงเอฟเฟกต์การเปลี่ยนมุมมอง
      const startPos = new THREE.Vector3().copy(this.camera.position);
      const endPos = new THREE.Vector3(10, 8, 10);
      
      gsap.to(this.camera.position, {
        x: endPos.x,
        y: endPos.y,
        z: endPos.z,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: () => {
          this.camera.lookAt(0, 0, 0);
          if (this.controls) this.controls.update();
        }
      });
    }
  }
  
  setTopView() {
    // มุมมองจากด้านบนแบบ 2D (โดยยึดจุดศูนย์กลางเป็นหลัก)
    this.camera.position.set(0, 15, 0);
    this.camera.lookAt(0, 0, 0);
    if (this.controls) {
      // กำหนดจุดศูนย์กลางที่กล้องจะมองตลอดเวลา
      this.controls.target.set(0, 0, 0);
      this.controls.update();
      
      // เริ่มต้นที่มุมมองด้านบน แต่ยังอนุญาตให้หมุนได้
      this.controls.minPolarAngle = 0;
      this.controls.maxPolarAngle = Math.PI * 0.85; // จำกัดไม่ให้มองใต้พื้นมากเกินไป
      
      // อนุญาตให้หมุนในแนวราบได้อิสระ
      this.controls.minAzimuthAngle = -Infinity;
      this.controls.maxAzimuthAngle = Infinity;
    }
  }
  
  setSideView() {
    // มุมมองด้านข้างแบบ 2D (โดยยึดจุดศูนย์กลางเป็นหลัก)
    this.camera.position.set(15, 0, 15);
    this.camera.lookAt(0, 0, 0);
    if (this.controls) {
      this.controls.update();
      
      // กำหนดจุดศูนย์กลางที่กล้องจะมองตลอดเวลา
      this.controls.target.set(0, 0, 0);
      
      // ตั้งค่าเริ่มต้นที่มุมมองด้านข้าง แต่ยังคงให้หมุนได้
      this.controls.minPolarAngle = 0;
      this.controls.maxPolarAngle = Math.PI * 0.85; // จำกัดไม่ให้มองใต้พื้นมากเกินไป
      
      // อนุญาตให้หมุนในแนวราบได้อิสระ
      this.controls.minAzimuthAngle = -Infinity; // ไม่จำกัดการหมุน
      this.controls.maxAzimuthAngle = Infinity; // หมุนได้รอบทิศทาง
    }
  }
  
  // ฟังก์ชันสำหรับกำหนดจุดศูนย์กลาง (view point) ใหม่
  setViewPoint(x = 0, y = 0, z = 0, animate = false) {
    if (this.controls) {
      if (animate) {
        // ทำการเคลื่อนที่แบบมีอนิเมชันเพื่อให้ดูลื่นไหล
        const currentTarget = this.controls.target.clone();
        const newTarget = new THREE.Vector3(x, y, z);
        
        gsap.to(currentTarget, {
          x: newTarget.x,
          y: newTarget.y,
          z: newTarget.z,
          duration: 0.5,
          ease: "power2.out",
          onUpdate: () => {
            this.controls.target.copy(currentTarget);
            this.camera.lookAt(currentTarget);
            this.controls.update();
          }
        });
      } else {
        // กำหนดจุดศูนย์กลางใหม่ทันที
        this.controls.target.set(x, y, z);
        this.controls.update();
        
        // ให้กล้องมองที่จุดศูนย์กลางใหม่
        this.camera.lookAt(x, y, z);
      }
    }
  }
  
  // ฟังก์ชันสำหรับปรับ view point ตามการเลื่อนเมาส์
  updateViewPointFromMouse(deltaX, deltaY) {
    if (this.controls && this.controls.target) {
      // คำนวณระยะทางที่จะเลื่อน view point ตามการเลื่อนเมาส์
      const moveFactor = 0.05; // ปรับความเร็วในการเลื่อน view point
      
      // สร้าง vector ที่ใช้ในการเคลื่อนที่ใน 3D space
      const moveX = -deltaX * moveFactor;
      const moveZ = -deltaY * moveFactor;
      
      // ปรับตำแหน่ง view point
      const currentTarget = this.controls.target;
      this.setViewPoint(
        currentTarget.x + moveX,
        currentTarget.y,
        currentTarget.z + moveZ,
        false
      );
    }
  }

  saveState() {
    // Create a snapshot of the current scene
    const furnitureItems = this.scene.children.filter(child => 
      child.userData && child.userData.type === 'furniture'
    );
    
    // Store serialized furniture data
    const furnitureData = furnitureItems.map(item => {
      return {
        id: item.id || Date.now() + Math.random(),
        type: item.userData.item.name,
        position: {
          x: item.position.x,
          y: item.position.y,
          z: item.position.z
        },
        rotation: {
          x: item.rotation.x,
          y: item.rotation.y,
          z: item.rotation.z
        },
        scale: {
          x: item.scale.x,
          y: item.scale.y,
          z: item.scale.z
        },
        userData: item.userData
      };
    });
    
    // Store state for undo
    this.undoStack.push({
      timestamp: Date.now(),
      action: 'scene_update',
      furnitureData: furnitureData
    });
    
    // Clear redo stack when a new action is performed
    this.redoStack = [];
    
    // Limit undo stack size to prevent memory issues
    if (this.undoStack.length > 50) {
      this.undoStack.shift();
    }
    
    // Update UI buttons
    this.updateUndoRedoButtons();
  }

  undo() {
    if (this.undoStack.length === 0) return;
    
    // Get current state for redo
    const currentState = this.getCurrentState();
    
    // Get previous state to restore
    const lastAction = this.undoStack.pop();
    this.redoStack.push(currentState);
    
    // Restore previous state
    if (lastAction) {
      this.restoreState(lastAction);
      
      // Show feedback
      this.showFeedback('Undo', 'undo-btn');
    }
    
    // Update UI buttons
    this.updateUndoRedoButtons();
  }

  redo() {
    if (this.redoStack.length === 0) return;
    
    // Get current state for undo
    const currentState = this.getCurrentState();
    
    // Get next state to restore
    const nextAction = this.redoStack.pop();
    this.undoStack.push(currentState);
    
    // Restore next state
    if (nextAction) {
      this.restoreState(nextAction);
      
      // Show feedback
      this.showFeedback('Redo', 'redo-btn');
    }
    
    // Update UI buttons
    this.updateUndoRedoButtons();
  }
  
  getCurrentState() {
    // Create snapshot of current scene
    const furnitureItems = this.scene.children.filter(child => 
      child.userData && child.userData.type === 'furniture'
    );
    
    // Store serialized furniture data
    const furnitureData = furnitureItems.map(item => {
      return {
        id: item.id || Date.now() + Math.random(),
        type: item.userData.item.name,
        position: {
          x: item.position.x,
          y: item.position.y,
          z: item.position.z
        },
        rotation: {
          x: item.rotation.x,
          y: item.rotation.y,
          z: item.rotation.z
        },
        scale: {
          x: item.scale.x,
          y: item.scale.y,
          z: item.scale.z
        },
        userData: item.userData
      };
    });
    
    return {
      timestamp: Date.now(),
      action: 'scene_update',
      furnitureData: furnitureData
    };
  }
  
  restoreState(state) {
    if (!state || !state.furnitureData) return;
    
    // Remove all current furniture
    const furnitureItems = this.scene.children.filter(child => 
      child.userData && child.userData.type === 'furniture'
    );
    
    furnitureItems.forEach(item => {
      this.scene.remove(item);
    });
    
    // Add furniture from the saved state
    state.furnitureData.forEach(item => {
      // Find the furniture item data
      const category = Object.keys(this.furnitureData).find(cat => {
        return this.furnitureData[cat].some(f => f.name === item.userData.item.name);
      });
      
      if (category) {
        const furnitureData = this.furnitureData[category].find(f => f.name === item.userData.item.name);
        if (furnitureData) {
          // Create the furniture
          const furniture = this.addFurnitureToScene(furnitureData);
          
          // Restore position, rotation and scale
          if (furniture) {
            furniture.position.set(item.position.x, item.position.y, item.position.z);
            furniture.rotation.set(item.rotation.x, item.rotation.y, item.rotation.z);
            furniture.scale.set(item.scale.x, item.scale.y, item.scale.z);
          }
        }
      }
    });
  }
  
  updateUndoRedoButtons() {
    // Update undo button
    const undoBtn = document.getElementById('undo-btn');
    if (undoBtn) {
      undoBtn.disabled = this.undoStack.length === 0;
      undoBtn.style.opacity = this.undoStack.length === 0 ? '0.5' : '1';
    }
    
    // Update redo button
    const redoBtn = document.getElementById('redo-btn');
    if (redoBtn) {
      redoBtn.disabled = this.redoStack.length === 0;
      redoBtn.style.opacity = this.redoStack.length === 0 ? '0.5' : '1';
    }
  }
  
  showFeedback(action, buttonId) {
    // Create a feedback element
    const feedback = document.createElement('div');
    feedback.className = 'action-feedback';
    feedback.textContent = action;
    
    // Position it near the button
    const button = document.getElementById(buttonId);
    if (button) {
      const rect = button.getBoundingClientRect();
      feedback.style.position = 'absolute';
      feedback.style.top = `${rect.top - 30}px`;
      feedback.style.left = `${rect.left}px`;
      feedback.style.background = 'rgba(0,0,0,0.7)';
      feedback.style.color = 'white';
      feedback.style.padding = '5px 10px';
      feedback.style.borderRadius = '4px';
      feedback.style.zIndex = '1000';
      feedback.style.pointerEvents = 'none';
      
      // Add to body and animate
      document.body.appendChild(feedback);
      
      // Animate fade out
      feedback.style.transition = 'opacity 0.5s, transform 0.5s';
      feedback.style.opacity = '1';
      feedback.style.transform = 'translateY(0)';
      
      setTimeout(() => {
        feedback.style.opacity = '0';
        feedback.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
          document.body.removeChild(feedback);
        }, 500);
      }, 1000);
    }
  }

  initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Only apply shortcuts when editor page is active
      const editorPage = document.getElementById('editor-page');
      if (!editorPage || !editorPage.classList.contains('active')) return;
      
      // Undo: Ctrl+Z
      if (e.ctrlKey && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      } 
      // Redo: Ctrl+Shift+Z
      else if (e.ctrlKey && e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        this.redo();
      }
      // Delete: Delete key
      else if (e.key === 'Delete' || e.key === 'Backspace') {
        const selectedObjects = this.getSelectedObjects().filter(obj => obj.userData.selected);
        if (selectedObjects.length > 0) {
          // Save state before deleting
          this.saveState();
          
          // Remove all selected objects
          selectedObjects.forEach(obj => {
            this.scene.remove(obj);
          });
          
          // Show feedback
          this.showFeedback('Deleted', 'undo-btn');
        }
      }
      // Save: Ctrl+S
      else if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        // Save project
        const projectName = document.getElementById('project-title').textContent;
        this.showFeedback(`Saved: ${projectName}`, 'settings-btn');
        console.log('Project saved:', projectName);
      }
      // Reset view with Home key (เว็บอ้างอิง)
      else if (e.key === 'Home') {
        this.resetCamera();
        this.showFeedback('Reset View', 'viewport-help');
      }
      // Camera views using numpad
      // Front view: Numpad 1
      else if (e.code === 'Numpad1' || e.key === '1') {
        // มุมมองด้านหน้า (South View)
        this.camera.position.set(0, 5, 15);
        this.camera.lookAt(0, 0, 0);
        if (this.controls) {
          this.controls.update();
          this.controls.minPolarAngle = Math.PI / 6;
          this.controls.maxPolarAngle = Math.PI / 4;
        }
        this.showFeedback('Front View (South)', 'viewport-help');
      }
      // Side view: Numpad 3
      else if (e.code === 'Numpad3' || e.key === '3') {
        // มุมมองด้านข้าง (East View)
        this.camera.position.set(15, 5, 0);
        this.camera.lookAt(0, 0, 0);
        if (this.controls) {
          this.controls.update();
          this.controls.minPolarAngle = Math.PI / 6;
          this.controls.maxPolarAngle = Math.PI / 4;
        }
        this.showFeedback('Side View (East)', 'viewport-help');
      }
      // Top view: Numpad 7 (แบบ Planner 5D)
      else if (e.code === 'Numpad7' || e.key === '7') {
        // มุมมองจากด้านบน (Top-down View)
        this.camera.position.set(0, 15, 0);
        this.camera.lookAt(0, 0, 0);
        if (this.controls) {
          this.controls.update();
          this.controls.minPolarAngle = 0;
          this.controls.maxPolarAngle = Math.PI / 12;
        }
        this.showFeedback('Top View', 'viewport-help');
      }
      // Isometric view: Numpad 0 (มุมมองแบบ 2D ยึดจุดศูนย์กลาง)
      else if (e.code === 'Numpad0' || e.key === '0') {
        // เปลี่ยนไปใช้มุมมอง isometric แบบ 2D โดยยึดจุดศูนย์กลาง
        this.camera.position.set(10, 8, 10);
        this.camera.lookAt(0, 0, 0);
        if (this.controls) {
          // กำหนดจุดศูนย์กลางที่จะใช้เป็น view point
          this.controls.target.set(0, 0, 0);
          this.controls.update();
          
          // เริ่มต้นที่มุมมอง isometric แต่ยังคงหมุนได้รอบ view point
          this.controls.minPolarAngle = 0;
          this.controls.maxPolarAngle = Math.PI * 0.85;
          
          // อนุญาตให้หมุนในแนวราบได้อิสระ
          this.controls.minAzimuthAngle = -Infinity;
          this.controls.maxAzimuthAngle = Infinity;
        }
        this.showFeedback('Isometric View', 'viewport-help');
      }
      // มุมมองเพิ่มเติมแบบ Planner 5D
      // North view: Numpad 5
      else if (e.code === 'Numpad5' || e.key === '5') {
        // มุมมองด้านหลัง (North View)
        this.camera.position.set(0, 5, -15);
        this.camera.lookAt(0, 0, 0);
        if (this.controls) {
          this.controls.update();
          this.controls.minPolarAngle = Math.PI / 6;
          this.controls.maxPolarAngle = Math.PI / 4;
        }
        this.showFeedback('Back View (North)', 'viewport-help');
      }
      // West view: Numpad 9
      else if (e.code === 'Numpad9' || e.key === '9') {
        // มุมมองด้านข้าง (West View)
        this.camera.position.set(-15, 5, 0);
        this.camera.lookAt(0, 0, 0);
        if (this.controls) {
          this.controls.update();
          this.controls.minPolarAngle = Math.PI / 6;
          this.controls.maxPolarAngle = Math.PI / 4;
        }
        this.showFeedback('Side View (West)', 'viewport-help');
      }
      // Copy: Ctrl+C
      else if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
        const selectedObjects = this.getSelectedObjects().filter(obj => obj.userData.selected);
        if (selectedObjects.length > 0) {
          // Store copied objects in temp storage
          this.copiedObjects = selectedObjects.map(obj => {
            return {
              type: obj.userData.item.name,
              userData: obj.userData
            };
          });
          this.showFeedback('Copied', 'settings-btn');
        }
      }
      // Paste: Ctrl+V
      else if (e.ctrlKey && (e.key === 'v' || e.key === 'V') && this.copiedObjects) {
        // Save state before paste
        this.saveState();
        
        // Paste all copied objects
        this.copiedObjects.forEach(obj => {
          // Find the furniture item data
          const category = Object.keys(this.furnitureData).find(cat => {
            return this.furnitureData[cat].some(f => f.name === obj.type);
          });
          
          if (category) {
            const furnitureData = this.furnitureData[category].find(f => f.name === obj.type);
            if (furnitureData) {
              // Create the furniture with slight offset
              const furniture = this.addFurnitureToScene(furnitureData);
              
              // Offset position slightly
              if (furniture) {
                furniture.position.x += 0.5;
                furniture.position.z += 0.5;
              }
            }
          }
        });
        
        this.showFeedback('Pasted', 'settings-btn');
      }
    });
  }

  initFurnitureData() {
    return {
      bedroom: [
        { 
          id: 'bed-01',
          name: 'เตียง', 
          nameTh: 'เตียง',
          nameEn: 'Bed',
          type: 'bed',
          modelPath: '/models/furniture/bed.glb', 
          hasModel: false, // ตั้งค่าเป็น true เมื่อคุณมีไฟล์โมเดล
          preview: '/images/furniture/bed_preview.jpg',
          color: '#8B4513', 
          size: { width: 2, height: 0.6, depth: 2.2 },
          scale: { x: 1, y: 1, z: 1 },
          rotation: { x: 0, y: 0, z: 0 }
        },
        { 
          id: 'desk-01',
          name: 'โต๊ะทำงาน', 
          nameTh: 'โต๊ะทำงาน',
          nameEn: 'Desk',
          type: 'desk',
          modelPath: '/models/furniture/desk.glb', 
          hasModel: false,
          preview: '/images/furniture/desk_preview.jpg',
          color: '#DEB887', 
          size: { width: 1.2, height: 0.8, depth: 0.6 },
          scale: { x: 1, y: 1, z: 1 },
          rotation: { x: 0, y: 0, z: 0 }
        },
        { 
          id: 'chair-01',
          name: 'เก้าอี้', 
          nameTh: 'เก้าอี้',
          nameEn: 'Chair',
          type: 'chair',
          modelPath: 'models/furniture/chair.glb', // ไม่ต้องมีเครื่องหมาย / นำหน้า
          hasModel: true, // เปลี่ยนเป็น true เพื่อโหลดโมเดล 3D
          preview: 'images/furniture/chair_preview.jpg', // แก้ไขพาธให้ถูกต้อง
          color: '#654321', 
          size: { width: 0.6, height: 1, depth: 0.6 },
          scale: { x: 0.5, y: 0.5, z: 0.5 }, // ปรับขนาดลง
          rotation: { x: 0, y: 0, z: 0 }
        },
        { 
          id: 'wardrobe-01',
          name: 'ตู้เสื้อผ้า', 
          nameTh: 'ตู้เสื้อผ้า',
          nameEn: 'Wardrobe',
          type: 'wardrobe',
          modelPath: '/models/furniture/wardrobe.glb', 
          hasModel: false,
          preview: '/images/furniture/wardrobe_preview.jpg',
          color: '#8B4513', 
          size: { width: 1.5, height: 2, depth: 0.6 },
          scale: { x: 1, y: 1, z: 1 },
          rotation: { x: 0, y: 0, z: 0 }
        },
        { 
          id: 'lamp-01',
          name: 'โคมไฟ', 
          nameTh: 'โคมไฟ',
          nameEn: 'Lamp',
          type: 'lamp',
          modelPath: '/models/furniture/lamp.glb', 
          hasModel: false,
          preview: '/images/furniture/lamp_preview.jpg',
          color: '#FFD700', 
          size: { width: 0.3, height: 1.5, depth: 0.3 },
          scale: { x: 1, y: 1, z: 1 },
          rotation: { x: 0, y: 0, z: 0 }
        }
      ],
      living: [
        { 
          id: 'sofa-01',
          name: 'โซฟาโมเดิร์น', 
          nameTh: 'โซฟาโมเดิร์น',
          nameEn: 'Modern Sofa',
          type: 'sofa',
          modelPath: '/models/furniture/sofa.glb', 
          hasModel: true, // ตัวอย่าง - ตั้งค่าเป็น true เพื่อสาธิต
          preview: '/images/furniture/sofa_preview.jpg',
          color: '#4682B4', 
          size: { width: 2.5, height: 0.8, depth: 1 },
          scale: { x: 1, y: 1, z: 1 },
          rotation: { x: 0, y: 0, z: 0 }
        },
        { 
          id: 'coffee-table-01',
          name: 'โต๊ะกลาง', 
          nameTh: 'โต๊ะกลาง',
          nameEn: 'Coffee Table',
          type: 'table',
          modelPath: '/models/furniture/coffee_table.glb', 
          hasModel: false,
          preview: '/images/furniture/coffee_table_preview.jpg',
          color: '#8B4513', 
          size: { width: 1.2, height: 0.4, depth: 0.8 },
          scale: { x: 1, y: 1, z: 1 },
          rotation: { x: 0, y: 0, z: 0 }
        },
        { 
          id: 'tv-01',
          name: 'ทีวี', 
          nameTh: 'ทีวี',
          nameEn: 'TV',
          type: 'tv',
          modelPath: '/models/furniture/tv.glb', 
          hasModel: false,
          preview: '/images/furniture/tv_preview.jpg',
          color: '#000000', 
          size: { width: 1.5, height: 0.9, depth: 0.1 },
          scale: { x: 1, y: 1, z: 1 },
          rotation: { x: 0, y: 0, z: 0 }
        },
        { 
          id: 'shelf-01',
          name: 'ชั้นวางของ', 
          nameTh: 'ชั้นวางของ',
          nameEn: 'Shelf',
          type: 'shelf',
          modelPath: '/models/furniture/shelf.glb', 
          hasModel: false,
          preview: '/images/furniture/shelf_preview.jpg',
          color: '#DEB887', 
          size: { width: 1, height: 1.8, depth: 0.3 },
          scale: { x: 1, y: 1, z: 1 },
          rotation: { x: 0, y: 0, z: 0 }
        }
      ],
      kitchen: [
        { 
          id: 'counter-01',
          name: 'เคาน์เตอร์', 
          nameTh: 'เคาน์เตอร์',
          nameEn: 'Counter',
          type: 'counter',
          modelPath: '/models/furniture/counter.glb', 
          hasModel: false,
          preview: '/images/furniture/counter_preview.jpg',
          color: '#F5F5DC', 
          size: { width: 2, height: 0.9, depth: 0.6 },
          scale: { x: 1, y: 1, z: 1 },
          rotation: { x: 0, y: 0, z: 0 }
        },
        { 
          id: 'fridge-01',
          name: 'ตู้เย็น', 
          nameTh: 'ตู้เย็น',
          nameEn: 'Refrigerator',
          type: 'fridge',
          modelPath: '/models/furniture/fridge.glb', 
          hasModel: false,
          preview: '/images/furniture/fridge_preview.jpg',
          color: '#C0C0C0', 
          size: { width: 0.7, height: 1.8, depth: 0.7 },
          scale: { x: 1, y: 1, z: 1 },
          rotation: { x: 0, y: 0, z: 0 }
        },
        { 
          id: 'stove-01',
          name: 'เตา', 
          nameTh: 'เตา',
          nameEn: 'Stove',
          type: 'stove',
          modelPath: '/models/furniture/stove.glb', 
          hasModel: false,
          preview: '/images/furniture/stove_preview.jpg',
          color: '#696969', 
          size: { width: 0.6, height: 0.9, depth: 0.6 },
          scale: { x: 1, y: 1, z: 1 },
          rotation: { x: 0, y: 0, z: 0 }
        },
        { 
          id: 'sink-01',
          name: 'อ่างล้างจาน', 
          nameTh: 'อ่างล้างจาน',
          nameEn: 'Sink',
          type: 'sink',
          modelPath: '/models/furniture/sink.glb', 
          hasModel: false,
          preview: '/images/furniture/sink_preview.jpg',
          color: '#C0C0C0', 
          size: { width: 0.8, height: 0.9, depth: 0.5 },
          scale: { x: 1, y: 1, z: 1 },
          rotation: { x: 0, y: 0, z: 0 }
        }
      ],
      bathroom: [
        { 
          id: 'bathtub-01',
          name: 'อ่างอาบน้ำ', 
          nameTh: 'อ่างอาบน้ำ',
          nameEn: 'Bathtub',
          type: 'bathtub',
          modelPath: '/models/furniture/bathtub.glb', 
          hasModel: false,
          preview: '/images/furniture/bathtub_preview.jpg',
          color: '#FFFFFF', 
          size: { width: 1.7, height: 0.6, depth: 0.8 },
          scale: { x: 1, y: 1, z: 1 },
          rotation: { x: 0, y: 0, z: 0 }
        },
        { 
          id: 'toilet-01',
          name: 'ห้องน้ำ', 
          nameTh: 'ห้องน้ำ',
          nameEn: 'Toilet',
          type: 'toilet',
          modelPath: '/models/furniture/toilet.glb', 
          hasModel: false,
          preview: '/images/furniture/toilet_preview.jpg',
          color: '#FFFFFF', 
          size: { width: 0.4, height: 0.8, depth: 0.6 },
          scale: { x: 1, y: 1, z: 1 },
          rotation: { x: 0, y: 0, z: 0 }
        },
        { 
          id: 'basin-01',
          name: 'อ่างล้างหน้า', 
          nameTh: 'อ่างล้างหน้า',
          nameEn: 'Basin',
          type: 'basin',
          modelPath: '/models/furniture/basin.glb', 
          hasModel: false,
          preview: '/images/furniture/basin_preview.jpg',
          color: '#FFFFFF', 
          size: { width: 0.6, height: 0.8, depth: 0.4 },
          scale: { x: 1, y: 1, z: 1 },
          rotation: { x: 0, y: 0, z: 0 }
        },
        { 
          id: 'mirror-01',
          name: 'กระจก', 
          nameTh: 'กระจก',
          nameEn: 'Mirror',
          type: 'mirror',
          modelPath: '/models/furniture/mirror.glb', 
          hasModel: false,
          preview: '/images/furniture/mirror_preview.jpg',
          color: '#87CEEB', 
          size: { width: 0.8, height: 1.2, depth: 0.05 },
          scale: { x: 1, y: 1, z: 1 },
          rotation: { x: 0, y: 0, z: 0 }
        }
      ]
    };
  }
}

// Team member data for about section
class TeamManager {
  constructor() {
    this.currentMember = 0;
    this.members = [
      {
        name: 'Developer 1',
        details: [
          'Line 1: Senior Full-Stack Developer',
          'Line 2: 5+ years experience in web development',
          'Line 3: Specialized in 3D graphics and Three.js',
          'Line 4: Computer Science degree from XYZ University',
          'Line 5: Expert in React, Node.js, and WebGL',
          'Line 6: Contact: dev1@example.com'
        ]
      },
      {
        name: 'Designer 1',
        details: [
          'Line 1: UI/UX Designer',
          'Line 2: 4+ years experience in digital design',
          'Line 3: Specialized in interior design interfaces',
          'Line 4: Design degree from ABC Art School',
          'Line 5: Expert in Figma, Adobe Creative Suite',
          'Line 6: Contact: designer1@example.com'
        ]
      },
      {
        name: 'Architect 1',
        details: [
          'Line 1: 3D Architect and Visualization Expert',
          'Line 2: 6+ years experience in architectural design',
          'Line 3: Specialized in residential interior spaces',
          'Line 4: Architecture degree from DEF Institute',
          'Line 5: Expert in AutoCAD, SketchUp, 3ds Max',
          'Line 6: Contact: architect1@example.com'
        ]
      }
    ];
    this.init();
  }

  init() {
    this.updateMemberDisplay();
    
    document.querySelectorAll('.team-member').forEach((member, index) => {
      member.addEventListener('click', () => {
        this.switchMember(index);
      });
    });
  }

  switchMember(index) {
    this.currentMember = index;
    this.updateMemberDisplay();
    
    // Update active team member indicator
    document.querySelectorAll('.team-member').forEach((member, i) => {
      member.classList.toggle('active', i === index);
    });
  }

  updateMemberDisplay() {
    const member = this.members[this.currentMember];
    document.getElementById('creator-name').textContent = member.name;
    
    const detailLines = document.querySelectorAll('.detail-line');
    member.details.forEach((detail, index) => {
      if (detailLines[index]) {
        detailLines[index].textContent = detail;
      }
    });
  }
}

// Initialize application
// Universal Settings Manager
class UniversalSettingsManager {
  constructor() {
    this.settingsBtn = document.getElementById('universal-settings-btn');
    this.settingsPanel = document.getElementById('universal-settings-panel');
    this.closeBtn = document.getElementById('close-universal-settings');
    this.languageSelect = document.getElementById('universal-language-select');
    this.themeToggle = document.getElementById('universal-theme-toggle');
    this.languageManager = new LanguageManager();
    this.themeManager = new ThemeManager();
    
    console.log('Universal Settings Manager initialized');
    console.log('Settings button found:', !!this.settingsBtn);
    console.log('Settings panel found:', !!this.settingsPanel);
    
    this.init();
    
    // Initialize language
    this.languageManager.init();
  }
  
  init() {
    // Open settings panel when button is clicked
    if (this.settingsBtn) {
      this.settingsBtn.addEventListener('click', (e) => {
        console.log('Settings button clicked');
        e.stopPropagation(); // Prevent immediate closing
        if (this.settingsPanel) {
          this.settingsPanel.classList.toggle('open');
          console.log('Settings panel toggled, is open:', this.settingsPanel.classList.contains('open'));
        } else {
          console.error('Settings panel not found');
        }
      });
    } else {
      console.error('Settings button not found');
    }
    
    // Close settings panel when close button is clicked
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => {
        console.log('Close button clicked');
        if (this.settingsPanel) {
          this.settingsPanel.classList.remove('open');
        }
      });
    } else {
      console.warn('Close settings button not found');
    }
    
    // Close settings panel when clicking outside
    document.addEventListener('click', (e) => {
      if (this.settingsPanel && !this.settingsPanel.contains(e.target) && e.target !== this.settingsBtn) {
        this.settingsPanel.classList.remove('open');
      }
    });
    
    // Language selection
    if (this.languageSelect) {
      // Set initial value based on current language
      this.languageSelect.value = this.languageManager.currentLanguage;
      
      this.languageSelect.addEventListener('change', (e) => {
        this.languageManager.switchLanguage(e.target.value);
      });
    }
    
    // Theme toggle
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => {
        this.themeManager.toggle();
        this.updateThemeButtonState();
      });
      
      // Update initial theme button state
      this.updateThemeButtonState();
    }
  }
  
  updateThemeButtonState() {
    // Update theme button appearance based on current theme
    if (this.themeManager.currentTheme === 'dark') {
      this.themeToggle.classList.add('dark-active');
    } else {
      this.themeToggle.classList.remove('dark-active');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize universal settings (includes language and theme)
  const universalSettings = new UniversalSettingsManager();
  
  // Initialize additional managers
  const navigationManager = new NavigationManager();
  const examplesCarousel = new ExamplesCarousel();
  const projectsManager = new ProjectsManager();
  const teamManager = new TeamManager();
  
  // Initialize 3D editor (available globally)
  window.editorApp = new EditorApp();
  
  // ตรวจสอบว่าเราอยู่ในหน้า editor และมีโครงการที่กำลังทำงานหรือไม่
  if (document.getElementById('editor-page').classList.contains('active')) {
    const currentProject = localStorage.getItem('currentProject');
    if (currentProject) {
      console.log('Found active project in editor, initializing scene');
      setTimeout(() => {
        window.editorApp.initScene(JSON.parse(currentProject));
      }, 100);
    }
  }

  // Language switcher
  document.getElementById('language-select').addEventListener('change', (e) => {
    languageManager.switchLanguage(e.target.value);
  });

  document.getElementById('editor-language-select').addEventListener('change', (e) => {
    languageManager.switchLanguage(e.target.value);
    document.getElementById('language-select').value = e.target.value;
  });

  // Theme toggle
  document.getElementById('theme-toggle').addEventListener('click', () => {
    themeManager.toggle();
  });
  
  // Get Started button
  document.querySelector('.get-started-btn').addEventListener('click', () => {
    navigationManager.showPage('creative');
  });
  
  // Back buttons
  document.querySelector('.back-btn').addEventListener('click', () => {
    navigationManager.showPage('creative');
  });
  
  // Connect tool buttons
  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      // Simple animation effect on click
      this.classList.add('active');
      setTimeout(() => {
        this.classList.remove('active');
      }, 300);
      
      // Get the tool type from the button text
      const toolType = this.querySelector('span').textContent;
      console.log(`Selected tool: ${toolType}`);
      
      // In a complete implementation, this would activate the tool in the 3D editor
      if (window.editorApp) {
        // Dummy implementation - just show alert for now
        alert(`เครื่องมือ "${toolType}" ถูกเลือก!`);
      }
    });
  });

  // Add entrance animation
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
  
  // Setup keyboard shortcuts notification
  const undoBtn = document.getElementById('undo-btn');
  const redoBtn = document.getElementById('redo-btn');
  
  if (undoBtn) {
    undoBtn.addEventListener('mouseover', () => {
      undoBtn.setAttribute('title', 'Undo (Ctrl+Z)');
    });
  }
  
  if (redoBtn) {
    redoBtn.addEventListener('mouseover', () => {
      redoBtn.setAttribute('title', 'Redo (Ctrl+Shift+Z)');
    });
  }
  
  // Link download buttons
  document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      // Create a dummy PDF download
      const link = document.createElement('a');
      link.href = 'data:application/pdf;base64,JVBERi0xLjcKJeLjz9MKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKL1Jlc291cmNlcyA1IDAgUgo+PgplbmRvYmoKNCAwIG9iago8PAovTGVuZ3RoIDc3Cj4+CnN0cmVhbQpxCjEgMCAwIDEgNTAgNzAwIGNtCkJUCi9GMSAyNCBUZgooM0QgSW50ZXJpb3IgRGVzaWduZXIgRG9jdW1lbnRhdGlvbikgVGoKRVQKUQplbmRzdHJlYW0KZW5kb2JqCjUgMCBvYmoKPDwKL0ZvbnQgPDwKL0YxIDYgMCBSCj4+Cj4+CmVuZG9iago2IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYQo+PgplbmRvYmoKeHJlZgowIDcKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDAwIDAwMDAwIG4gCjAwMDAwMDAwNTMgMDAwMDAgbiAKMDAwMDAwMDEwMyAwMDAwMCBuIAowMDAwMDAwMTk1IDAwMDAwIG4gCjAwMDAwMDAzMTMgMDAwMDAgbiAKMDAwMDAwMDM0NyAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDcKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjQwOAolJUVPRg==';
      link.download = 'interior_designer_doc.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  });

  console.log('3D Interior Designer App initialized successfully!');
});

// Export for potential module usage
export { LanguageManager, ThemeManager, NavigationManager, EditorApp };
