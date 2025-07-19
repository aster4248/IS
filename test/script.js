// Global variables
let scene, camera, renderer, controls;
let ambientLight, directionalLight;
let currentFunction = 'build';
let selectedObject = null;
let isDragging = false;
let isResizing = false;
let projects = JSON.parse(localStorage.getItem('designProjects')) || [];

// Demo furniture items for each category
const furnitureItems = {
    // Build categories
    walls: [
        { id: 'wall1', name: 'Standard Wall', image: 'wall_standard.png', model: 'wall_standard.glb' },
        { id: 'wall2', name: 'Partition Wall', image: 'wall_partition.png', model: 'wall_partition.glb' },
        { id: 'wall3', name: 'Curved Wall', image: 'wall_curved.png', model: 'wall_curved.glb' }
    ],
    floors: [
        { id: 'floor1', name: 'Wooden Floor', image: 'floor_wooden.png', model: 'floor_wooden.glb' },
        { id: 'floor2', name: 'Tile Floor', image: 'floor_tile.png', model: 'floor_tile.glb' },
        { id: 'floor3', name: 'Carpet Floor', image: 'floor_carpet.png', model: 'floor_carpet.glb' }
    ],
    doors: [
        { id: 'door1', name: 'Standard Door', image: 'door_standard.png', model: 'door_standard.glb' },
        { id: 'door2', name: 'Sliding Door', image: 'door_sliding.png', model: 'door_sliding.glb' },
        { id: 'door3', name: 'French Door', image: 'door_french.png', model: 'door_french.glb' }
    ],
    windows: [
        { id: 'window1', name: 'Standard Window', image: 'window_standard.png', model: 'window_standard.glb' },
        { id: 'window2', name: 'Bay Window', image: 'window_bay.png', model: 'window_bay.glb' },
        { id: 'window3', name: 'Skylight', image: 'window_skylight.png', model: 'window_skylight.glb' }
    ],
    stairs: [
        { id: 'stair1', name: 'Straight Stairs', image: 'stairs_straight.png', model: 'stairs_straight.glb' },
        { id: 'stair2', name: 'Spiral Stairs', image: 'stairs_spiral.png', model: 'stairs_spiral.glb' },
        { id: 'stair3', name: 'L-Shaped Stairs', image: 'stairs_l_shaped.png', model: 'stairs_l_shaped.glb' }
    ],

    // Furnish categories
    general: [
        { id: 'chair1', name: 'Chair', image: 'chair.png', model: 'https://cdn.jsdelivr.net/gh/aster4248/IS@main/models/chair1.glb' }
    ],
    bedroom: [
        { id: 'bed1', name: 'Single Bed', image: 'bed_single.png', model: 'bed_single.glb' },
        { id: 'bed2', name: 'Double Bed', image: 'bed_double.png', model: 'bed_double.glb' },
        { id: 'wardrobe1', name: 'Wardrobe', image: 'wardrobe.png', model: 'wardrobe.glb' },
        { id: 'nightstand1', name: 'Nightstand', image: 'nightstand.png', model: 'nightstand.glb' },
        { id: 'dresser1', name: 'Dresser', image: 'dresser.png', model: 'dresser.glb' }
    ],
    livingroom: [
        { id: 'sofa1', name: 'Sofa', image: 'sofa.png', model: 'sofa.glb' },
        { id: 'coffee_table1', name: 'Coffee Table', image: 'coffee_table.png', model: 'coffee_table.glb' },
        { id: 'tv_stand1', name: 'TV Stand', image: 'tv_stand.png', model: 'tv_stand.glb' },
        { id: 'armchair1', name: 'Armchair', image: 'armchair.png', model: 'armchair.glb' },
        { id: 'bookshelf1', name: 'Bookshelf', image: 'bookshelf.png', model: 'bookshelf.glb' }
    ],
    kitchen: [
        { id: 'cabinet1', name: 'Cabinet', image: 'cabinet.png', model: 'cabinet.glb' },
        { id: 'sink1', name: 'Sink', image: 'sink.png', model: 'sink.glb' },
        { id: 'stove1', name: 'Stove', image: 'stove.png', model: 'stove.glb' },
        { id: 'refrigerator1', name: 'Refrigerator', image: 'refrigerator.png', model: 'refrigerator.glb' },
        { id: 'kitchen_island1', name: 'Kitchen Island', image: 'kitchen_island.png', model: 'kitchen_island.glb' }
    ],
    bathroom: [
        { id: 'toilet1', name: 'Toilet', image: 'toilet.png', model: 'toilet.glb' },
        { id: 'bathtub1', name: 'Bathtub', image: 'bathtub.png', model: 'bathtub.glb' },
        { id: 'shower1', name: 'Shower', image: 'shower.png', model: 'shower.glb' },
        { id: 'sink_bathroom1', name: 'Bathroom Sink', image: 'bathroom_sink.png', model: 'bathroom_sink.glb' },
        { id: 'mirror1', name: 'Mirror', image: 'mirror.png', model: 'mirror.glb' }
    ],
    office: [
        { id: 'desk1', name: 'Desk', image: 'desk.png', model: 'desk.glb' },
        { id: 'office_chair1', name: 'Office Chair', image: 'office_chair.png', model: 'office_chair.glb' },
        { id: 'filing_cabinet1', name: 'Filing Cabinet', image: 'filing_cabinet.png', model: 'filing_cabinet.glb' },
        { id: 'bookcase1', name: 'Bookcase', image: 'bookcase.png', model: 'bookcase.glb' },
        { id: 'desk_lamp1', name: 'Desk Lamp', image: 'desk_lamp.png', model: 'desk_lamp.glb' }
    ],

    // Outdoor categories
    plants: [
        { id: 'tree1', name: 'Tree', image: 'tree.png', model: 'tree.glb' },
        { id: 'bush1', name: 'Bush', image: 'bush.png', model: 'bush.glb' },
        { id: 'flower1', name: 'Flowers', image: 'flowers.png', model: 'flowers.glb' },
        { id: 'grass1', name: 'Grass', image: 'grass.png', model: 'grass.glb' }
    ],
    furniture: [
        { id: 'outdoor_chair1', name: 'Outdoor Chair', image: 'outdoor_chair.png', model: 'outdoor_chair.glb' },
        { id: 'outdoor_table1', name: 'Outdoor Table', image: 'outdoor_table.png', model: 'outdoor_table.glb' },
        { id: 'bench1', name: 'Bench', image: 'bench.png', model: 'bench.glb' },
        { id: 'hammock1', name: 'Hammock', image: 'hammock.png', model: 'hammock.glb' }
    ],
    decor: [
        { id: 'fountain1', name: 'Fountain', image: 'fountain.png', model: 'fountain.glb' },
        { id: 'statue1', name: 'Statue', image: 'statue.png', model: 'statue.glb' },
        { id: 'bbq1', name: 'BBQ Grill', image: 'bbq.png', model: 'bbq.glb' },
        { id: 'pond1', name: 'Pond', image: 'pond.png', model: 'pond.glb' }
    ],
    lighting: [
        { id: 'pathway_light1', name: 'Pathway Light', image: 'pathway_light.png', model: 'pathway_light.glb' },
        { id: 'spotlight1', name: 'Spotlight', image: 'spotlight.png', model: 'spotlight.glb' },
        { id: 'lantern1', name: 'Lantern', image: 'lantern.png', model: 'lantern.glb' },
        { id: 'string_lights1', name: 'String Lights', image: 'string_lights.png', model: 'string_lights.glb' }
    ]
};

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    updateProjectsList();
    
    // Apply saved theme
    const savedTheme = localStorage.getItem('designAppTheme') || 'light';
    setTheme(savedTheme);
    setTimeout(() => {
        const themeOption = document.querySelector(`.theme-option[data-theme="${savedTheme}"]`);
        if (themeOption) {
            themeOption.classList.add('active');
        }
    }, 100);
});

