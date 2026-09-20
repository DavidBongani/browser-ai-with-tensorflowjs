# Lesson 2 — Getting TensorFlow.js Running in a Browser

This lesson verifies the browser environment used by the book.

## Run locally

From this directory:

```bash
python -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173
```

The page should report TensorFlow.js 4.22.0 and the active backend.

Using a local web server avoids browser restrictions that often appear when opening files directly with a `file://` URL.

## Test

The Playwright test serves the directory over HTTP and checks that TensorFlow.js loads successfully.
