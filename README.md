# Discoverly

Discoverly is an AI-powered local discovery application that helps users find nearby places based on their mood, budget, location, and real-time weather conditions.

## Features

- 🤖 AI-powered recommendations using OpenAI/Gemini API
- 🌤️ Real-time weather integration
- 🗺️ Interactive Google Maps integration
- 💰 Smart budget filtering
- 🔍 Natural language search
- ❤️ User favorites and bookmarks
- 🔐 User authentication
- 🎨 Beautiful, responsive UI with animations

## Tech Stack

- **Frontend:**
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - Google Maps SDK
  - React Hot Toast

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB Atlas
  - OpenAI/Gemini API
  - Google Places API
  - OpenWeatherMap API

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/aakashsharma7/Discoverly
   cd discoverly
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your environment variables:
   ```
   NEXT_PUBLIC_OPENWEATHER_API_KEY=
   NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=
   OPENAI_API_KEY=
   MONGODB_URI=
   NEXTAUTH_SECRET=
   NEXTAUTH_URL=
   GOOGLE_AI_API_KEY=
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # Reusable React components
├── lib/             # Utility libraries and configurations
├── types/           # TypeScript type definitions
├── utils/           # Helper functions
├── styles/          # Global styles and Tailwind config
├── hooks/           # Custom React hooks
└── services/        # API services and external integrations
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 