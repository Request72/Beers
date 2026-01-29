#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "🍻 Beers eCommerce - Setup Guide"
echo -e "${NC}"

echo -e "${YELLOW}⚠️  You need MongoDB Atlas to run this app${NC}"
echo ""
echo "Steps to get started:"
echo ""
echo -e "${GREEN}1. MongoDB Atlas Setup (5 minutes)${NC}"
echo "   - Visit: https://www.mongodb.com/cloud/atlas"
echo "   - Sign up (free)"
echo "   - Create a cluster"
echo "   - Add a database user (username: admin)"
echo "   - Allow network access from anywhere"
echo "   - Copy your connection string"
echo ""
echo -e "${GREEN}2. Update Configuration${NC}"
echo "   - Open: backend/.env.local"
echo "   - Replace 'your_password_here' with your actual password"
echo "   - Example:"
echo "     MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/beers-ecommerce?retryWrites=true&w=majority"
echo ""
echo -e "${GREEN}3. Seed the Database${NC}"
echo "   cd backend"
echo "   npm run seed"
echo ""
echo -e "${GREEN}4. Start the App${NC}"
echo "   Terminal 1:"
echo "   cd backend && npm start"
echo ""
echo "   Terminal 2:"
echo "   npm run dev"
echo ""
echo "   Visit: http://localhost:3000"
echo ""
echo -e "${BLUE}Full instructions: Read MONGODB_ATLAS_SETUP.md${NC}"
echo ""
