# Setup
After first cloning the Repository there are a few things that need to be setup before you can use it.

## .env file
You will need to create a .env based of the provided example file called `.env.example`. Once you have made the `.env` file, you will notice it is missing APP_KEY. You will need to generate it by using the command `node ace generate:key`. This will automatically add it to the file after completion.

## tmp folder
You will need to create a tmp file as this is where the database is currently being stored by the backend.
