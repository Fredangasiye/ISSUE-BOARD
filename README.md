# Community Issue Tracker - Huntingdon Terrace

A modern, mobile-first web application for residents to report and track community issues.

## Features

- **Report Issues**: Submit issues with unit number, category, description, and optional photo
- **View Status**: Real-time status tracking with color-coded badges
- **Mobile-First Design**: Responsive design optimized for mobile devices
- **Live Updates**: Auto-refreshes every 30 seconds
- **Smooth Animations**: Framer Motion animations for better UX
- **No Login Required**: Simple, accessible interface

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Airtable

1. Create an Airtable base with the following fields:
   - `Unit` (Single line text)
   - `Category` (Single select: Maintenance, Security, Cleaning, Lighting, Electricity, Water, Signage, Other)
   - `Description` (Long text)
   - `Status` (Single select: Pending, In progress, Resolved)
   - `Photo` (Attachment)
   - `Created` (Date)

2. Get your Airtable API key and Base ID

3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_AIRTABLE_API_KEY=your_api_key_here
NEXT_PUBLIC_AIRTABLE_BASE_ID=your_base_id_here
NEXT_PUBLIC_AIRTABLE_TABLE_NAME=Issues
```

### 3. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technology Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Airtable API** - Data storage

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main application component
│   └── globals.css     # Global styles
├── lib/
│   └── config.ts       # Airtable configuration
```

## Usage

1. **Report an Issue**:
   - Fill in unit number
   - Select category from dropdown
   - Describe the issue
   - Optionally upload a photo
   - Click "Submit Issue"

2. **View Issue Status**:
   - Issues are displayed in real-time
   - Filter by status (All, Pending, In progress, Resolved)
   - Status badges show current state with color coding:
     - 🟠 Pending (Orange)
     - 🔵 In progress (Blue)
     - ✅ Resolved (Green)

## Deployment

The application can be deployed to Vercel, Netlify, or any other Next.js hosting platform. Make sure to set the environment variables in your deployment environment.

## Customization

- Update the community name in `src/app/page.tsx`
- Modify categories in the `categories` array
- Adjust colors in the `statusColors` object
- Change auto-refresh interval (currently 30 seconds)