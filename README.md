Library Management System

Project Overview

The Library Management System is a backend application built using NestJS, Prisma ORM, and PostgreSQL. It provides a structured database foundation for managing library users, books, and book genres.

Technologies Used

- NestJS – Backend application framework.
- Prisma ORM – Database modelling and interaction.
- PostgreSQL – Relational database.
- Neon – Hosted PostgreSQL database.
- TypeScript – Programming language.

Database Schema

The database contains the following models:

1. User

Stores library user information, including:

- ID
- Name
- Email
- Role
- Creation and update timestamps

The "Role" enum defines two permitted roles:

- "PATRON"
- "LIBRARIAN"

The default role is "PATRON".

2. Genre

Stores book genre information, including:

- ID
- Name
- Description
- Related books
- Creation and update timestamps

3. Book

Stores information about library books, including:

- ID
- Title
- Author
- ISBN
- Published year
- Genre ID
- Creation and update timestamps

Each book is associated with a genre through the "genreId" foreign key.

Schema Decisions

The "Book" model references the "Genre" model through a foreign key ("genreId") instead of embedding genre information directly into each book.

This design was chosen because PostgreSQL is a relational database, and relational modelling helps maintain data consistency and integrity.

The relationship provides several benefits:

1. Avoids data duplication: Genre names and descriptions are stored once rather than repeated in every book record.
2. Maintains data consistency: Updating a genre does not require updating every associated book.
3. Establishes referential integrity: The foreign key ensures that each book references an existing genre.
4. Improves data organisation: Books and genres can be managed independently while maintaining their relationship.

The relationship is implemented using Prisma's "@relation" attribute, with "genreId" as the foreign key.

Database Seeding

The Prisma seed script populates the database with:

- At least four genres.
- Sixteen books distributed across the four genres.

The seed script uses "upsert" operations to avoid creating duplicate records when executed more than once.

Prisma Integration

The application uses a dedicated "PrismaService" that extends "PrismaClient" and implements NestJS's "OnModuleInit" interface.

The service establishes a database connection when the application module initializes.

Project Structure

library-management-system/
├── README.md
└── api/
    ├── prisma/
    │   ├── migrations/
    │   ├── schema.prisma
    │   └── seed.ts
    ├── src/
    │   └── prisma/
    │       ├── prisma.module.ts
    │       └── prisma.service.ts
    ├── .env.example
    ├── package.json
    └── tsconfig.json

Migration Implementation Note

During database migration, Prisma Migrate encountered connection issues with the hosted Neon PostgreSQL database.

To complete the database setup, the migration SQL was generated locally using Prisma's "migrate diff" command and executed through the Neon SQL Editor. The corresponding migration history record was then registered in the "_prisma_migrations" table.

The migration was subsequently recognised by Prisma, and "prisma migrate status" reported that the database schema was up to date.

This approach ensured that the required database tables, relationships, and constraints were created successfully in the hosted PostgreSQL database.