@echo off
echo Installing Prisma and database dependencies...
npm install prisma @prisma/client
echo.
echo Creating Prisma schema and initial setup...
npx prisma init
echo.
echo Setup complete! Please edit the .env file with your database connection string
echo and run 'npx prisma db push' to create the database tables.
echo.
echo Then run 'npm run seed' to populate the database with initial content.
pause