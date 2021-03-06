# Thymeleaf Editor with Preview

This is a browser based editor for Thymeleaf templates. It consists of
- An editor for JSON input data
- An editor for Thymeleaf HTML templates
- An editor for CSS used in the HTML template

## Technology:

- All editors are based on Microsoft [Monaco Editor](https://microsoft.github.io/monaco-editor/) - the editor behind *Visual Studio Code*
- The application is made with [Svelte](https://svelte.dev/)
- It needs a Java backend for applying the Thymeleaf template + CSS file on the JSON data - *coming soon*

## Using Svelte

- Visual Studio:
  - https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode
  - https://marketplace.visualstudio.com/items?itemName=fivethree.vscode-svelte-snippets
- Templates: https://github.com/sveltejs/template

## Build and running in dev mode

```bash
npm install
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000).

## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).


## Single-page app mode

By default, sirv will only respond to requests that match files in `public`. This is to maximise compatibility with static fileservers, allowing you to deploy your app anywhere.

If you're building a single-page app (SPA) with multiple routes, sirv needs to be able to respond to requests for *any* path. You can make it so by editing the `"start"` command in package.json:

```js
"start": "sirv public --single"
```

## Deploying to the web

### With [Vercel](https://vercel.com)

Install `vercel` if you haven't already:

```bash
npm install -g vercel
```

Then, from within your project folder:

```bash
cd public
vercel deploy --name my-project
```

### With [surge](https://surge.sh/)

Install `surge` if you haven't already:

```bash
npm install -g surge
```

Then, from within your project folder:

```bash
npm run build
surge public my-project.surge.sh
```

## TODO

- [ ] Additional Editor for JSON Schema itself
