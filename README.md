# Welcome To ADHD Browsing

## Project info

**URL**: https://lovable.dev/projects/b585dc5f-50ee-4170-b883-92118a110c00


## Recent Improvements

- Refactored directory structure for maintainability (`components`, `hooks`, `utils`, `services`)
- Standardized coding conventions (naming, indentation, semicolons)
- Extracted duplicated logic into reusable functions/components (e.g., tab utilities, toast, classnames)
- Converted all source and extension files to TypeScript for type safety
- Improved browser extension compatibility (Chrome, Chromium, Firefox)
- Added type annotations and fixed extension API usage

## Setup Instructions

**Use your preferred IDE**

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## What technologies are used for this project?


This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Chrome/Firefox Extension APIs

## How can I deploy this project?


Simply open [Lovable](https://lovable.dev/projects/b585dc5f-50ee-4170-b883-92118a110c00) and click on Share -> Publish.

## Browser Extension Usage

The extension tracks tab relationships and displays them in a hierarchical tree or list view. It works in Chrome, Chromium, and Firefox browsers. All extension scripts are now TypeScript and support modern browser APIs.

### Virtual Nested Tab Groups
Chrome and other browsers only support flat tab groups, but this extension UI supports true nested tab grouping. Every new tab opened from a parent is tracked as a child, and the tree view displays the full hierarchy, allowing you to organize tabs in groups within groups.

### Building the Extension

To build the extension for deployment, use:

```sh
npm run build
```

Then package the files in the `public/` directory as your browser extension.

## Testing the Extension Locally

### Chrome / Chromium
1. Run `npm run build` to generate the extension files.
2. Open Chrome and go to `chrome://extensions`.
3. Enable "Developer mode" (toggle in the top right).
4. Click "Load unpacked" and select the `public/` directory from your project.
5. The extension will appear in your browser. Open a new tab and test its features.

### Firefox
1. Run `npm run build` to generate the extension files.
2. Open Firefox and go to `about:debugging#/runtime/this-firefox`.
3. Click "Load Temporary Add-on" and select the `manifest.json` file from the `public/` directory.
4. The extension will be loaded temporarily. Open a new tab and test its features.

### Notes
- Any changes to the code require rebuilding (`npm run build`) and reloading the extension in your browser.
- For production, package the contents of `public/` as a zip and submit to the browser's extension store.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
