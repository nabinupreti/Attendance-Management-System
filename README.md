# Attendance Management System

This repository is an Attendance Management System built with a React-Vite frontend and a Django backend.

## Folder Structure

```plaintext
.
├── backend/
│   ├── attendance/
│   ├── attendance_system/
│   ├── db.sqlite3
│   └── manage.py
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── vite.config.js
```

## How to Run

Follow the steps below to set up and run the application:

### Prerequisites

- Python 3.12.3 for the backend
- Node.js 22.9.0 and npm for the frontend
- npm 10.8.3

---

### Backend (Django)

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. Install the required dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Apply database migrations:

   ```bash
   python manage.py migrate
   ```

4. Start the Django development server:

   ```bash
   python manage.py runserver
   ```

   The server will run at `http://127.0.0.1:8000/`.

---

### Frontend (React-Vite)

1. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The server will run at `http://127.0.0.1:5173/` (or the URL provided in the terminal).

---

### Run the Full Application

1. Ensure both the backend and frontend servers are running.
2. Access the application by navigating to the frontend URL (e.g., `http://127.0.0.1:5173/`) in your web browser.

---

## Repository Link

[Attendance Management System](https://github.com/nabinupreti/Attendance-Management-System)

---

## Contributing

Feel free to fork this repository and submit pull requests. Contributions are welcome!

---

## License

This project is licensed under the MIT License.
