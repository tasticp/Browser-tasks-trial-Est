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

### Building the Extension

To build the extension for deployment, use:

```sh
npm run build
```

Then package the files in the `public/` directory as your browser extension.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
