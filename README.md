![PocketCal cover](/public/og.png)

# PocketCal

[![Deploy to GitHub Pages](https://github.com/gimco/pocketcal/actions/workflows/deploy.yml/badge.svg)](https://github.com/gimco/pocketcal/actions/workflows/deploy.yml)

Pick dates, share a link, and that's your calendar.

[PocketCal](https://gimco.github.io/pocketcal/) is a free web app that lets you select dates and instantly share them. No accounts, just a link, and nothing in your way.

## Features

- 🌍 **Multi-language support** - Supports 11 languages with automatic detection
- 📅 **Clean interface** - Minimalist design focused on calendar functionality
- ✏️ **Edit mode** - Toggle between clean view and full editing capabilities
- 🎨 **Event groups** - Organize events with different colors
- 📱 **Responsive** - Works on desktop and mobile devices
- 🔗 **Shareable** - Generate shareable links instantly

## Supported Languages

- English (en)
- Spanish (es)
- Catalan (ca)
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)
- Russian (ru)
- Japanese (ja)
- Korean (ko)
- Chinese (zh)

## Development

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

```bash
git clone https://github.com/gimco/pocketcal.git
cd pocketcal
npm install
```

### Development Server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

## Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. The deployment happens on every push to the main branch.

### Manual Deployment

1. Build the project: `npm run build`
2. Deploy to GitHub Pages: `npm run deploy`

### GitHub Pages Configuration

The project is configured to work with GitHub Pages at the path `/pocketcal/`. If you're deploying to a different repository or custom domain, update the `base` path in `vite.config.ts`.

## License

This project is open source and available under the [MIT License](LICENSE).

## Original Project

This is a fork of the original [PocketCal](https://pocketcal.com/) project with additional features and improvements.

- [Original project](https://pocketcal.com/)
- [How it was built](https://cassidoo.co/post/pocketcal-build-log/)

