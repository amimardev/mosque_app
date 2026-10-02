# Mosque App on TanStack Start

This is the parallel TanStack Start migration project. It follows TanStack's [Build from Scratch](https://tanstack.com/start/latest/docs/framework/react/build-from-scratch) setup and the official React Start basic example.

## Development

Use Node.js 22.12 or newer, then install dependencies with the package manager of your choice:

```sh
npm install
npm run dev
```

Build with `npm run build` and run the Nitro Node output with `npm run start`.

## Migration notes

TanStack Start is built on TanStack Router. Existing file routes, navigation, and reusable UI components in `src/routes` and `src/components` remain on the Router APIs. Start generates `src/routeTree.gen.ts` when its Vite dev server or build runs.

The Start-specific setup is in `src/router.tsx`, `src/routes/__root.tsx`, and `vite.config.ts`. The root route now provides the HTML document, head metadata, global providers, CSS, and hydration scripts. `src/main.tsx` and `src/App.tsx` from the Vite SPA setup were removed.

All browser data operations now call TanStack Start server functions. The former Hono handlers have been moved to private server-side operation modules and are dispatched only from a validated Start server function; there is no REST API server. Authentication uses random opaque session tokens stored as hashes in the database and sent only in an HTTP-only cookie. Logout revokes the current session and expires that cookie.
