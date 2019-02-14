# Feature policy playground

A web application to demonstrate the web's new Feature-Policy standard.  Feature policy is a framework spec, so it has sub standards for all the individual policies.  This site acts as a kind of registry for these.

## Developing

This is a React app built with the [create react app](https://github.com/facebook/create-react-app) tool.  To develop on it:

1. Clone this repository to your computer
2. Run `npm install`
3. Run `npm start` to build local data files and run the dev server

The CRA tool comes with a development server that reloads the app automatically when the source files change.

### Policies data and browser compatability data

The data on the policies is stored in `/src/data/policies.json`, and is enriched wirth browser support data from MDN's [browser-compat-data](https://github.com/mdn/browser-compat-data) project by the build script in `build-scripts/browser-compat.js`.  This is run by `npm start` or `npm run build`.

Where compatibility data exists in `policies.json`, it overrides any data we might otherwise import from MDN.

Policies have the following valid properties:

* `name`: string
* `description`: string
* `links`: array of objects, where each object has the following valid props:
    * `type`: string, one of `feature-mdn`, `feature-spec`, `policy-mdn`, `policy-spec`
    * `href`: string
    * `note`: string
* `tags`: array of strings
* `browserSupport`: `false` or object, with browser names as keys, and objects as values.  Objects have the following props:
    * `minVersion`: number
    * `requiresFlag`: boolean

### Demos

Most policies have demos.  These are in `/src/demos`, and each comprises a [Nunjucks](https://mozilla.github.io/nunjucks/templating.html) template containing a block of HTML, JavaScript and CSS.  These templates are built into full web pages by the build script in `/build-scripts/demos.js`, and the finished pages are deposited in `/public/demos`.  There's also a JSON representation of the demo sources so that we can render the source code into syntax highlighted UI.

If demos are edited the build script must be re-run, even in dev, sorry.

### Slow responses service worker

The app depends on some responses being very slow to load.  To enable this without a custom server application, these fetches are slowed down in a service worker.  That's the only purpose for the service worker, and it intentionally is not being used to cache anything.

## Deployment

To deploy the site, run `npm run build`, and push the result to the Github-hosted repo.  The statically built website is published to the `/docs` folder because [GitHub requires this in order to use a subfolder for a GitHub pages site](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/).  After this build step, build artefacts from the custom build steps for demos and browser support are no longer used as all resources required for the site are now bundles into /docs.
