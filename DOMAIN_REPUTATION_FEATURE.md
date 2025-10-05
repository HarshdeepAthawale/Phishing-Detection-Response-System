# Domain Reputation Feature

## Overview

The phishing detection system now uses **external APIs** to determine domain trustworthiness instead of relying solely on hardcoded domain lists. This provides more dynamic and accurate domain reputation checking.

## How It Works

### 1. **External API Integration**

The system integrates with multiple domain reputation APIs:

- **APIVoid Site Trustworthiness API**: Analyzes domain blacklisting, SSL certificates, and suspicious redirects
- **Threat Intelligence Platform**: Provides reputation scores based on 120+ parameters
- **BuiltWith Trust API**: Checks if domains are parked, have affiliate links, or support e-commerce

### 2. **Fallback Mechanism**

If external APIs are unavailable or fail:
- The system falls back to the original hardcoded trusted domains list
- This ensures the system continues to work even without API access

### 3. **Dynamic Scoring**

Domain trust is now determined by:
- **Reputation Score**: 0-100 scale from external APIs
- **Confidence Level**: High/Medium/Low based on number of successful API calls
- **Risk Penalty**: Dynamic scoring based on reputation confidence

## API Configuration

### Required Environment Variables

Add these to your `.env` file (optional - system works without them):

```bash
# Domain Reputation API Keys
APIVOID_API_KEY=your_apivoid_api_key_here
THREAT_INTELLIGENCE_API_KEY=your_threat_intelligence_api_key_here
BUILTWITH_API_KEY=your_builtwith_api_key_here
```

### Getting API Keys

1. **APIVoid**: https://www.apivoid.com/
   - Free tier: 1,000 requests/month
   - Provides comprehensive security analysis

2. **Threat Intelligence Platform**: https://threatintelligenceplatform.com/
   - Free tier available
   - Analyzes 120+ parameters for domain reputation

3. **BuiltWith**: https://api.builtwith.com/
   - Free tier: 500 requests/month
   - Checks domain technology and trust indicators

## Implementation Details

### Server-Side Changes

**File**: `src/services/domainReputationService.js`
- New service class that handles multiple API calls
- Implements parallel API requests for better performance
- Includes comprehensive error handling and fallback logic

**File**: `src/phishingDetector.js`
- Updated `analyzeDomain()` method to use external APIs
- Maintains backward compatibility with fallback logic
- Enhanced risk scoring based on reputation data

**File**: `server.js`
- New endpoint: `POST /api/domain-reputation`
- Handles domain reputation requests from the frontend

### Client-Side Changes

**File**: `client/src/services/domainReputationService.ts`
- TypeScript service for frontend domain reputation checks
- Handles API communication with the backend
- Includes client-side fallback logic

**File**: `client/src/services/phishingService.ts`
- Updated to use external domain reputation APIs
- Enhanced risk scoring based on reputation confidence
- Improved recommendations based on API results

**File**: `client/src/types.ts`
- Added new fields for reputation data:
  - `reputationSource`: Which API provided the data
  - `confidence`: High/Medium/Low confidence level
  - `fallback`: Whether fallback logic was used

## Usage Examples

### For `tryhackme.com`:

**Before (Hardcoded)**:
- ❌ "Domain not in trusted list"
- Static 5-point penalty

**After (External API)**:
- ✅ Dynamic reputation analysis
- Real-time trust assessment
- Confidence-based scoring

### API Response Structure

```json
{
  "domain": "tryhackme.com",
  "isTrusted": false,
  "reputationScore": 65,
  "confidence": "medium",
  "sources": ["APIVoid", "Threat Intelligence Platform"],
  "issues": ["Domain has moderate reputation"],
  "details": {
    "apivoid": {
      "risk_score": 35,
      "is_secure": true,
      "is_blacklisted": false
    },
    "threatIntelligence": {
      "reputationScore": 70,
      "category": "Educational"
    }
  },
  "fallback": false
}
```

## Benefits

### 1. **Dynamic Updates**
- No need to manually update trusted domain lists
- Real-time reputation checking
- Automatic detection of new threats

### 2. **Better Accuracy**
- Multiple API sources for verification
- Confidence-based scoring
- Reduced false positives/negatives

### 3. **Scalability**
- Can easily add more reputation APIs
- Handles API failures gracefully
- Maintains performance with parallel requests

### 4. **Flexibility**
- Works with or without API keys
- Configurable confidence thresholds
- Easy to extend with new features

## Testing

### Without API Keys (Fallback Mode)
```bash
# The system will use hardcoded trusted domains
# No additional configuration needed
```

### With API Keys (Full Mode)
```bash
# Add your API keys to .env file
# Restart the server
# Test with: curl -X POST http://localhost:10000/api/domain-reputation -d '{"domain":"example.com"}'
```

## Monitoring

The system logs:
- API call successes/failures
- Fallback usage
- Performance metrics
- Error details for debugging

Check server logs for:
```
Domain reputation check failed: API timeout
Using fallback domain reputation check
APIVoid API error: Rate limit exceeded
```

## Future Enhancements

1. **Caching**: Implement domain reputation caching to reduce API calls
2. **More APIs**: Add VirusTotal, Google Safe Browsing, etc.
3. **Machine Learning**: Use API data to train local reputation models
4. **Real-time Updates**: WebSocket integration for live reputation updates

## Troubleshooting

### Common Issues

1. **API Rate Limits**: Use multiple APIs or implement caching
2. **Network Timeouts**: Increase timeout values in service configuration
3. **CORS Issues**: Ensure proper CORS configuration for API calls
4. **Invalid API Keys**: Check environment variable names and values

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=domain-reputation
```

This will show detailed API request/response information in the server logs.
