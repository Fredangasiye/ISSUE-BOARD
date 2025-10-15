# 🚀 Issue Board - Development Workflow

## 📋 Quick Commands

### **Start Development Server**
```bash
npm run dev
```
**Access at**: http://localhost:3000

### **Manual Backup & Push**
```bash
./backup-and-push.sh
```

### **Auto-Save (Background)**
```bash
./auto-save.sh &
```
*Runs backup every 5 minutes*

### **Stop Auto-Save**
```bash
pkill -f auto-save.sh
```

## 🔄 Workflow Setup

### **1. Set up GitHub Repository**

**Option A: Create on GitHub.com**
1. Go to https://github.com/new
2. Repository name: `issue-board`
3. Description: `Community Issue Tracker for Huntingdon Terrace`
4. Make it **Public**
5. **Don't** initialize with README
6. Click "Create repository"

**Option B: Use GitHub CLI**
```bash
gh auth login
gh repo create issue-board --public --description "Community Issue Tracker for Huntingdon Terrace"
```

### **2. Connect Local Repository**
```bash
git remote add origin https://github.com/YOUR_USERNAME/issue-board.git
git push -u origin main
```

### **3. Start Development**
```bash
# Terminal 1: Development server
npm run dev

# Terminal 2: Auto-backup (optional)
./auto-save.sh &
```

## 📁 Backup System

### **Automatic Backups**
- **Location**: `/Users/fred/Desktop/vaib/issue-board-backups/`
- **Format**: `issue-board-backup-YYYY-MM-DD_HH-MM-SS`
- **Frequency**: Every 5 minutes (if auto-save is running)

### **Manual Backup**
```bash
./backup-and-push.sh
```

### **What Gets Backed Up**
✅ All source code  
✅ Configuration files  
✅ Documentation  
✅ Git history  
✅ Commits pushed to GitHub  

## 🛠️ Development Features

### **Hot Reload**
- Changes auto-refresh in browser
- No need to restart server

### **TypeScript Support**
- Type checking in real-time
- IntelliSense in VS Code

### **Tailwind CSS**
- Utility-first styling
- Responsive design

### **Framer Motion**
- Smooth animations
- Page transitions

## 🔧 Environment Setup

### **Required Environment Variables**
Create `.env.local`:
```env
NEXT_PUBLIC_AIRTABLE_API_KEY=your_api_key
NEXT_PUBLIC_AIRTABLE_BASE_ID=your_base_id
NEXT_PUBLIC_AIRTABLE_TABLE_NAME=Issues
```

### **Airtable Configuration**
Required fields in your Airtable base:
- `Unit` (Single line text)
- `Category` (Single select)
- `Description` (Long text)
- `Status` (Single select: Pending, In progress, Resolved)
- `Photo` (Attachment)
- `Created` (Date)

## 📱 Testing the App

1. **Open**: http://localhost:3000
2. **Test Form**: Submit a test issue
3. **Check Status**: View issue in the list
4. **Test Filters**: Try different status filters
5. **Mobile Test**: Test on mobile device

## 🚀 Deployment Ready

The app is ready for deployment to:
- **Vercel** (recommended)
- **Netlify**
- **Railway**
- **Any Next.js hosting platform**

Just set the environment variables in your deployment platform.

## 📞 Support

- **Documentation**: README.md
- **Setup Guide**: SETUP.md
- **Backup Scripts**: backup-and-push.sh, auto-save.sh