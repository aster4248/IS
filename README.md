# 3D Interior Designer

A modern web-based 3D interior design application inspired by Planner 5D and SketchUp. Design your dream spaces with an intuitive interface and powerful 3D tools.

## Features

### 🏠 Multi-Page Experience
- **Welcome Page**: Attractive landing page with examples and team introduction
- **Project Dashboard**: Manage your design projects with a Canva-style interface
- **3D Editor**: Full-featured 3D editor for interior design

### 🌍 Multilingual Support
- Thai (ไทย) and English language support
- Seamless language switching across all pages

### 🎨 Modern Design
- Light and dark theme support
- Smooth animations and transitions
- Responsive design for all devices
- Professional gradient backgrounds

### 🛠️ 3D Editor Tools
- **Build Tools**: Walls, doors, windows, floors
- **Furniture Categories**: Bedroom, living room, kitchen, bathroom
- **3D Manipulation**: Move, rotate, scale objects
- **Camera Controls**: Orbit, zoom, pan around the scene
- **Undo/Redo**: Full action history support

### ⚙️ Advanced Features
- Project creation with custom room sizes
- Local storage for project persistence
- Keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)
- Interactive furniture placement
- Real-time 3D rendering

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone or download the project files
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production
```bash
npm run build
```

## Project Structure

```
├── index.html          # Main HTML file with all three pages
├── style.css           # Complete styling with themes and responsive design
├── main.js             # Application logic and 3D functionality
├── package.json        # Project dependencies and scripts
├── vite.config.js      # Vite configuration
└── .github/
    └── copilot-instructions.md  # Development guidelines
```

## Usage Guide

### Creating a New Project
1. Navigate to the Creative Projects page
2. Click "Create New Project" 
3. Enter a project name
4. Choose room size (Small/Medium/Large)
5. Start designing in the 3D editor

### Using the 3D Editor
- **Navigation**: Use mouse to orbit around the scene
- **Adding Furniture**: Select from sidebar categories
- **Moving Objects**: Click and drag furniture items
- **Undo/Redo**: Use Ctrl+Z and Ctrl+Shift+Z
- **Settings**: Access camera and lighting controls

### Keyboard Shortcuts
- `Ctrl + Z`: Undo last action
- `Ctrl + Shift + Z`: Redo last undone action
- `Mouse Wheel`: Zoom in/out
- `Mouse Drag`: Rotate camera

## Technical Details

### Built With
- **Vite**: Fast build tool and development server
- **Three.js**: 3D graphics and WebGL rendering
- **Vanilla JavaScript**: Modern ES6+ features
- **CSS Grid & Flexbox**: Responsive layout system
- **CSS Custom Properties**: Dynamic theming

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Customization

### Adding New Furniture
Edit the `furnitureData` object in `main.js` to add new furniture categories and items:

```javascript
bedroom: [
  { 
    name: 'Custom Furniture', 
    color: '#FF0000', 
    size: { width: 1, height: 1, depth: 1 } 
  }
]
```

### Theme Customization
Modify CSS custom properties in `style.css`:

```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
  /* ... other theme variables */
}
```

## Development

### Project Architecture
- **Modular JavaScript**: Separate classes for different functionality
- **Component-based CSS**: Reusable style components
- **Event-driven**: Responsive user interaction system
- **State Management**: Local storage for persistence

### Adding New Features
1. Create new class in `main.js`
2. Add corresponding HTML structure in `index.html`
3. Style with CSS in `style.css`
4. Initialize in the main DOMContentLoaded event

## Contributing

Feel free to contribute to this project by:
- Adding new furniture models
- Improving 3D graphics and rendering
- Enhancing UI/UX design
- Adding new language support
- Optimizing performance

## License

This project is open source and available under the MIT License.

## Support

For support and questions, please check the project documentation or create an issue in the repository.
