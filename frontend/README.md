# README

## Setup Instructions
### Dependencies
```bash
# install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory and add the following environment variables (There is an example to you can copy and paste):
```bash
NEXT_PUBLIC_SECRET_KEY=your_api_key
NEXT_PUBLIC_API_URL_BASE=http://localhost:3333
```

To generate a secret key, run the following command:
```bash
openssl rand -base64 32
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Tests

### Running Tests

```bash
npm run test
# or
yarn test
# or
pnpm test
# or
bun test
```
