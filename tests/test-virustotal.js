#!/usr/bin/env node

/**
 * VirusTotal API Test Script
 * Tests the VirusTotal API integration
 */

const dotenv = require('dotenv');
const VirusTotalService = require('../backend/services/virusTotalService');

// Load environment variables
dotenv.config({ path: '../config/.env' });

async function testVirusTotalAPI() {
  console.log('🧪 Testing VirusTotal API Integration...\n');

  try {
    // Initialize VirusTotal service
    const virusTotalService = new VirusTotalService();
    
    // Check service status
    const status = virusTotalService.getStatus();
    console.log('📊 Service Status:');
    console.log(JSON.stringify(status, null, 2));
    console.log('');

    if (!status.available) {
      console.error('❌ VirusTotal service is not available');
      if (status.error) {
        console.error('Error:', status.error);
      }
      return;
    }

    // Test URLs
    const testUrls = [
      'https://www.google.com', // Known safe URL
      'https://example.com',    // Known safe URL
      'https://malware.testing.google.test/malware/' // Known test malware URL (if it exists)
    ];

    console.log('🔍 Testing URL analysis...\n');

    for (const url of testUrls) {
      console.log(`Testing URL: ${url}`);
      try {
        const result = await virusTotalService.checkUrl(url);
        
        console.log(`  ✅ Analysis completed`);
        console.log(`  🎯 Is Threat: ${result.isThreat}`);
        console.log(`  📊 Confidence: ${result.confidence}`);
        console.log(`  🏷️  Source: ${result.source}`);
        
        if (result.isThreat) {
          console.log(`  🚨 Threat Types: ${result.threatTypes.join(', ')}`);
          if (result.details?.positives !== undefined) {
            console.log(`  📈 Detections: ${result.details.positives}/${result.details.total}`);
          }
        }
        
        if (result.error) {
          console.log(`  ⚠️  Error: ${result.error}`);
        }
        
        console.log('');
        
        // Wait between requests to respect rate limits
        if (testUrls.indexOf(url) < testUrls.length - 1) {
          console.log('⏳ Waiting 15 seconds to respect rate limits...');
          await new Promise(resolve => setTimeout(resolve, 15000));
        }
        
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
        console.log('');
      }
    }

    console.log('✅ VirusTotal API test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testVirusTotalAPI().catch(console.error);
}

module.exports = { testVirusTotalAPI };
