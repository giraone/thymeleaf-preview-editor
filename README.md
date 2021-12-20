# Thymeleaf Editor with Preview

This is a browser based editor for Thymeleaf templates. It consists of

- An editor for JSON input data
- An editor for Thymeleaf HTML templates
- An editor for CSS used in the HTML template

## Technology:

- All editors are based on Microsoft [Monaco Editor](https://microsoft.github.io/monaco-editor/) - the editor behind _Visual Studio Code_
- The application is made with [Svelte](https://svelte.dev/)
- It needs a Java backend for applying the Thymeleaf template + CSS file on the JSON data - _coming soon_

## Using Svelte

- Visual Studio:
  - https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode
  - https://marketplace.visualstudio.com/items?itemName=fivethree.vscode-svelte-snippets
- Templates: https://github.com/sveltejs/template

## Build and running in dev mode

```bash
npm install
npm run dev
# or
npm run lint-dev
```

Navigate to [localhost:5000](http://localhost:5000).

## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
# or
npm run lint-build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).

## Single-page app mode

By default, sirv will only respond to requests that match files in `public`. This is to maximise compatibility with static fileservers, allowing you to deploy your app anywhere.

If you're building a single-page app (SPA) with multiple routes, sirv needs to be able to respond to requests for _any_ path. You can make it so by editing the `"start"` command in package.json:

```js
"start": "sirv public --single"
```

## Installed Plugins

- `npm install --save-dev prettier-plugin-svelte`
- `npm install --save-dev eslint eslint-plugin-svelte3 babel-eslint`

## Release Notes

- 1.1.0 (2021-12-20)
  - Bulma and Accordion removed
  - New resizable components
