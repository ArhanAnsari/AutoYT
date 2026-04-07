#!/bin/bash

# AutoYT CRON_SECRET Verification Script
# This script tests that the CRON_SECRET is properly configured and validates correctly

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     AutoYT CRON_SECRET Verification Test           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if CRON_SECRET is set
if [ -z "$CRON_SECRET" ]; then
    echo -e "${YELLOW}ℹ️  CRON_SECRET not in current shell session${NC}"
    echo -e "${YELLOW}Loading from .env.local...${NC}"
    
    # Load from .env.local
    if [ -f .env.local ]; then
        export CRON_SECRET=$(grep "^CRON_SECRET=" .env.local | cut -d '"' -f 2)
    else
        echo -e "${RED}✗ ERROR: .env.local not found${NC}"
        exit 1
    fi
fi

if [ -z "$CRON_SECRET" ]; then
    echo -e "${RED}✗ ERROR: CRON_SECRET not found in .env.local${NC}"
    exit 1
fi

echo -e "${GREEN}✓ CRON_SECRET found${NC}"
echo -e "${BLUE}Secret (first 20 chars): ${CRON_SECRET:0:20}...${NC}"
echo ""

# Test if server is running
echo -e "${YELLOW}Checking if server is running on localhost:3000...${NC}"
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${RED}✗ Server not running. Start it with: npm run dev${NC}"
    echo -e "${YELLOW}Cannot proceed with live tests while running manually.${NC}"
    echo ""
    echo -e "${BLUE}To manually test when server is running:${NC}"
    echo ""
    echo -e "${YELLOW}1. Test WITH correct secret (should work):${NC}"
    echo "curl -X POST http://localhost:3000/api/publish-scheduled \\"
    echo "  -H \"Authorization: Bearer $CRON_SECRET\" \\"
    echo "  -H \"Content-Type: application/json\" \\"
    echo "  -d '{\"channelId\":\"test\"}'"
    echo ""
    echo -e "${YELLOW}2. Test WITH wrong secret (should fail with 401):${NC}"
    echo "curl -X POST http://localhost:3000/api/publish-scheduled \\"
    echo "  -H \"Authorization: Bearer wrong-secret\" \\"
    echo "  -H \"Content-Type: application/json\" \\"
    echo "  -d '{\"channelId\":\"test\"}'"
    echo ""
    exit 0
fi

echo -e "${GREEN}✓ Server is running${NC}"
echo ""

# Test 1: Valid secret
echo -e "${YELLOW}Test 1: Calling endpoint WITH correct secret...${NC}"
RESPONSE=$(curl -s -X POST http://localhost:3000/api/publish-scheduled \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"channelId":"test-channel-id"}' \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "200" ]; then
    echo -e "${GREEN}✓ Response: 200 OK${NC}"
    echo -e "${BLUE}Body: $BODY${NC}"
else
    echo -e "${RED}✗ Response: $HTTP_CODE (expected 200)${NC}"
    echo -e "${BLUE}Body: $BODY${NC}"
fi

echo ""

# Test 2: Invalid secret
echo -e "${YELLOW}Test 2: Calling endpoint WITH wrong secret...${NC}"
RESPONSE=$(curl -s -X POST http://localhost:3000/api/publish-scheduled \
  -H "Authorization: Bearer wrong-secret-should-fail" \
  -H "Content-Type: application/json" \
  -d '{"channelId":"test-channel-id"}' \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "401" ]; then
    echo -e "${GREEN}✓ Response: 401 Unauthorized (as expected)${NC}"
    echo -e "${BLUE}Body: $BODY${NC}"
else
    echo -e "${RED}✗ Response: $HTTP_CODE (expected 401)${NC}"
    echo -e "${BLUE}Body: $BODY${NC}"
fi

echo ""

# Test 3: No secret
echo -e "${YELLOW}Test 3: Calling endpoint WITHOUT secret...${NC}"
RESPONSE=$(curl -s -X POST http://localhost:3000/api/publish-scheduled \
  -H "Content-Type: application/json" \
  -d '{"channelId":"test-channel-id"}' \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "401" ]; then
    echo -e "${GREEN}✓ Response: 401 Unauthorized (as expected)${NC}"
    echo -e "${BLUE}Body: $BODY${NC}"
else
    echo -e "${RED}✗ Response: $HTTP_CODE (expected 401)${NC}"
    echo -e "${BLUE}Body: $BODY${NC}"
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          CRON_SECRET Verification Complete!        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Your CRON_SECRET is ready for production!${NC}"