// Set up event listeners
function initializeEventListeners() {
    // Welcome screen events
    document.getElementById('create-project-btn').addEventListener('click', createNewProject);
    
    // Room size modal events
    document.getElementById('room-width').addEventListener('input', updateRoomPreview);
    document.getElementById('room-length').addEventListener('input', updateRoomPreview);
    document.getElementById('confirm-room-btn').addEventListener('click', initializeRoom);
    document.getElementById('cancel-room-btn').addEventListener('click', () => {
        document.getElementById('room-size-modal').style.display = 'none';
    });

    // Function tab events
    document.querySelectorAll('.function-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            switchFunction(tab.getAttribute('data-function'));
        });
    });

    // Category events
    document.querySelectorAll('.category').forEach(category => {
        category.addEventListener('click', () => {
            showCategoryItems(category.getAttribute('data-category'));
        });
    });

    // Back button in items view
    document.querySelector('.back-btn').addEventListener('click', hideItemsContainer);

    // Control buttons
    document.getElementById('light-btn').addEventListener('click', toggleLightingPanel);
    document.getElementById('close-lighting').addEventListener('click', toggleLightingPanel);
    document.getElementById('theme-btn').addEventListener('click', toggleThemePanel);
    document.getElementById('close-theme').addEventListener('click', toggleThemePanel);
    document.getElementById('camera-btn').addEventListener('click', resetCamera);
    document.getElementById('save-btn').addEventListener('click', saveProject);
    document.getElementById('exit-btn').addEventListener('click', exitToMenu);

    // Lighting sliders
    document.getElementById('ambient-light').addEventListener('input', adjustLighting);
    document.getElementById('directional-light').addEventListener('input', adjustLighting);
    
    // Theme options
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-theme');
            setTheme(theme);
            
            // Update active state
            document.querySelectorAll('.theme-option').forEach(opt => {
                opt.classList.remove('active');
            });
            option.classList.add('active');
        });
    });
    
    // Object control buttons and sliders
    document.getElementById('object-scale').addEventListener('input', adjustObjectScale);
    document.getElementById('object-rotation').addEventListener('input', adjustObjectRotation);
    document.getElementById('move-up').addEventListener('click', moveObjectUp);
    document.getElementById('move-down').addEventListener('click', moveObjectDown);
    document.getElementById('delete-object').addEventListener('click', deleteSelectedObject);

    // Search functionality
    document.getElementById('search-btn').addEventListener('click', searchFurniture);
    
    // Canvas click for object selection
    document.getElementById('canvas3d').addEventListener('click', onCanvasClick);
}

