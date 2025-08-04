# 🎨 Figma-Cursor Integration Setup Guide
*For Ko Lake Villa Project*

## ✅ **SETUP COMPLETE CHECKLIST**
- [x] Bun installed (`1.2.19`) ✅
- [x] MCP configuration files created ✅
- [ ] Figma API token added ⏳
- [ ] Cursor MCP server configured ⏳
- [ ] Test Figma link integration ⏳

---

## 🔑 **STEP 1: GET FIGMA API TOKEN**

### **Create Token:**
1. **Visit:** [figma.com/developers/api](https://www.figma.com/developers/api)
2. **Sign in** to your Figma account
3. **Scroll down** to "Personal access tokens"
4. **Click:** "Create new token"
5. **Name:** "Ko Lake Villa Cursor Integration"
6. **Copy the token** - you'll need it next

### **Add Token to Configuration:**
Replace `YOUR_FIGMA_API_KEY_HERE` in these files:
- `~/.cursor/mcp.json` (global config)
- `.cursor/mcp.json` (project config)

---

## 🔧 **STEP 2: CONFIGURE CURSOR**

### **Option A: Global Configuration (All Projects)**
File: `~/.cursor/mcp.json`
```json
{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "npx",
      "args": [
        "-y", 
        "figma-developer-mcp", 
        "--figma-api-key=YOUR_ACTUAL_TOKEN_HERE",
        "--stdio"
      ]
    }
  }
}
```

### **Option B: Project-Only Configuration (Ko Lake Villa Only)**
File: `.cursor/mcp.json`
```json
{
  "mcpServers": {
    "Ko Lake Villa Figma MCP": {
      "command": "npx",
      "args": [
        "-y", 
        "figma-developer-mcp", 
        "--figma-api-key=YOUR_ACTUAL_TOKEN_HERE",
        "--stdio"
      ],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

---

## 🚀 **STEP 3: ENABLE IN CURSOR**

### **Activate MCP Server:**
1. **Open Cursor** in this Ko Lake Villa project
2. **Go to:** Cursor Settings → Tools & Integrations  
3. **Click:** "New MCP Server" (this opens mcp.json)
4. **Verify** your configuration is correct
5. **Save** and restart Cursor
6. **Check:** Settings → MCP → Refresh button

---

## 🎯 **STEP 4: TEST THE INTEGRATION**

### **Quick Test:**
1. **Create** a simple design in Figma
2. **Copy** the Figma URL (file, frame, or component)
3. **Open Cursor** in Ko Lake Villa project
4. **Open Composer** (`Cmd + I`)
5. **Paste** the Figma URL and say:
   ```
   "Implement this Figma design as a React component 
   for Ko Lake Villa using TypeScript and Tailwind CSS"
   ```

### **Expected Result:**
- Cursor should fetch design data from Figma
- Generate accurate React/TypeScript code
- Include proper Ko Lake Villa styling (amber-800, orange-100)

---

## 🏗️ **WORKFLOW FOR KO LAKE VILLA**

### **Design-to-Code Process:**

#### **1. In Figma:**
- Design accommodation cards, booking forms, gallery layouts
- Use Ko Lake Villa brand colors (amber, orange tones)
- Create responsive layouts for mobile/desktop

#### **2. In Cursor:**
```
"Take this Figma design: [PASTE_FIGMA_URL]

Create a TypeScript React component for Ko Lake Villa with:
- Next.js 15 compatibility
- Tailwind CSS styling  
- Ko Lake Villa brand colors (amber-800, orange-100)
- Mobile-responsive design
- Proper image optimization with Next.js Image
- Save to: components/figma-generated/[component-name].tsx"
```

#### **3. Integration:**
```bash
# Test the component
bun run dev  # or npm run dev
# Visit: http://localhost:3000
```

---

## 🔧 **TROUBLESHOOTING**

### **MCP Server Not Working?**
```bash
# Test MCP server manually
npx -y figma-developer-mcp --figma-api-key=YOUR_TOKEN --stdio

# Check Cursor MCP status
# Settings → MCP → Refresh → Check server status
```

### **Figma API Issues?**
- **Verify token** is correct and active
- **Check permissions** - token needs read access to your files
- **Test URL** - make sure Figma file is accessible

### **Cursor Integration Issues?**
- **Restart Cursor** after configuration changes
- **Check logs** in Cursor Developer Tools
- **Verify MCP** is enabled in Cursor settings

---

## 📂 **FILE STRUCTURE FOR FIGMA COMPONENTS**

```
ko-lake-villa-website/
├── .cursor/
│   └── mcp.json                    # Project MCP config
├── components/
│   ├── figma-generated/            # Generated from Figma
│   │   ├── booking-form.tsx        # Booking forms
│   │   ├── accommodation-card.tsx  # Room cards  
│   │   └── gallery-layout.tsx      # Gallery components
│   └── ui/                        # Existing UI components
└── FIGMA_CURSOR_SETUP.md          # This guide
```

---

## 🎨 **KO LAKE VILLA DESIGN TOKENS**

### **When Creating Figma Designs:**
```css
/* Use these colors in Figma */
Primary: #92400e      /* amber-800 */
Secondary: #fed7aa    /* orange-100 */  
Background: #ffffff   /* white */
Text: #374151         /* gray-700 */

/* Typography */
Headings: Bold, 24px+
Body: Regular, 16px
Small: Regular, 14px
```

---

## ✅ **READY TO USE!**

### **Next Steps:**
1. **Get your Figma API token** from the Figma developers page
2. **Add token** to the MCP configuration files  
3. **Restart Cursor** and test with a simple Figma design
4. **Create Ko Lake Villa components** using the design-to-code workflow

### **Ko Lake Villa Specific Use Cases:**
- **Booking forms** for accommodation reservations
- **Gallery layouts** for photo/video displays  
- **Accommodation cards** for room presentations
- **Contact forms** with Ko Lake Villa branding
- **Hero sections** with lake and villa imagery

**🚀 Your Figma-to-Cursor integration is ready for Ko Lake Villa development!** 