# ⚗️ Angular Nightly Experiments

> **⚠️ UNSTABLE   Here be dragons.**
> This project runs on the Angular **nightly build** pulled directly from the Angular team's GitHub build artifacts. APIs change without notice, things break, and that's the whole point.

---

## What This Repo Is

Angular ships a stable release roughly every six months. But between releases, the team merges new features into `main` daily   and those builds are immediately available if you know where to look.

This repo is a personal lab for exploring those features *before* they land in a stable release. Think of it as living on the bleeding edge of Angular development: you get first access to the newest APIs, but you also get the bugs, the breaking changes, and the occasional build that just doesn't work.

**If you want stability, use Angular 22 stable. If you want to poke the future, stay here.**

---

## Installing Angular 22 Stable

Angular 22 is the current major. Install it the normal way:

```bash
# Install the CLI globally
npm install -g @angular/cli@22

# Create a new app
ng new my-app

# Or upgrade an existing project
ng update @angular/core@22 @angular/cli@22
```

Install packages individually if needed:

```bash
npm install @angular/core@22 @angular/common@22 @angular/forms@22 @angular/router@22
```

That's it. Stable. Boring. Perfect for production.

---

## Installing the Angular Nightly Build

The nightly build is not on npm   it lives in GitHub build artifact repositories that the Angular team publishes after every successful CI run. To use it, you point your dependencies directly at those repos.

> **Want an AI agent to do this for you?** Check out the [install-experimental-angular-skill](https://github.com/Arigatouz/install-experimental-angular-skill) repo   it's a Claude Code skill that automates the entire migration. Just say *"switch to nightly angular"* and it rewrites your `package.json`, handles the pnpm quirks, upgrades TypeScript, and verifies the install. No manual editing required.

```bash
# Install the nightly CLI (published to npm under the "next" tag)
npm install -g @angular/cli@next
```

For your project's `package.json`, swap out the stable package references for GitHub sources:

```json
{
  "dependencies": {
    "@angular/common":            "github:angular/common-builds",
    "@angular/compiler":          "github:angular/compiler-builds",
    "@angular/core":              "github:angular/core-builds",
    "@angular/forms":             "github:angular/forms-builds",
    "@angular/platform-browser":  "github:angular/platform-browser-builds",
    "@angular/router":            "github:angular/router-builds"
  },
  "devDependencies": {
    "@angular/build":             "next",
    "@angular/cli":               "next",
    "@angular/compiler-cli":      "github:angular/compiler-cli-builds"
  }
}
```

Then install:

```bash
npm install
# or with pnpm (what this project uses)
pnpm install
```

> **Note:** GitHub-sourced packages always install the latest commit on the build branch. Run `pnpm install` again any time you want to pull the newest nightly.

---

## What I'm Experimenting With

These are the features being tracked in this repo   things that are already merged into `main` but not yet in a stable release.

### Signal Forms   `@angular/forms/signals`

Reactive, signal-native forms. Already graduated to `@publicApi 22.0` in the nightly. Zero `FormControl` boilerplate, deep TypeScript inference, and conditional rules via `when`.

```typescript
import { form } from '@angular/forms/signals';
import { signal } from '@angular/core';

readonly f = form(signal({ email: '', password: '' }), {
  submission: { action: () => this.login() },
});
```

### WebMCP Tools   `@angular/core`

Expose Angular services and Signal Forms as AI-callable tools via the Web Model Context Protocol. An AI agent can literally call your form's submit action.

```typescript
import { provideExperimentalWebMcpTools, declareExperimentalWebMcpTool } from '@angular/core';
import { provideExperimentalWebMcpForms } from '@angular/forms/signals';

// In main.ts
bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalWebMcpTools([]),
    provideExperimentalWebMcpForms(),
  ],
});
```

### `foreignImports`   Cross-Framework Rendering

Render React, Vue, or any other framework component inside an Angular template   without `CUSTOM_ELEMENTS_SCHEMA`, `viewChild`, or manual lifecycle hooks. The compiler handles it.

```typescript
import { foreignImport } from '@angular/core'; // not yet in public API
import { createRoot } from 'react-dom/client';

function reactAdapter(Comp: unknown) {
  return foreignImport((el: HTMLElement) => {
    createRoot(el).render(createElement(Comp as any, null));
  });
}

@Component({
  foreignImports: [reactAdapter(MyReactButton)],
  template: `<reactAdapter />`,
})
export class AppComponent {}
```

> **Status:** Compiler infrastructure merged. Public API export still pending.

---

## Running This Project

```bash
# Start dev server
ng serve

# Build
ng build

# Unit tests (Vitest)
ng test
```

Navigate to `http://localhost:4200/` after starting the dev server.

---

## Should You Use the Nightly Build?

**In production? Absolutely not.**

**For learning, contributing to Angular, or just being curious about where the framework is headed? Be my guest.**

The nightly build is how you stay ahead of the curve   you'll understand new APIs before the blog posts are written, you'll hit the bugs before everyone else does, and occasionally you'll find something that shapes how you think about building apps entirely.

Just don't deploy it anywhere that matters.

---

## Resources

- [Angular Stable Docs](https://angular.dev)
- [Angular GitHub   `main` branch](https://github.com/angular/angular)
- [Angular CLI Overview](https://angular.dev/tools/cli)
- [Nightly Build Artifacts](https://github.com/angular/core-builds)
- [install-experimental-angular-skill](https://github.com/Arigatouz/install-experimental-angular-skill)   Claude Code skill that automates switching any Angular project to the nightly build