// Create a new project - show room size modal
function createNewProject() {
    document.getElementById('room-size-modal').style.display = 'flex';
    updateRoomPreview();
}

// Initialize room with selected size
function initializeRoom() {
    const width = parseInt(document.getElementById('room-width').value);
    const length = parseInt(document.getElementById('room-length').value);
    
    // Hide modal and welcome screen
    document.getElementById('room-size-modal').style.display = 'none';
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('design-area').style.display = 'block';
    
    // Initialize 3D scene with custom room size
    initThreeJS(width, length);
}

// Update the room preview in the modal
function updateRoomPreview() {
    const width = parseInt(document.getElementById('room-width').value);
    const length = parseInt(document.getElementById('room-length').value);
    const previewElement = document.getElementById('room-preview-visual');
    
    // Keep aspect ratio but scale to fit
    const maxDimension = Math.max(width, length);
    const scale = 180 / maxDimension; // 180px is the base size
    
    const scaledWidth = width * scale;
    const scaledLength = length * scale;
    
    previewElement.style.width = `${scaledWidth}px`;
    previewElement.style.height = `${scaledLength}px`;
}

// Initialize Three.js scene
function initThreeJS(roomWidth = 10, roomLength = 10) {
    // Create scene
    scene = new THREE.Scene();
    
    // Set background based on theme
    let isDarkMode = document.body.classList.contains('dark-mode');
    scene.background = new THREE.Color(isDarkMode ? 0x222222 : 0xeeeeee);

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Adjust camera position based on room size
    const maxDimension = Math.max(roomWidth, roomLength);
    camera.position.set(maxDimension * 0.7, maxDimension * 0.5, maxDimension * 0.7);
    camera.lookAt(0, 0, 0);

    // Create renderer
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('canvas3d'),
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // Create controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Create lights
    ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(roomWidth/2, roomLength, roomLength/2);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create a grid helper with colors based on theme - adjust size to room
    const gridSize = Math.max(roomWidth, roomLength);
    const gridDivisions = Math.round(gridSize);
    const gridHelper = new THREE.GridHelper(
        gridSize, 
        gridDivisions, 
        isDarkMode ? 0x555555 : 0x888888, 
        isDarkMode ? 0x333333 : 0xdddddd
    );
    scene.add(gridHelper);

    // Create a floor plane based on room size
    const planeGeometry = new THREE.PlaneGeometry(roomWidth, roomLength);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xaaaaaa,
        side: THREE.DoubleSide,
        roughness: 0.8
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    plane.receiveShadow = true;
    plane.position.set(0, 0, 0); // Center the floor
    scene.add(plane);

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation loop
    animate();
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Switch between function tabs
function switchFunction(functionName) {
    currentFunction = functionName;
    
    // Update active tab
    document.querySelectorAll('.function-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-function') === functionName) {
            tab.classList.add('active');
        }
    });
    
    // Show corresponding content
    document.querySelectorAll('.function-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${functionName}-content`).classList.add('active');
    
    // Hide items container if it's visible
    hideItemsContainer();
}

