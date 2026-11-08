import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create at least four genres
  const genres = await Promise.all([
    {
      name: 'Fiction',
      description: 'Imaginary stories and creative narratives',
    },
    {
      name: 'Science',
      description: 'Scientific discoveries and knowledge',
    },
    {
      name: 'History',
      description: 'Historical events and biographies',
    },
    {
      name: 'Technology',
      description: 'Computing, innovation and technology',
    },
  ].map((genre) =>
    prisma.genre.upsert({
      where: { name: genre.name },
      update: { description: genre.description },
      create: genre,
    }),
  ));

  const genreMap = Object.fromEntries(
    genres.map((genre) => [genre.name, genre.id]),
  );

  // Create at least 15 books across the four genres
  const books = [
    { title: 'Things Fall Apart', author: 'Chinua Achebe', isbn: '9780385474542', publishedYear: 1958, genre: 'Fiction' },
    { title: 'The River Between', author: 'Ngugi wa Thiong’o', isbn: '9780435905484', publishedYear: 1965, genre: 'Fiction' },
    { title: 'Purple Hibiscus', author: 'Chimamanda Ngozi Adichie', isbn: '9781616202415', publishedYear: 2003, genre: 'Fiction' },
    { title: 'Half of a Yellow Sun', author: 'Chimamanda Ngozi Adichie', isbn: '9781400095209', publishedYear: 2006, genre: 'Fiction' },

    { title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '9780553380163', publishedYear: 1988, genre: 'Science' },
    { title: 'The Selfish Gene', author: 'Richard Dawkins', isbn: '9780198788607', publishedYear: 1976, genre: 'Science' },
    { title: 'Cosmos', author: 'Carl Sagan', isbn: '9780345539434', publishedYear: 1980, genre: 'Science' },
    { title: 'The Origin of Species', author: 'Charles Darwin', isbn: '9780451529060', publishedYear: 1859, genre: 'Science' },

    { title: 'The Art of War', author: 'Sun Tzu', isbn: '9781590302255', publishedYear: -500, genre: 'History' },
    { title: 'Long Walk to Freedom', author: 'Nelson Mandela', isbn: '9780316548182', publishedYear: 1994, genre: 'History' },
    { title: 'The Diary of a Young Girl', author: 'Anne Frank', isbn: '9780307594006', publishedYear: 1947, genre: 'History' },
    { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', isbn: '9780393354324', publishedYear: 1997, genre: 'History' },

    { title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', publishedYear: 2008, genre: 'Technology' },
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt and David Thomas', isbn: '9780135957059', publishedYear: 1999, genre: 'Technology' },
    { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '9780262046305', publishedYear: 2022, genre: 'Technology' },
    { title: 'The Innovators', author: 'Walter Isaacson', isbn: '9781476708690', publishedYear: 2014, genre: 'Technology' },
  ];

  for (const book of books) {
    const { genre, ...bookData } = book;

    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {
        ...bookData,
        genreId: genreMap[genre],
      },
      create: {
        ...bookData,
        genreId: genreMap[genre],
      },
    });
  }

  console.log('Database seeded successfully!');
  console.log(`Created/updated ${genres.length} genres.`);
  console.log(`Created/updated ${books.length} books.`);
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });