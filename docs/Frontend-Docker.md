# Running Frontend Docker

- First enter on Frontend folder:

```
> cd FrontendReactTS
```

- Build docker image:

```
> docker image build -t fatec-hae:frontend .
```

- **Make sure you have defined .env.development based on .env-example**
- Run a docker container:

```
> docker container run -d -p 5173:5173 --env-file .env.development --name frontend fatec-hae:frontend
```

- After that, frontend application will be running on http://localhost:5173
- To stop the container, use: 

```
> docker container stop frontend
```