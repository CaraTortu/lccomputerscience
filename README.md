# LCComputerScience 

This is the repository for the LCComputerScience project. This project is a platform for students to learn computer science and programming. It provides a set of courses, exercises, and projects to help students learn and practice their programming skills for the Leaving Certificate Computer Science course.

## Technologies used! 

- [Next.js](https://nextjs.org)
- [BetterAuth](https://better-auth.vercel.app/)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [React Email](https://react.email/)

## How to run the project locally

- Requirements:
    1. Make sure to have a database running. If you don't have one, we provide a script to start the database with docker under the `/scripts` folder. Make sure that after database is created, you run the migrations with `npm run db:push` or `bun run db:push`.
    2. Make sure you have a `.env` file with the correct fields from the `.env.example` file.
    3. Create a stripe account and get the keys to fill the `.env` file.

1. Run `npm i` or `bun i` to install the dependencies.
2. Run `npm run dev` or `bun run dev` to start the project in development mode.
3. Run `stripe listen --forward-to localhost:3000/api/webhooks` to listen to stripe events.

## How to build the project

1. Run `npm run build` or `bun run build` to build the project.
