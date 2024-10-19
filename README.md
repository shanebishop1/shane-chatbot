# shane-chatbot

## Local (Mac) setup

- Navigate to the backend directory and run`pipenv install`
- Set up postgresql with `brew install postgresql` and `brew services start postgresql`
- Create a database with `psql postgres` and `CREATE DATABASE your_db;`
- Add a .env file to the backend directory with these variables: `FRONTEND_URL=http://localhost:3000` and `DATABASE_URL=DATABASE_URL=postgresql://your_user:your_password@localhost:5432/your_db` as well as GOOGLE_CLIENT_ID and JWT_SECRET_KEY
- Run `alembic upgrade head` to get your postgres table set up
- Navigate to the frontend directory and run `npm install`
- Add a .env file to the frontend directory with these environment variables: `VITE_BACKEND_URL=http://127.0.0.1:8000` and `VITE_GOOGLE_CLIENT_ID=your_google_client_id`
- Run `npm run dev` from the frontend directory
- Run `uvicorn src.main:app` --reload from the backend directory
- Set your Open AI API key as the `OPENAI_API_KEY` environment variable

## Testing

- Make sure dev dependencies are installed with `npm install -D`
- Run `npm test` from the frontend directory
