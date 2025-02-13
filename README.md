# Homework_Platforme

 <p align="center">
  <a href="#" target="_blank">
    <img src="https://github.com/user-attachments/assets/a41be0a5-b8d2-41ad-9675-7a6f62788d39" width="400" alt="Wajibati Logo">
  </a>
</p>

<p align="center">
  <a href="https://your-deployment-link.com">
    <img src="https://img.shields.io/badge/deployed-live-success" alt="Live Deployment">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  </a>
</p>

## About Wajibati

Wajibati is a modern homework management platform built using Next.js, Prisma, and MySQL. It is designed to help teachers create and assign homework, while students can view and submit their assignments seamlessly.

### Key Features
- **Role-Based Access**: Separate portals for teachers and students.
- **Homework Management**: Teachers can create, edit, and delete assignments.
- **Submission Tracking**: Students can submit homework, and teachers can review submissions.
- **Search & Filters**: Find assignments quickly using search and filtering options.
- **Authentication**: Secure login for students and teachers.
- **User-Friendly UI**: Responsive and easy-to-use interface.

## Technologies Used
- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: MySQL
- **Authentication**: Cookies-based authentication
- **Deployment**: Railway / Vercel (for frontend), Railway (for database)

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MySQL database

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/wajibati.git
   cd wajibati
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   ```sh
   cp .env.example .env
   ```
   Configure database and authentication details in the `.env` file.

4. Run database migrations:
   ```sh
   npx prisma migrate dev
   ```
5. Start the development server:
   ```sh
   npm run dev
   ```

## Deployment
To deploy Wajibati, configure your MySQL database on Railway, then deploy the Next.js app on Vercel or another hosting provider.

## Contributing
We welcome contributions! Please follow the [contribution guidelines](CONTRIBUTING.md) to get started.

## License
Wajibati is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT).

---

<p align="center">Developed with ❤️ by youssef sabir</p>


