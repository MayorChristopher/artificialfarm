# Supabase Setup Guide for Artificial Farm Academy & Consultants (AFAC)

This guide will help you set up your Supabase database to work with the Artificial Farm Academy & Consultants (AFAC) application.

## Prerequisites

1. A Supabase account (free tier works fine)
2. Your Supabase project URL and anon key

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `artificial-farm-academy-consultants`
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
6. Click "Create new project"

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy your:
   - Project URL
   - Anon public key

## Step 3: Update Environment Variables

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 4: Set Up Database Tables

1. In your Supabase dashboard, go to SQL Editor
2. Copy the entire contents of `supabase-setup.sql`
3. Paste it into the SQL Editor
4. Click "Run" to execute the script

This will create:
- `courses` table for course management
- `course_enrollments` table for user enrollments
- `site_stats` table for homepage statistics
- `success_stories` table for testimonials and success stories
- `journey_content` table for journey page content
- `consultations` table for consultation requests
- `profiles` table for user profiles
- All necessary Row Level Security (RLS) policies
- Sample data for testing including featured success stories

## Step 5: Configure Authentication

1. In Supabase dashboard, go to Authentication → Settings
2. Configure your site URL (e.g., `http://localhost:5173` for development)
3. Add any additional redirect URLs you need
4. Configure email templates if desired

## Step 6: Set Up Admin User

To make a user an admin:

1. Go to Authentication → Users in your Supabase dashboard
2. Find the user you want to make admin
3. Go to SQL Editor and run:

```sql
UPDATE profiles 
SET is_admin = true 
WHERE id = 'user-uuid-here';
```

Replace `user-uuid-here` with the actual user ID.

## Step 7: Test the Application

1. Start your development server: `npm run dev`
2. Register a new account
3. Test the admin functionality by making your user an admin
4. Try creating courses in the admin dashboard
5. Test user enrollment and progress tracking

## Database Schema Overview

### Courses Table
- `id`: Unique identifier
- `title`: Course title
- `description`: Course description
- `instructor`: Instructor name
- `category`: Course category
- `difficulty`: beginner/intermediate/advanced
- `duration`: Course duration
- `price`: Course price
- `total_lessons`: Number of lessons
- `thumbnail_url`: Course image URL
- `content`: Course content
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Course Enrollments Table
- `id`: Unique identifier
- `user_id`: Reference to auth.users
- `course_id`: Reference to courses
- `progress`: Progress percentage (0-100)
- `score`: User's score
- `hours_spent`: Time spent on course
- `enrolled_at`: Enrollment timestamp
- `updated_at`: Last update timestamp

### Site Stats Table
- `id`: Unique identifier
- `farmers_trained`: Number of farmers trained
- `certificates_issued`: Number of certificates issued
- `yield_improvement`: Average yield improvement percentage
- `sustainable_projects`: Number of sustainable projects
- `total_users`: Total registered users
- `active_courses`: Number of active courses
- `consultations`: Number of consultations
- `content_items`: Number of content items
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Success Stories Table
- `id`: Unique identifier
- `name`: Person's name
- `role`: Their role/profession
- `location`: Geographic location
- `content`: Success story content
- `rating`: Rating (1-5 stars)
- `avatar_url`: Profile image URL
- `is_featured`: Whether to show on homepage
- `is_published`: Whether the story is published
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Consultations Table
- `id`: Unique identifier
- `user_id`: Reference to auth.users (optional)
- `name`: Client name
- `email`: Client email
- `phone`: Client phone number
- `company`: Client company
- `service_type`: Type of consultation requested
- `message`: Consultation request message
- `status`: Request status (pending/in_progress/completed/cancelled)
- `scheduled_date`: Scheduled consultation date
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

## Security Features

The application includes Row Level Security (RLS) policies that ensure:

1. **Courses**: Everyone can view published courses, only admins can create/edit/delete
2. **Enrollments**: Users can only see their own enrollments, admins can see all
3. **Site Stats**: Everyone can view, only admins can modify
4. **Success Stories**: Everyone can view published stories, only admins can manage
5. **Consultations**: Users can view their own requests, admins can view all
6. **Profiles**: Users can only see/edit their own profile, admins can see all

## Troubleshooting

### Common Issues

1. **"Could not load courses" error**
   - Check if the `courses` table exists
   - Verify RLS policies are enabled
   - Check your Supabase credentials

2. **Admin features not working**
   - Ensure the user has `is_admin = true` in the profiles table
   - Check RLS policies for admin access

3. **Authentication issues**
   - Verify your site URL in Supabase Auth settings
   - Check redirect URLs configuration

4. **Build errors**
   - Ensure all environment variables are set
   - Check that all imports are correct

### Getting Help

If you encounter issues:

1. Check the browser console for errors
2. Verify your Supabase dashboard for any error messages
3. Ensure all tables and policies are created correctly
4. Test with the sample data provided in the setup script

## Next Steps

Once your Supabase setup is complete:

1. Customize the sample data to match your needs
2. Add more courses through the admin interface
3. Configure email notifications if needed
4. Set up file storage for course materials
5. Add more features as needed

## Production Deployment

For production:

1. Update your environment variables with production Supabase credentials
2. Configure proper redirect URLs in Supabase Auth
3. Set up proper CORS policies
4. Consider setting up database backups
5. Monitor your Supabase usage and upgrade if needed

---

**Note**: This setup provides a solid foundation for the Artificial Farm Academy application. You can extend it further by adding more tables, features, and integrations as your needs grow. 