# Map proxy diagnosis

The Manus maps proxy returned HTTP 401 JSON when no key was supplied. With the injected frontend key but no browser origin, it returned HTTP 403 JSON: `{"error":"origin is required"}`. Repeating the request with an HTTP `Origin` header returned HTTP 200 and JavaScript payload content. The loader was updated to use a browser `fetch` with CORS mode and omitted credentials, which causes the browser to provide the required Origin header, then injects the validated JavaScript payload and reports initialization failures through `onMapError`.

The nearby panel retains compatible-directory fallback content if map initialization fails.

Verification date: 2026-08-27.
