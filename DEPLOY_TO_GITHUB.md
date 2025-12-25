# How to Host OpenDiscover on GitHub Pages

Hosting on GitHub Pages is often easier than Google Cloud for static sites.

### 1. Prepare your Project
You need to install a helper tool called `gh-pages`.

Run this in your terminal:
```bash
npm install gh-pages --save-dev
```
*(If you get a permission error, try `cmd /c npm install gh-pages --save-dev`)*

### 2. Update `package.json`
Add these two lines to the `scripts` section in your `package.json` file:

```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist",
  ... (other scripts)
}
```

### 3. Update `vite.config.ts`
You need to tell Vite where the site will be hosted.
Find `vite.config.ts` and add the `base` property.

If your repository is named `my-project`:
```typescript
export default defineConfig({
  base: '/my-project/', // <--- REPLACE 'my-project' WITH YOUR REPO NAME
  plugins: [react()],
})
```
*Note: If you are using a custom domain or a user-site (username.github.io), set `base: '/'`.*

### 4. Deploy!
Run the deploy command:
```bash
npm run deploy
```
*(Or `cmd /c npm run deploy` if PowerShell blocks it)*

This will:
1.  Build your project.
2.  Upload the `dist` folder to a `gh-pages` branch on your GitHub repository.
3.  Your site will be live at `https://<username>.github.io/<repo-name>/`.
