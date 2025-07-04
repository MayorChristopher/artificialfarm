# Artificial Farm Academy & Consultants

Welcome to the Artificial Farm Academy & Consultants platform!  
This project is a modern, responsive web application for agricultural learning, consulting, and community engagement.

## Features

- **User Dashboard:** Track course progress, manage consultations, and access resources.
- **Course Management:** Enroll in, view, and manage agricultural courses.
- **Consulting Services:** Book and manage consultations with experts.
- **Notifications:** Stay updated with important alerts and reminders.
- **Profile & Settings:** Manage your account, update your profile, and adjust preferences.
- **Admin Dashboard:** Manage users, courses, and platform settings (admin only).
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices.
- **Modern UI:** Uses Satoshi and Sora fonts, with a consistent green/yellow brand color scheme.

## Tech Stack

- **Frontend:** React, React Router, Framer Motion, Tailwind CSS
- **Backend:** Supabase (authentication, database)
- **Icons:** Lucide React
- **State Management:** React Context API

## Getting Started

1. **Clone the repository:**

   ```sh
   git clone git@github.com:MayorChristopher/artificialfarm.git
   cd artificialfarm
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up environment variables:**

   - Copy `.env.example` to `.env` and fill in your Supabase and other keys.

4. **Run the development server:**

   ```sh
   npm run dev
   ```

5. **Open in your browser:**
   ```
   http://localhost:5173
   ```

## Folder Structure

```
src/
  components/         # Reusable UI components
  contexts/           # React context providers (e.g., Auth)
  layouts/            # Layout components (Dashboard, etc.)
  pages/              # Page components (Dashboard, Settings, etc.)
  lib/                # Utility libraries (e.g., Supabase client)
  assets/             # Images and static assets
```

## Customization

- **Brand Colors:**
  - Primary Green: `#093001`
  - Yellow: `#FFB900`
  - Accent Green: `#187C08`
  - Soft Grey: `#E8D6D6`
- **Fonts:**
  - Primary: Satoshi
  - Secondary: Sora

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)

---

**Made with ❤️ by MayorChristopher and contributors**
