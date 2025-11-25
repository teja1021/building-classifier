#!/bin/bash
# Frontend Verification Checklist
# Run this to verify all frontend files are properly set up

echo "======================================================================"
echo "FRONTEND VERIFICATION CHECKLIST"
echo "======================================================================"
echo ""

# Check files exist
echo "✓ Checking Core Files..."
[ -f "package.json" ] && echo "  ✓ package.json" || echo "  ✗ package.json MISSING"
[ -f "vite.config.js" ] && echo "  ✓ vite.config.js" || echo "  ✗ vite.config.js MISSING"
[ -f "tailwind.config.js" ] && echo "  ✓ tailwind.config.js" || echo "  ✗ tailwind.config.js MISSING"
[ -f "postcss.config.cjs" ] && echo "  ✓ postcss.config.cjs" || echo "  ✗ postcss.config.cjs MISSING"
[ -f "index.html" ] && echo "  ✓ index.html" || echo "  ✗ index.html MISSING"
[ -f ".env" ] && echo "  ✓ .env" || echo "  ✗ .env MISSING"
echo ""

echo "✓ Checking Source Files..."
[ -f "src/main.jsx" ] && echo "  ✓ src/main.jsx" || echo "  ✗ src/main.jsx MISSING"
[ -f "src/App.jsx" ] && echo "  ✓ src/App.jsx" || echo "  ✗ src/App.jsx MISSING"
[ -f "src/api.js" ] && echo "  ✓ src/api.js" || echo "  ✗ src/api.js MISSING"
[ -f "src/index.css" ] && echo "  ✓ src/index.css" || echo "  ✗ src/index.css MISSING"
echo ""

echo "✓ Checking Pages..."
[ -f "src/pages/Login.jsx" ] && echo "  ✓ src/pages/Login.jsx" || echo "  ✗ src/pages/Login.jsx MISSING"
[ -f "src/pages/Main.jsx" ] && echo "  ✓ src/pages/Main.jsx" || echo "  ✗ src/pages/Main.jsx MISSING"
[ -f "src/pages/DatasetBrowser.jsx" ] && echo "  ✓ src/pages/DatasetBrowser.jsx" || echo "  ✗ src/pages/DatasetBrowser.jsx MISSING"
[ -f "src/pages/ModelMetrics.jsx" ] && echo "  ✓ src/pages/ModelMetrics.jsx" || echo "  ✗ src/pages/ModelMetrics.jsx MISSING"
[ -f "src/pages/ConfusionMatrix.jsx" ] && echo "  ✓ src/pages/ConfusionMatrix.jsx" || echo "  ✗ src/pages/ConfusionMatrix.jsx MISSING"
echo ""

echo "✓ Checking Components..."
[ -f "src/components/UploadDropzone.jsx" ] && echo "  ✓ src/components/UploadDropzone.jsx" || echo "  ✗ src/components/UploadDropzone.jsx MISSING"
echo ""

echo "✓ Checking Dependencies..."
[ -d "node_modules" ] && echo "  ✓ node_modules (installed)" || echo "  ✗ node_modules MISSING"
[ -f "package-lock.json" ] && echo "  ✓ package-lock.json" || echo "  ✗ package-lock.json MISSING"
echo ""

echo "✓ Checking Configuration..."
[ -f ".eslintrc.json" ] && echo "  ✓ .eslintrc.json" || echo "  ✗ .eslintrc.json MISSING"
[ -f ".prettierrc.json" ] && echo "  ✓ .prettierrc.json" || echo "  ✗ .prettierrc.json MISSING"
echo ""

echo "======================================================================"
echo "QUICK START"
echo "======================================================================"
echo ""
echo "To start the frontend development server:"
echo "  npm run dev"
echo ""
echo "Then open in your browser:"
echo "  http://localhost:5173"
echo ""
echo "Default login credentials (any non-empty values work):"
echo "  Username: demo"
echo "  Password: password"
echo ""
echo "======================================================================"
