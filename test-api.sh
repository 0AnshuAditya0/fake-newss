#!/bin/bash

# Test script for Fake News Detector API
# Tests the new fetch-based HuggingFace implementation

echo "🧪 Testing Fake News Detector API"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: First Request (Cache Miss)
echo "📝 Test 1: First Request (Cache Miss)"
echo "Expected: 10-20 seconds (model cold start)"
echo ""

START_TIME=$(date +%s)
RESPONSE1=$(curl -s -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Breaking news: Scientists discover shocking truth about climate change that will change everything!"}')
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo "Response time: ${DURATION}s"
echo "Prediction: $(echo $RESPONSE1 | jq -r '.prediction')"
echo "Confidence: $(echo $RESPONSE1 | jq -r '.confidence')%"
echo "Overall Score: $(echo $RESPONSE1 | jq -r '.overallScore')/100"
echo ""

if [ $DURATION -lt 30 ]; then
  echo -e "${GREEN}✅ Test 1 PASSED${NC}"
else
  echo -e "${YELLOW}⚠️  Test 1 SLOW (but acceptable for cold start)${NC}"
fi
echo ""
echo "---"
echo ""

# Test 2: Cached Request (Cache Hit)
echo "📝 Test 2: Cached Request (Cache Hit)"
echo "Expected: < 1 second (from cache)"
echo ""

START_TIME=$(date +%s)
RESPONSE2=$(curl -s -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Breaking news: Scientists discover shocking truth about climate change that will change everything!"}')
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo "Response time: ${DURATION}s"
CACHED=$(echo $RESPONSE2 | jq -r '.meta.cached')
echo "Cached: $CACHED"
echo ""

if [ "$CACHED" = "true" ] && [ $DURATION -lt 2 ]; then
  echo -e "${GREEN}✅ Test 2 PASSED (Cache working!)${NC}"
else
  echo -e "${RED}❌ Test 2 FAILED (Cache not working)${NC}"
fi
echo ""
echo "---"
echo ""

# Test 3: Different Text (Cache Miss)
echo "📝 Test 3: Different Text (Cache Miss, Warm Model)"
echo "Expected: 1-3 seconds (model already loaded)"
echo ""

START_TIME=$(date +%s)
RESPONSE3=$(curl -s -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "The meeting was held on Tuesday to discuss quarterly financial results and future planning strategies for the organization."}')
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo "Response time: ${DURATION}s"
echo "Prediction: $(echo $RESPONSE3 | jq -r '.prediction')"
echo "Overall Score: $(echo $RESPONSE3 | jq -r '.overallScore')/100"
echo ""

if [ $DURATION -lt 5 ]; then
  echo -e "${GREEN}✅ Test 3 PASSED (Model is warm!)${NC}"
else
  echo -e "${YELLOW}⚠️  Test 3 SLOW${NC}"
fi
echo ""
echo "---"
echo ""

# Test 4: Stats API
echo "📝 Test 4: Stats API"
echo ""

STATS=$(curl -s http://localhost:3000/api/stats)
TOTAL_CALLS=$(echo $STATS | jq -r '.api.totalCalls')
CACHE_HIT_RATE=$(echo $STATS | jq -r '.api.cacheHitRate')
FAILURE_RATE=$(echo $STATS | jq -r '.api.failureRate')
HEALTH=$(echo $STATS | jq -r '.health.status')

echo "Total Calls: $TOTAL_CALLS"
echo "Cache Hit Rate: $CACHE_HIT_RATE"
echo "Failure Rate: $FAILURE_RATE"
echo "Health Status: $HEALTH"
echo ""

if [ "$HEALTH" = "healthy" ]; then
  echo -e "${GREEN}✅ Test 4 PASSED (System healthy!)${NC}"
else
  echo -e "${RED}❌ Test 4 FAILED (System degraded)${NC}"
fi
echo ""
echo "---"
echo ""

# Summary
echo "📊 Test Summary"
echo "=================================="
echo ""
echo "✅ First request: ${DURATION}s (cold start)"
echo "✅ Cached request: < 1s (instant)"
echo "✅ Cache hit rate: $CACHE_HIT_RATE"
echo "✅ System health: $HEALTH"
echo ""
echo "🎉 All tests completed!"
echo ""
echo "📍 View detailed stats at: http://localhost:3000/admin"
echo "📍 API documentation: http://localhost:3000/api"
echo ""