// Show items for the selected category
function showCategoryItems(categoryName) {
    const itemsContainer = document.querySelector('.items-container');
    const itemsList = document.getElementById('items-list');
    const categoryTitle = document.getElementById('category-title');
    
    // Update title and clear previous items
    categoryTitle.textContent = categoryName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    itemsList.innerHTML = '';
    
    // Add items for this category
    if (furnitureItems[categoryName]) {
        furnitureItems[categoryName].forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'item-card';
            itemCard.setAttribute('data-id', item.id);
            
            const itemImage = document.createElement('div');
            itemImage.className = 'item-image';
            
            // For demonstration, we'll use placeholder text instead of actual images
            itemImage.textContent = item.name.charAt(0);
            
            const itemName = document.createElement('div');
            itemName.className = 'item-name';
            itemName.textContent = item.name;
            
            itemCard.appendChild(itemImage);
            itemCard.appendChild(itemName);
            
            // Add click event to add the item to the scene
            itemCard.addEventListener('click', () => {
                addItemToScene(item);
            });
            
            // Add hover effect
            itemCard.addEventListener('mouseenter', () => {
                itemCard.style.transform = 'scale(1.05)';
            });
            
            itemCard.addEventListener('mouseleave', () => {
                itemCard.style.transform = 'scale(1)';
            });
            
            itemsList.appendChild(itemCard);
        });
    }
    
    // Show the items container
    itemsContainer.style.display = 'block';
}

// Hide items container
function hideItemsContainer() {
    document.querySelector('.items-container').style.display = 'none';
}

// Add an item to the 3D scene
function addItemToScene(item) {
    // Show loading indicator or message
    console.log(`Loading ${item.name}...`);
    
    // Check if the model path is a URL or a local path
    const modelPath = item.model;
    
    if (modelPath.includes('http')) {
        // It's a URL (like the chair model)
        loadGLBModel(modelPath, item);
    } else {
        // For demo purposes, create a placeholder for other items
        createPlaceholderObject(item);
    }
}

