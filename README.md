# Artisan Education Platform

This is a [Next.js](https://nextjs.org) project built using Next.js 14 with TypeScript, Tailwind CSS, and next-intl for internationalization.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm, yarn, pnpm, or bun (package manager)
- Git (for version control)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sailaukan/artisan-education.git
   cd artisan-education
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Set up environment variables (if needed):
   - Create a `.env.local` file in the root directory

### Running the Development Server

Start the development server with:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run test` - Run tests (if configured)

### Editing the Application

The application follows a structured approach for easy navigation and editing:

1. **Page Editing**:

   - Pages are located in `src/app/[locale]` directory
   - Each locale (language) has its own directory structure
   - Edit page components to modify the content and layout
   - The page auto-updates as you edit the files (hot-reloading)

2. **Component Editing**:

   - Reusable UI components are in `src/components`
   - Edit these to change functionality across multiple pages
   - Components follow a modular structure for easier maintenance

3. **Internationalization**:

   - Language files are located in `messages/[language].json`
   - Add or modify text strings in these files to update content in different languages
   - Use the translation hooks provided by next-intl in your components

4. **Styling**:

   - The project uses Tailwind CSS for styling
   - Modify the `tailwind.config.js` file to customize theme settings
   - Use Tailwind utility classes directly in component JSX
   - Custom styles can be added in CSS modules if needed

5. **Data Editing**:
   - Static data is stored in `src/data` and `public/data.json`
   - Modify these files to update content like contact information, statistics, etc.

### Troubleshooting

If you encounter issues:

1. Ensure all dependencies are installed correctly
2. Check for any console errors in the browser or terminal
3. Verify that environment variables are set properly
4. Try restarting the development server
5. Clear browser cache if needed

## Project Structure

- `src/app/[locale]` - Main application pages with internationalization support
- `src/components` - Reusable UI components
- `src/data` - Data models and static data
- `src/hooks` - Custom React hooks
- `src/lib` - Utility functions and libraries
- `src/i18n` - Internationalization configuration
- `src/types` - TypeScript type definitions

## Assets

The project includes various assets organized in the public directory:

### Texts

- `messages/en.json` - English texts
- `messages/ru.json` - Russian texts
- `messages/kz.json` - Kazakh texts

### Photos and Media

- `public/artisan/` - Pibody hardware section photos
- `public/team/` - Team section photos
  - `team/gallery1.jpg` - Team section main photo
  - `team/gallery2.jpg` - Team section photo 2
  - `team/gallery3.jpg` - Team section photo 3
  - `team/gallery4.jpg` - Team section photo 4
- `public/testimonials/` - Testimonials section photos
  - `testimonials/student.png` - Student testimonial photo
  - `testimonials/teacher.png` - Teacher testimonial photo
  - `testimonials/principal.png` - Principal testimonial photo
- `public/platform/` - Learning platform section photos
  - `platform/platform-self-paced.jpg` - Self-paced learning photo
  - `platform/platform-ide.jpg` - IDE screenshot
  - `platform/platform-collaborative.jpg` - Collaborative features photo
  - `platform/platform-curriculum.jpg` - Curriculum overview photo
- `public/partners/` - Partners section photos
- `public/artisanDemo.mp4` - Hero section preview video

- `public/data.json` - Static data for the site including contact information, social media links, and statistics. Email for contact form is taken from this file.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Next-intl](https://next-intl-docs.vercel.app/) - for internationalization
- [Tailwind CSS](https://tailwindcss.com/docs) - for styling
- [TypeScript](https://www.typescriptlang.org/docs/) - for type safety

## Deployment

The project can be deployed on [Vercel](https://vercel.com/new) or other hosting platforms that support Next.js applications.

```bash
npm run build
npm run start
```

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
