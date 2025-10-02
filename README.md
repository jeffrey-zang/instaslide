# InstaSlide - AI Slideshow Creator

Create stunning presentations from PDFs or outlines using AI powered by OpenAI.

## Features

- **AI-Powered Generation**: Transform PDFs or outlines into beautiful Slidev markdown presentations
- **Authentication**: Secure email/password authentication with Supabase
- **Create from Outline**: Type or paste your presentation outline
- **Create from PDF**: Upload PDF documents and convert them to presentations
- **Save & Manage**: Store all your presentations in the cloud
- **Share**: Make presentations public and share them with anyone via link
- **Interactive Viewer**: Navigate through slides with keyboard controls

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, TailwindCSS
- **Backend**: tRPC for type-safe APIs
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Authentication**: Supabase Auth
- **AI**: OpenAI GPT-4
- **PDF Parsing**: pdf-parse
- **Markdown Rendering**: react-markdown

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase-schema.sql` in the Supabase SQL editor
3. Copy your project URL and anon key

### 3. Configure Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

The application uses a single `slideshows` table:

```sql
- id (uuid, primary key)
- user_id (uuid, references auth.users)
- title (text)
- markdown (text)
- is_public (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

Row Level Security policies ensure users can only access their own slideshows, while public slideshows are accessible to everyone.

## Project Structure

```
/app                    # Next.js app directory
  /auth                # Authentication pages
  /dashboard           # User dashboard
  /create              # Slideshow creation pages
  /slideshow           # Slideshow viewer
  /share               # Public slideshow sharing
  /api                 # API routes
/components            # React components
/lib                   # Utilities and clients
  /providers           # React providers
  /supabase            # Supabase client
/server                # tRPC server
  /routers             # tRPC routers
```

## Usage

1. **Sign Up**: Create an account
2. **Create Presentation**:
   - Choose "From Outline" to enter text
   - Choose "From PDF" to upload a document
3. **View & Edit**: See your generated presentation
4. **Share**: Toggle public and share the link
5. **Manage**: View all your presentations in the dashboard

## Features in Detail

### Authentication
- Email/password authentication
- Protected routes
- Session management with Supabase

### Slideshow Generation
- Outline-based: AI generates slides from structured text
- PDF-based: Extracts text from PDFs and creates slides
- Slidev markdown format for beautiful presentations

### Sharing
- Toggle public/private for each presentation
- Public presentations accessible via `/share/[id]`
- Copy shareable links

### Viewer
- Keyboard navigation (arrow keys, space)
- Slide indicators
- Markdown rendering with syntax support
