# Setup Guide for Community Issue Tracker

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Airtable**:
   - Create a `.env.local` file in the root directory
   - Add your Airtable credentials:
   ```
   NEXT_PUBLIC_AIRTABLE_API_KEY=your_api_key_here
   NEXT_PUBLIC_AIRTABLE_BASE_ID=your_base_id_here
   NEXT_PUBLIC_AIRTABLE_TABLE_NAME=Issues
   ```

3. **Run the application**:
   ```bash
   npm run dev
   ```

## Airtable Setup

### Required Fields in your Airtable base:

| Field Name | Field Type | Options |
|------------|------------|---------|
| Unit | Single line text | - |
| Category | Single select | Maintenance, Security, Cleaning, Lighting, Electricity, Water, Signage, Other |
| Description | Long text | - |
| Status | Single select | Pending, In progress, Resolved |
| Photo | Attachment | - |
| Created | Date | - |

### Getting Airtable Credentials:

1. **API Key**: Go to https://airtable.com/create/tokens
2. **Base ID**: Found in your Airtable base URL
3. **Table Name**: Use "Issues" (or update the config)

## Features

✅ **No Login Required** - Simple, accessible interface  
✅ **Mobile-First Design** - Optimized for mobile devices  
✅ **Real-Time Updates** - Auto-refreshes every 30 seconds  
✅ **Photo Upload** - Optional image attachments  
✅ **Status Tracking** - Color-coded status badges  
✅ **Smooth Animations** - Framer Motion animations  
✅ **Modern UI** - Clean, professional design  

## Status Colors

- 🟠 **Pending** - Orange badge
- 🔵 **In Progress** - Blue badge  
- ✅ **Resolved** - Green badge

## Deployment

Ready for deployment to Vercel, Netlify, or any Next.js hosting platform. Just set the environment variables in your deployment environment.