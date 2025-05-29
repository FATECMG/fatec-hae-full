# Running Backend Docker

- First enter on Backend folder:

```
> cd BackendFaaSTS
```

- Build docker image:

```
> docker image build -t fatec-hae:backend .
```

- Run a docker container:

```
> docker container run -d -p 3000:3000 --name backend fatec-hae:backend
```

- After that, backend application will be running on http://localhost:3000. Be aware that every route are prefixed with /api, it should be used as http://localhost:3000/api/anyroute
- To stop the container, use: 

```
> docker container stop backend
```