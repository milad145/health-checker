# Fesharino


### Files Structure

    lib/
    ---- config/
    ---- ---- development.js
    ---- ---- index.js
    ---- ---- production.js
    ---- core/
    ---- ---- init.js
    ---- entities/
    ---- ---- user/
    ---- ---- ---- schema.js
    ---- ---- ---- service.js
    ---- modules/
    ---- ---- assist.js
    ---- ---- errorHandler.js
    ---- ---- logs.js
    ---- ---- middlewares.js
    ---- ---- tokenGenerator.js
    ---- routes/
    ---- ---- signal/
    ---- ---- ---- route.js
    ---- ---- ---- service.js
    ---- ---- ---- validation.js
    ---- ---- user/
    ---- ---- ---- route.js
    ---- ---- ---- service.js
    ---- ---- ---- validation.js
    ---- ---- index.js
    .gitignore
    index.js
    package.json
    README.md
    sample.env

### Run Project
1. clone the project

```
git clone https://sc.spinn.ai/server/fesharino.git
```

2. go to the project directory

```
cd fesharino
```

3. install all the dependencies

```
npm i
```

4. make a copy of `sapmle.env` and rename it to `.env`

```
cp sample.env .env
```

5. update the `.env` file parameters

```
DB_CONFIG : mongodb connection url
ACCESS_TOKEN_SECRET : secret string for creating access token 
REFRESH_TOKEN_SECRET : secret string for creating refresh token
PORT : the port which app listen on it
```

6. run the project with this command

```
npm run dev
```
