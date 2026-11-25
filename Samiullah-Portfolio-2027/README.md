# Samiullah Hakimi — Portfolio Starter

A multi-page React/Vite frontend with a PHP + MySQL starter backend. This is the first scaffold; the admin authentication, CRUD screens, image upload, API endpoints and database-driven content will be implemented and tested in later steps.

## Requirements
- Node.js and npm
- XAMPP (Apache + MySQL)
- VS Code

## Frontend
```powershell
cd frontend
npm install
npm run dev
```
Open the local URL printed by Vite (usually http://localhost:5173).

## PHP + MySQL
1. Start Apache and MySQL in XAMPP.
2. Open phpMyAdmin at http://localhost/phpmyadmin.
3. Import `database/portfolio.sql`.
4. Copy the project `backend` folder into `C:\xampp\htdocs\samiullah-portfolio-2027\backend` (or configure an Apache alias).
5. Check `backend/config/database.php` credentials.
6. Visit `http://localhost/samiullah-portfolio-2027/backend/api/health.php` after placing the backend folder under htdocs.

## Important
- Admin login and dashboard are placeholders, not secure production authentication yet.
- Contact form currently demonstrates the UI only; it is not yet saving messages.
- Do not publish this starter as a live production site until authentication, validation, CSRF protection, upload restrictions and API security are implemented.
- Replace placeholder project cards and photo area with your own content and images.