// Load a GLB model from URL
function loadGLBModel(modelUrl, item) {
    const loader = new THREE.GLTFLoader();
    
    loader.load(
        modelUrl,
        // onLoad callback
        function(gltf) {
            const model = gltf.scene;
            
            // Apply standard material properties
            model.traverse(function(child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            
            // Position the model
            model.position.set(0, 0, 0);
            
            // Scale model appropriately (adjust as needed for specific models)
            model.scale.set(1, 1, 1);
            
            // Add metadata
            model.userData = { 
                type: 'furniture', 
                name: item.name, 
                id: item.id 
            };
            
            // Add to scene
            scene.add(model);
            selectObject(model);
            
            console.log(`Added ${item.name} to scene`);
        },
        // onProgress callback
        function(xhr) {
            console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`);
        },
        // onError callback
        function(error) {
            console.error('Error loading model:', error);
            // Create a placeholder if model fails to load
            createPlaceholderObject(item);
        }
    );
}

// Create a placeholder object for items without models
function createPlaceholderObject(item) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ 
        color: getRandomColor(),
        roughness: 0.7
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(0, 0.5, 0);
    mesh.userData = { 
        type: 'furniture', 
        name: item.name, 
        id: item.id 
    };
    
    scene.add(mesh);
    selectObject(mesh);
    
    console.log(`Added placeholder for ${item.name} to scene`);
}

// Select an object in the scene
function selectObject(object) {
    // Deselect previous object if any
    if (selectedObject) {
        // Remove highlight effect
        if (selectedObject.userData.selectionBox) {
            scene.remove(selectedObject.userData.selectionBox);
            delete selectedObject.userData.selectionBox;
        }
    }
    
    selectedObject = object;
    
    // Add highlight effect to selected object
    if (selectedObject) {
        // Create a bounding box helper
        const boundingBox = new THREE.Box3().setFromObject(selectedObject);
        const size = boundingBox.getSize(new THREE.Vector3());
        const boxGeometry = new THREE.BoxGeometry(size.x + 0.1, size.y + 0.1, size.z + 0.1);
        
        // Create wireframe material
        const boxMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true,
            transparent: true,
            opacity: 0.5
        });
        
        // Create mesh for the selection box
        const selectionBox = new THREE.Mesh(boxGeometry, boxMaterial);
        
        // Position it correctly
        const center = boundingBox.getCenter(new THREE.Vector3());
        selectionBox.position.copy(center);
        
        // Store reference to selection box
        selectedObject.userData.selectionBox = selectionBox;
        
        // Add to scene
        scene.add(selectionBox);
        
        // Show object controls
        showObjectControls();
        
        // Log selection
        console.log(`Selected: ${selectedObject.userData.name}`);
    } else {
        // Hide object controls
        hideObjectControls();
    }
}

// Toggle the lighting panel
function toggleLightingPanel() {
    const panel = document.getElementById('lighting-panel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

// Adjust scene lighting
function adjustLighting() {
    const ambientValue = parseFloat(document.getElementById('ambient-light').value);
    const directionalValue = parseFloat(document.getElementById('directional-light').value);
    
    ambientLight.intensity = ambientValue;
    directionalLight.intensity = directionalValue;
}

// Reset camera to default position
function resetCamera() {
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    controls.update();
}

// Save current project
function saveProject() {
    // In a real app, we would save the scene data here
    const projectName = prompt('Enter a name for your project:');
    
    if (projectName) {
        const newProject = {
            id: Date.now(),
            name: projectName,
            date: new Date().toLocaleDateString(),
            // In a real app, we'd save the scene data here
            thumbnail: 'project_thumbnail.jpg' // Placeholder
        };
        
        projects.push(newProject);
        localStorage.setItem('designProjects', JSON.stringify(projects));
        
        alert('Project saved successfully!');
    }
}

// Exit to menu
function exitToMenu() {
    if (confirm('Are you sure you want to exit? Unsaved changes will be lost.')) {
        document.getElementById('design-area').style.display = 'none';
        document.getElementById('welcome-screen').style.display = 'flex';
        updateProjectsList();
    }
}

// Update the projects list on the welcome screen
function updateProjectsList() {
    const projectList = document.getElementById('project-list');
    
    if (projects.length === 0) {
        projectList.innerHTML = '<p class="empty-message">No projects yet</p>';
    } else {
        projectList.innerHTML = '';
        
        projects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.className = 'project-item';
            projectItem.innerHTML = `
                <div class="project-info">
                    <h3>${project.name}</h3>
                    <p>Created: ${project.date}</p>
                </div>
                <button class="open-project-btn" data-id="${project.id}">Open</button>
            `;
            
            projectList.appendChild(projectItem);
        });
        
        // Add open project event listeners
        document.querySelectorAll('.open-project-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                openProject(parseInt(btn.getAttribute('data-id')));
            });
        });
    }
}

// Open a saved project
function openProject(projectId) {
    // In a real app, we would load the project data here
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('design-area').style.display = 'block';
    initThreeJS();
    
    // For demonstration, we'll just log the action
    console.log(`Opening project with ID: ${projectId}`);
}

// Search for furniture
function searchFurniture() {
    const searchQuery = document.getElementById('furniture-search').value.toLowerCase();
    const searchResults = document.getElementById('search-results');
    
    if (!searchQuery) {
        searchResults.innerHTML = '<p>Please enter a search term</p>';
        return;
    }
    
    searchResults.innerHTML = '';
    let resultsFound = false;
    
    // Search through all categories
    Object.keys(furnitureItems).forEach(category => {
        furnitureItems[category].forEach(item => {
            if (item.name.toLowerCase().includes(searchQuery)) {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <p>${item.name} (${category})</p>
                    <button class="add-item-btn" data-id="${item.id}" data-category="${category}">Add</button>
                `;
                
                searchResults.appendChild(resultItem);
                resultsFound = true;
            }
        });
    });
    
    if (!resultsFound) {
        searchResults.innerHTML = '<p>No results found</p>';
    } else {
        // Add event listeners to the "Add" buttons
        document.querySelectorAll('.add-item-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = btn.getAttribute('data-id');
                const category = btn.getAttribute('data-category');
                const item = furnitureItems[category].find(item => item.id === itemId);
                
                if (item) {
                    addItemToScene(item);
                }
            });
        });
    }
}

