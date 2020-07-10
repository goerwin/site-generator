# TODO
-   typescript support
    - install typescript
    - install @types too
    - tsc --init --jsx react
    - sourcemaps
-   make sure ts-loader uses the tsconfig provided by the user's project
-   tests
-   improve recompilation speed (also measure performance)
-   better logging of typescript errors

# DONE
-   publicPath inside links in pages (dont actually need this, just <a href="/absolute/path">)
-   peerDependencies are removed after every `npm install` and they can't be installed either. This only affects dev (for now adding peer deps in devDeps too)
-   images
-   generate pages from pages folder
