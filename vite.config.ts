import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  optimizeDeps: {
    include: [
      'svelte-icons/fi/FiGithub',
      'svelte-icons/fi/FiLinkedin',
      'svelte-icons/fi/FiTwitter',
      'svelte-icons/fi/FiInstagram',
      'svelte-icons/fi/FiMail',
      'svelte-icons/fi/FiMessageCircle'
    ]
  },
  ssr: {
    noExternal: ['svelte-icons']
  }
});