// Helper function to generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Variables for dragging
let dragStartPosition = new THREE.Vector2();
let dragPlane = new THREE.Plane();
let dragOffset = new THREE.Vector3();
let dragIntersection = new THREE.Vector3();

// Handle canvas click for object selection
function onCanvasClick(event) {
    // Don't process click events during drag
    if (isDragging) return;
    
    // Get mouse position
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Create raycaster
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    // Get all objects in the scene (excluding helpers, selectionBoxes, etc)
    const objects = [];
    scene.traverse(function(object) {
        if (object.isMesh && 
            (!object.parent || !object.parent.isHelper) && 
            object.userData && 
            object.userData.type === 'furniture') {
            objects.push(object);
        }
    });
    
    // Check for intersections
    const intersects = raycaster.intersectObjects(objects, true);
    
    if (intersects.length > 0) {
        // Find the parent object with userData
        let selectedObj = intersects[0].object;
        while (selectedObj && (!selectedObj.userData || !selectedObj.userData.type)) {
            selectedObj = selectedObj.parent;
        }
        
        if (selectedObj) {
            selectObject(selectedObj);
            showObjectControls();
        }
    } else {
        // Clicked on empty space, deselect
        if (selectedObject) {
            // Remove highlight effect
            if (selectedObject.userData.selectionBox) {
                scene.remove(selectedObject.userData.selectionBox);
                delete selectedObject.userData.selectionBox;
            }
            selectedObject = null;
            hideObjectControls();
        }
    }
}

