Files in this directory are shared with the web side.
Do not access secrets inside files in this directory! They will end up bundled into the client.
Secrets must be accessed from `api.config.ts` which the linter forbids using inside `shared/`.
