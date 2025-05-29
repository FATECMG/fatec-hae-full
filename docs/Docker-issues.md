# Known Issues

**If you encounter any other issues, and there's a palliative measure available, please, include them here**

- Creating a backend container could return the following error:

```
 TypeError: mime.lookup is not a function
     at ServerResponse.contentType (/app/dist/index.js:22835:48)
     at /app/dist/index.js:72783:9
     at Layer.handle [as handle_request] (/app/dist/index.js:17947:9)
     at trim_prefix (/app/dist/index.js:18349:17)
     at /app/dist/index.js:18322:13
     at Function.process_params (/app/dist/index.js:18357:16)
     at next (/app/dist/index.js:18316:15)
     at jsonParser (/app/dist/index.js:14338:11)
     at Layer.handle [as handle_request] (/app/dist/index.js:17947:9)
     at trim_prefix (/app/dist/index.js:18349:17)
```

- To solve that:
    - Delete the node_modules folder inside BackendFaaSTS
    - [Rebuild only the backend image and run the container](Backend-Docker.md)
    - or
    - [Rebuild the entire application with compose](/README.md)