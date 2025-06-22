🚀 BookMySlot
A full-stack scheduling app where users create events with available time slots, and others can book those slots easily — like a mini Calendly! Time zone aware and built for smooth user experience.

📋 Project Overview
BookMySlot lets private users create events with multiple time slots and max bookings per slot. Public visitors can browse events, see available slots in their own time zone, and book slots by submitting their name and email. It prevents double bookings and full slots, ensuring smooth scheduling.

🌟 Features
Create Event Page 📝
Private users add event title, description, and list of available time slots (in ISO 8601 format). Set max bookings per slot to control capacity.

Home Page 🏠
Displays all upcoming public events with basic info: event name, creator, and slot count.

Event Details Page 🔍
View event details and available time slots converted to your local time zone. Includes booking form with name and email input.

Booking Interface 🕒
Visitors book slots securely; prevents multiple bookings by the same user for the same slot.

Time Zone Support 🌍
Slots are stored in UTC and auto-converted on the client side using Luxon, so users always see times in their local zone.

(Optional) My Bookings Page 📅
Users can check their previous bookings by filtering with their email.

🛠 Technology Stack
Frontend: React (Vite) + TailwindCSS for fast, responsive, and modern UI.

Backend: Node.js + Express.js REST API.

Database: PostgreSQL hosted on Render.

Date Handling: Luxon for timezone conversions.

Deployment:

Backend on Render (dynamic web service).

Frontend on Vercel (static site hosting).

🔑 Important API Endpoints
Method	Endpoint	Description
POST	/events	Create a new event with slots
GET	/events	List all public events
GET	/events/:id	Get detailed event info and slots
POST	/events/:id/bookings	Book a time slot for an event
GET	/users/:email/bookings	(Optional) View bookings by email

Backend logic ensures:

No double bookings for the same user + slot

Slots are marked unavailable once max bookings reached

Timezone-aware data storage and conversion

🖥️ Page Breakdown
1. Home Page
Shows all upcoming events in a simple list with event title, creator, and number of available slots.

2. Create Event Page
Form for private users to add event details and multiple available time slots. Includes max bookings per slot field.

3. Event Details Page
Displays event description and available time slots (shown in user's local time). Booking form allows visitors to reserve slots.

4. My Bookings Page (Optional)
Allows users to see all their past bookings by entering their email address.

5. Confirmation & Error Screens
After booking, users see success messages or errors like slot full or duplicate booking attempts.

🚀 Deployment Steps
Backend (Render.com)
Create a new Web Service on Render linked to your GitHub repo.

Set Root Directory to /bookmyslot-backend (since repo contains frontend and backend folders).

Add environment variables, especially your DATABASE_URL for PostgreSQL.

Use npm install as Build Command and npm start as Start Command.

Enable auto-deploy on push to main branch.

Verify deployment logs and fix issues if any.

Backend is live at:
https://bookmyslot-9x5v.onrender.com

Frontend (Vercel)
Connect your GitHub repo on Vercel.

Set Root Directory to /bookmyslot-frontend.

Use default build command (npm run build) and output directory dist.

Deploy and get your live frontend URL, e.g.:
https://book-my-slot-nine.vercel.app

⚙️ Running Locally
Backend

bash
Copy
Edit
cd bookmyslot-backend
npm install
npm run dev  # Starts backend server with nodemon for auto-reload
Make sure .env includes your DATABASE_URL.

Frontend

bash
Copy
Edit
cd bookmyslot-frontend
npm install
npm run dev  # Starts React development server
🎉 Summary
BookMySlot showcases:

Full REST API backend with Express and PostgreSQL

React frontend with TailwindCSS styling

Timezone-safe booking system using Luxon

Seamless deployment to Render and Vercel

Clean modular code, environment config, and error handling

This project demonstrates practical skills for building and deploying full-stack web applications, which align with SDE-1 expectations.
