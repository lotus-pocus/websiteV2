// src/directusClient.ts
import { createDirectus, rest } from 'directus';

// Replace with your actual Directus URL
const directus = createDirectus('http://localhost:8055') // or your hosted CMS URL
  .with(rest());

export default directus;
