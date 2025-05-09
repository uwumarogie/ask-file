# Ask File

Ask File is a secure, AI-powered document management and chat application built with Next.js and TypeScript.
Upload your files, store them safely in AWS S3, and interact with your documents through a conversational interface powered by OpenAI embeddings and Pinecone vector search.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and session management
- Secure file uploads to AWS S3
- Relational data persisted in PostgreSQL via Drizzle ORM
- AI-driven document embeddings with OpenAI
- Vector search and chat using Pinecone
- Responsive UI built with Next.js, Tailwind CSS, Radix UI, and Framer Motion

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Authentication:** better-auth
- **ORM:** Drizzle ORM
- **Database:** PostgreSQL
- **File Storage:** AWS S3
- **AI & Embeddings:** OpenAI API
- **Vector DB:** Pinecone
- **Utilities:** Zod, clsx

## Getting Started

### Prerequisites

- Node.js (>=20)
- pnpm (or npm/yarn)
- PostgreSQL database
- AWS S3 bucket
- OpenAI API key
- Pinecone account

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/ask-file.git
cd ask-file

# Install dependencies
pnpm install
```

(Note: you can also use `npm install` or `yarn install`.)

### Environment Variables

Create a `.env.local` file in the project root and configure the following variables:

```ini
# Database
DATABASE_URL=postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DB_NAME>

# AWS S3
S3_BUCKET_NAME=your-s3-bucket-name
MY_AWS_REGION=us-east-1
MY_AWS_ACCESS_KEY_ID=your-access-key-id
MY_AWS_SECRET_ACCESS_KEY=your-secret-access-key

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Pinecone
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_HOST=your-project.svc.<region>.pinecone.io
```

Next.js will automatically load variables from `.env.local`.

### Database Setup

Generate and apply database migrations:

```bash
pnpm run db:migrate
```

This will create the necessary tables in your PostgreSQL database.

## Usage

Start the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── src/
│   ├── app/           # Next.js App Router pages & layouts
│   ├── components/    # Reusable React components
│   ├── db/            # Drizzle schemas, migrations & Pinecone utils
│   └── util/          # Services (AWS, OpenAI) & helpers
├── drizzle.config.ts  # Drizzle-ORM configuration
├── next.config.ts     # Next.js configuration
├── tailwind.config.ts # Tailwind CSS configuration
└── README.md          # Project overview
```

## Available Scripts

- `pnpm run dev` — Start development server
- `pnpm run build` — Build for production
- `pnpm run start` — Start production server
- `pnpm run lint` — Run ESLint
- `pnpm run format` — Format code with Prettier
- `pnpm run db:migrate` — Generate & apply Drizzle migrations

## Contributing

Contributions are welcome! Please open issues or pull requests to improve the project.

## License

This project is licensed under the MIT License.
