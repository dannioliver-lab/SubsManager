# SubsManager

A modern subscription management application with an intuitive homescreen interface.

## Features

- 🎨 **Dark & Light Mode**: Automatic theme detection with manual toggle
- 📱 **Responsive Design**: Optimized for mobile, tablet, and desktop
- ♿ **Accessible**: WCAG AA compliant with proper ARIA labels
- ⚡ **Fast**: Built with React and Vite for optimal performance
- 🎯 **User-Friendly**: Quick actions and recent activity at your fingertips

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Project Structure

- `src/components/` - Reusable React components
  - `Header/` - Sticky header with navigation and theme toggle
  - `QuickActions/` - Quick action cards for common tasks
  - `RecentActivity/` - Recent subscription activity feed
  - `LoadingSkeleton/` - Loading state components
- `src/contexts/` - React context providers (theme management)
- `src/App.tsx` - Main application component
- `src/index.css` - Global styles and theme variables

## Documentation

See [HOMESCREEN.md](./HOMESCREEN.md) for detailed documentation about the homescreen layout implementation.

## Tech Stack

- React 19
- TypeScript
- Vite
- CSS with CSS Variables

## Screenshots

### Desktop - Light Mode
![Desktop Light Mode](https://github.com/user-attachments/assets/ae4f8f61-67b9-4207-9e30-63966e5216b8)

### Desktop - Dark Mode
![Desktop Dark Mode](https://github.com/user-attachments/assets/50f10c01-73b8-44a7-b7d5-cfa4fff712b9)

### Mobile - Light Mode
![Mobile Light Mode](https://github.com/user-attachments/assets/a7798fbb-f272-489a-af87-6479a8eaecd5)

### Mobile - Dark Mode
![Mobile Dark Mode](https://github.com/user-attachments/assets/53e6f0bb-211f-4f27-9af4-509c15206c5b)

### Tablet View
![Tablet View](https://github.com/user-attachments/assets/c9584b0d-3466-48fb-b361-4e26da6e0278)

## License

MIT
