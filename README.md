# Sonic KI 🎙️

A voice-first note-taking application built with Next.js, TypeScript, and Supabase. Sonic KI provides a seamless, unified thinking surface where users can capture their thoughts through text or voice, with real-time transcription and AI-powered summarization.

## ✨ Features

### Core Functionality
- **Unified Thinking Surface**: Single, distraction-free interface for capturing thoughts
- **Dual Input Modes**: 
  - **Text Notes**: Type directly with auto-save functionality
  - **Voice Notes**: Record audio with real-time transcription
- **AI-Powered Processing**:
  - Real-time speech-to-text transcription using Google Gemini
  - Automatic summarization (3-5 bullet points) using Gemini AI
- **Seamless Experience**:
  - Auto-save as you type (1 second debounce)
  - Auto-focus on page load
  - Inline voice recording (no modals, no interruptions)
  - Transcript insertion at cursor position

### Technical Features
- **Server-Side Rendering (SSR)**: Fast initial page loads
- **Real-time Audio Processing**: Asynchronous audio transcription pipeline
- **Persistent Storage**: Supabase PostgreSQL database + Storage
- **Type-Safe**: Full TypeScript implementation
- **Modular Architecture**: XDS-style design for future service extraction

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (audio files)
- **AI**: Google Gemini API (transcription & summarization)
- **Styling**: Tailwind CSS

### Project Structure
```
sonic-ki/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Main thinking surface (entry point)
│   ├── api/               # API routes
│   ├── notes/             # Notes pages
│   ├── chat/              # Chat interface
│   └── create/            # Note creation
├── components/            # React components
│   ├── ThinkingEditor.tsx # Main editor component
│   ├── VoiceCaptureBar.tsx # Voice recording bar
│   └── ...
├── server/                # Backend modules
│   ├── core/              # Shared utilities
│   ├── modules/           # Feature modules
│   │   ├── notes/         # Notes module
│   │   ├── audio/         # Audio module
│   │   └── ai/            # AI services
│   └── jobs/              # Background jobs
├── lib/                   # Frontend utilities
└── supabase/              # Database schema
```

### Module Architecture (XDS-Style)
The application follows a modular monolith pattern designed for future service extraction:

- **Notes Module**: CRUD operations for notes
- **Audio Module**: Audio upload, storage, and job tracking
- **AI Module**: Transcription and summarization services
- **Clean Boundaries**: Each module is self-contained with clear interfaces

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/badarivishal2002/sonic.git
   cd sonic
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Google Gemini
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL schema from `supabase/schema.sql` in the SQL editor
   - Create a storage bucket named `audio` for audio files

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Database Schema

### Tables

**notes**
- `id` (UUID, Primary Key)
- `type` (TEXT: 'text' | 'voice')
- `title` (TEXT, nullable)
- `content` (TEXT, nullable)
- `summary` (TEXT, nullable)
- `created_at` (TIMESTAMP)

**audio_jobs**
- `id` (UUID, Primary Key)
- `note_id` (UUID, Foreign Key → notes.id)
- `status` (TEXT: 'pending' | 'processing' | 'done' | 'failed')
- `audio_path` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

See `supabase/schema.sql` for the complete schema.

## 🎯 Usage

### Creating Notes

1. **Text Notes**: Simply start typing in the thinking surface. Your notes are auto-saved every second.

2. **Voice Notes**: 
   - Click the "🎙 Speak" button in the bottom bar
   - Record your audio
   - Click "⏹ Stop" when done
   - The transcript will automatically appear at your cursor position
   - A summary will appear below the transcript

### Features
- **Auto-save**: No need to manually save - your work is automatically saved
- **Auto-focus**: The editor is ready for input as soon as the page loads
- **Inline Voice**: Voice recording happens inline without interrupting your workflow
- **Smart Summaries**: AI-generated summaries help you quickly understand your notes

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for Next.js
- Modular architecture with clear separation of concerns
- Server-side rendering where applicable
- Client components only when necessary

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |

### Supabase Setup

1. Create a new Supabase project
2. Copy the project URL and anon key
3. Enable Storage and create a bucket named `audio`
4. Run the schema SQL from `supabase/schema.sql`
5. Configure storage policies for the `audio` bucket

## 📚 API Routes

### Notes
- `POST /api/notes` - Create a new note
- `GET /api/notes` - Get all notes
- `GET /api/notes/[id]` - Get a note by ID
- `PATCH /api/notes/[id]` - Update a note
- `DELETE /api/notes/[id]` - Delete a note

### Audio
- `POST /api/notes/[id]/audio` - Upload audio for a note
- `POST /api/notes/[id]/process` - Process audio (transcribe & summarize)

### Chat
- `POST /api/chat/query` - Query notes via chat interface

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Supabase](https://supabase.com/)
- AI capabilities via [Google Gemini](https://deepmind.google/technologies/gemini/)
- UI styling with [Tailwind CSS](https://tailwindcss.com/)

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Note**: This is Phase I of Sonic KI. Future phases may include additional features like live transcription, meeting integration, and advanced search capabilities.
