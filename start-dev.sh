#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🍻 Beers eCommerce - Starting Full Stack${NC}"
echo ""

# Start backend
echo -e "${GREEN}Starting Backend Server (Port 5000)...${NC}"
cd backend
npm start &
BACKEND_PID=$!

sleep 2

# Start frontend
echo -e "${GREEN}Starting Frontend Server (Port 3000)...${NC}"
cd ..
npm run dev &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}✓ Backend running on http://localhost:5000${NC}"
echo -e "${GREEN}✓ Frontend running on http://localhost:3000${NC}"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait
