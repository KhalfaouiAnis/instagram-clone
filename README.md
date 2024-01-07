# Instagram Clone
In this project, i used Vue 3 in Vite to make a basic clone of the main features of the Instagram web app.
Takeaways:
- Solid understanding of Vue 3 project/folder structure
- Working with Vue 3 composition API and hooks.
- How to setup Vue router to navigate between pages.
- How to share state across multiple components using Pinia.
- Some basic CSS animations with Vue.
- other Vue features...

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```
