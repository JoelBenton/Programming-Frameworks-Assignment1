# Setup

After first cloning the Repository there are a few things that need to be setup before you can use it.

## .env file

To create the .env file run the following command:

```bash
cp .env.example .env
```

Once copied you will need to create the secret key using the following command:

```bash
node ace generate:key
```


## Run the Server

To run the server run the following command:

```bash
npm run dev
```
## Tests

To run the tests run the following command:

```bash
npm run test
```