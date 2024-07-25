# Kosha Moves Web App

## Getting Started

First, clone the project to your local

```bash
// using https example

git clone https://github.com/koshamoves/kosha_moves_web.git
```

Next run:

```bash
nvm use
```

The `.nvmrc` file would automatically pick up the right node version for the application to run on. If you don't have nvm here's how to set that up [Guide](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/)

Once you have that sorted, you can go ahead and install the dependencies:

```bash
yarn 
```
Or
```bash
yarn install
```

Now run the below command to run the app on the development server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Lastly you need the need environment variables. Create a `.env` at the project root and paste the environment variables provided.

> Note: dev environment variables have the `_DEV` suffix while prod environment variables don't. Swap your credentials into the prod variables.

The `env.config.ts` shows how the variables are used.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