// Add drag handlers to the canvas
function setupDragHandlers() {
    const canvas = document.getElementById('canvas3d');
    
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseUp);
    
    // Touch support
    canvas.addEventListener('touchstart', onTouchStart);
    canvas.addEventListener('touchmove', onTouchMove);
    canvas.addEventListener('touchend', onTouchEnd);
}

function onMouseDown(event) {
    if (!selectedObject) return;
    
    // Only start drag if control key is pressed or if it's a long touch on mobile
    if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        startDrag(event.clientX, event.clientY);
    }
}

function onMouseMove(event) {
    if (!isDragging) return;
    
    event.preventDefault();
    updateDragPosition(event.clientX, event.clientY);
}

function onMouseUp(event) {
    if (!isDragging) return;
    
    event.preventDefault();
    endDrag();
}

function onTouchStart(event) {
    if (!selectedObject || event.touches.length !== 1) return;
    
    event.preventDefault();
    startDrag(event.touches[0].clientX, event.touches[0].clientY);
}

function onTouchMove(event) {
    if (!isDragging || event.touches.length !== 1) return;
    
    event.preventDefault();
    updateDragPosition(event.touches[0].clientX, event.touches[0].clientY);
}

function onTouchEnd(event) {
    if (!isDragging) return;
    
    event.preventDefault();
    endDrag();
}

function startDrag(clientX, clientY) {
    isDragging = true;
    document.body.classList.add('dragging');
    
    // Store start position
    dragStartPosition.x = (clientX / window.innerWidth) * 2 - 1;
    dragStartPosition.y = -(clientY / window.innerHeight) * 2 + 1;
    
    // Create a plane for dragging
    const normal = new THREE.Vector3(0, 1, 0); // Up vector
    const position = selectedObject.position.clone();
    dragPlane.setFromNormalAndCoplanarPoint(normal, position);
    
    // Calculate the offset from the object's position
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(dragStartPosition, camera);
    
    if (raycaster.ray.intersectPlane(dragPlane, dragIntersection)) {
        dragOffset.copy(selectedObject.position).sub(dragIntersection);
    }
}

function updateDragPosition(clientX, clientY) {
    if (!isDragging) return;
    
    const mousePosition = new THREE.Vector2(
        (clientX / window.innerWidth) * 2 - 1,
        -(clientY / window.innerHeight) * 2 + 1
    );
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mousePosition, camera);
    
    if (raycaster.ray.intersectPlane(dragPlane, dragIntersection)) {
        // Apply the offset to maintain relative position
        const newPosition = dragIntersection.add(dragOffset);
        
        // Update object position
        selectedObject.position.copy(newPosition);
        
        // Update selection box position
        if (selectedObject.userData.selectionBox) {
            selectedObject.userData.selectionBox.position.copy(newPosition);
        }
    }
}

function endDrag() {
    isDragging = false;
    document.body.classList.remove('dragging');
}

// Show object controls panel
function showObjectControls() {
    if (!selectedObject) return;
    
    const objectControls = document.getElementById('object-controls');
    objectControls.style.display = 'flex';
    
    // Reset sliders to current object values
    document.getElementById('object-scale').value = selectedObject.scale.x;
    
    // Calculate rotation in degrees (0-360)
    const rotationDegrees = (selectedObject.rotation.y * (180/Math.PI)) % 360;
    document.getElementById('object-rotation').value = rotationDegrees < 0 ? rotationDegrees + 360 : rotationDegrees;
}

// Hide object controls panel
function hideObjectControls() {
    document.getElementById('object-controls').style.display = 'none';
}

