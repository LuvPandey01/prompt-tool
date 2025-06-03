#!/bin/bash

# AI Prompt Optimizer - File Organization Script
# This script organizes the files into the correct directory structure

echo "🤖 AI Prompt Optimizer - File Organization"
echo "=========================================="

# Create the directory structure
echo "📁 Creating directory structure..."
mkdir -p ai-prompt-optimizer
mkdir -p ai-prompt-optimizer/lib
mkdir -p ai-prompt-optimizer/public/css
mkdir -p ai-prompt-optimizer/public/js
mkdir -p ai-prompt-optimizer/views

# Move files to correct locations
echo "📋 Moving files to correct locations..."

# Move core files to root
echo "  Moving package.json..."
if [ -f "package.json" ]; then
    mv package.json ai-prompt-optimizer/
fi

echo "  Moving app.js..."
if [ -f "app.js" ]; then
    mv app.js ai-prompt-optimizer/
fi

echo "  Moving README.md..."
if [ -f "README.md" ]; then
    mv README.md ai-prompt-optimizer/
fi

echo "  Moving .env.example..."
if [ -f ".env.example" ]; then
    mv .env.example ai-prompt-optimizer/
fi

# Move lib files
echo "  Moving lib files..."
if [ -f "lib-promptAnalyzer.js" ]; then
    mv lib-promptAnalyzer.js ai-prompt-optimizer/lib/promptAnalyzer.js
fi

if [ -f "lib-promptEnhancer.js" ]; then
    mv lib-promptEnhancer.js ai-prompt-optimizer/lib/promptEnhancer.js
fi

# Move public files
echo "  Moving CSS files..."
if [ -f "public-css-styles.css" ]; then
    mv public-css-styles.css ai-prompt-optimizer/public/css/styles.css
fi

echo "  Moving JavaScript files..."
if [ -f "public-js-app.js" ]; then
    mv public-js-app.js ai-prompt-optimizer/public/js/app.js
fi

# Move view files
echo "  Moving HTML files..."
if [ -f "views-index.html" ]; then
    mv views-index.html ai-prompt-optimizer/views/index.html
fi

echo ""
echo "✅ File organization complete!"
echo ""
echo "📦 Project structure:"
echo "ai-prompt-optimizer/"
echo "├── package.json"
echo "├── app.js"
echo "├── README.md"
echo "├── .env.example"
echo "├── lib/"
echo "│   ├── promptAnalyzer.js"
echo "│   └── promptEnhancer.js"
echo "├── public/"
echo "│   ├── css/"
echo "│   │   └── styles.css"
echo "│   └── js/"
echo "│       └── app.js"
echo "└── views/"
echo "    └── index.html"
echo ""
echo "🚀 Next steps:"
echo "1. cd ai-prompt-optimizer"
echo "2. npm install"
echo "3. npm start (for local testing)"
echo "4. Deploy to Render.com following README instructions"
echo ""
echo "🎉 Your AI Prompt Optimizer is ready to deploy!"