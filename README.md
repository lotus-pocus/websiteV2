# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

```
websiteV2
├─ directus
│  ├─ data
│  └─ extensions
│     └─ hooks
│        └─ file-routing.js
├─ directus.config.cjs
├─ docker-compose.yml
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ cursor
│  │  ├─ handDefault.png
│  │  └─ handHover.png
│  ├─ flowers
│  │  ├─ bee.png
│  │  ├─ blueflower.png
│  │  ├─ butterfly.png
│  │  ├─ leaves.png
│  │  ├─ pinkflower.png
│  │  ├─ redflower.png
│  │  └─ yellowflower.png
│  ├─ games
│  │  ├─ alien.png
│  │  ├─ android.png
│  │  ├─ controller.png
│  │  ├─ heart.png
│  │  ├─ joystick.png
│  │  ├─ star.png
│  │  └─ vr.png
│  ├─ gamoola.png
│  └─ vite.svg
├─ README.md
├─ src
│  ├─ api
│  │  └─ directus.ts
│  ├─ App.tsx
│  ├─ assets
│  │  ├─ burger.svg
│  │  └─ react.svg
│  ├─ components
│  │  ├─ About.tsx
│  │  ├─ CustomCursor.tsx
│  │  ├─ data
│  │  │  ├─ hero.ts
│  │  │  └─ services.ts
│  │  ├─ FlowerTrail.tsx
│  │  ├─ GameTrail.tsx
│  │  ├─ Hero.tsx
│  │  ├─ Layout.tsx
│  │  ├─ MobileMenu.tsx
│  │  ├─ ScrollPrompt.tsx
│  │  ├─ Section.tsx
│  │  ├─ ServiceCard.tsx
│  │  ├─ ServicesGrid.tsx
│  │  └─ StudioIntro.tsx
│  ├─ directusClient.ts
│  ├─ index.css
│  ├─ main.tsx
│  ├─ pages
│  │  ├─ About.tsx
│  │  ├─ Contact.tsx
│  │  ├─ Home.tsx
│  │  ├─ Labs.tsx
│  │  └─ Work.tsx
│  ├─ types
│  │  └─ directus.d.ts
│  └─ vite-env.d.ts
├─ tailwind.config.js
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```