// Adjust object scale
function adjustObjectScale() {
    if (!selectedObject) return;
    
    const scale = parseFloat(document.getElementById('object-scale').value);
    selectedObject.scale.set(scale, scale, scale);
    
    // Update selection box
    if (selectedObject.userData.selectionBox) {
        scene.remove(selectedObject.userData.selectionBox);
        delete selectedObject.userData.selectionBox;
        
        // Recreate selection box with new scale
        const boundingBox = new THREE.Box3().setFromObject(selectedObject);
        const size = boundingBox.getSize(new THREE.Vector3());
        const boxGeometry = new THREE.BoxGeometry(size.x + 0.1, size.y + 0.1, size.z + 0.1);
        
        const boxMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true,
            transparent: true,
            opacity: 0.5
        });
        
        const selectionBox = new THREE.Mesh(boxGeometry, boxMaterial);
        
        const center = boundingBox.getCenter(new THREE.Vector3());
        selectionBox.position.copy(center);
        
        selectedObject.userData.selectionBox = selectionBox;
        scene.add(selectionBox);
    }
}

// Adjust object rotation
function adjustObjectRotation() {
    if (!selectedObject) return;
    
    const rotationDegrees = parseFloat(document.getElementById('object-rotation').value);
    const rotationRadians = rotationDegrees * (Math.PI/180);
    
    selectedObject.rotation.y = rotationRadians;
    
    // Update selection box position
    if (selectedObject.userData.selectionBox) {
        const boundingBox = new THREE.Box3().setFromObject(selectedObject);
        const center = boundingBox.getCenter(new THREE.Vector3());
        selectedObject.userData.selectionBox.position.copy(center);
        selectedObject.userData.selectionBox.rotation.y = rotationRadians;
    }
}

// Move object up
function moveObjectUp() {
    if (!selectedObject) return;
    
    selectedObject.position.y += 0.2;
    
    // Update selection box
    if (selectedObject.userData.selectionBox) {
        selectedObject.userData.selectionBox.position.y += 0.2;
    }
}

// Move object down
function moveObjectDown() {
    if (!selectedObject) return;
    
    selectedObject.position.y -= 0.2;
    if (selectedObject.position.y < 0) selectedObject.position.y = 0;
    
    // Update selection box
    if (selectedObject.userData.selectionBox) {
        selectedObject.userData.selectionBox.position.y -= 0.2;
        if (selectedObject.userData.selectionBox.position.y < 0) selectedObject.userData.selectionBox.position.y = 0;
    }
}

// Delete selected object
function deleteSelectedObject() {
    if (!selectedObject) return;
    
    // Remove selection box if exists
    if (selectedObject.userData.selectionBox) {
        scene.remove(selectedObject.userData.selectionBox);
    }
    
    // Remove object from scene
    scene.remove(selectedObject);
    selectedObject = null;
    
    // Hide controls
    hideObjectControls();
}

// Toggle theme settings panel
function toggleThemePanel() {
    const panel = document.getElementById('theme-panel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

// Set the theme
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        
        // Update scene background for dark mode
        if (scene) {
            scene.background = new THREE.Color(0x222222);
            
            // Update grid helper color for better visibility in dark mode
            if (scene.children) {
                scene.children.forEach(child => {
                    if (child instanceof THREE.GridHelper) {
                        scene.remove(child);
                        const newGridHelper = new THREE.GridHelper(20, 20, 0x555555, 0x333333);
                        scene.add(newGridHelper);
                    }
                });
            }
        }
    } else {
        document.body.classList.remove('dark-mode');
        
        // Update scene background for light mode
        if (scene) {
            scene.background = new THREE.Color(0xeeeeee);
            
            // Update grid helper color for better visibility in light mode
            if (scene.children) {
                scene.children.forEach(child => {
                    if (child instanceof THREE.GridHelper) {
                        scene.remove(child);
                        const newGridHelper = new THREE.GridHelper(20, 20, 0x888888, 0xdddddd);
                        scene.add(newGridHelper);
                    }
                });
            }
        }
    }
    
    // Save theme preference
    localStorage.setItem('designAppTheme', theme);
    console.log(`Theme set to: ${theme}`);
}