const mongoose = require('mongoose');

const analysisResultSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    index: true
  },
  isPhishing: {
    type: Boolean,
    required: true
  },
  riskScore: {
    type: Number,
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['LOW', 'LOW-MEDIUM', 'MEDIUM', 'HIGH'],
    required: true
  },
  details: {
    parsedUrl: {
      hostname: String,
      protocol: String,
      pathname: String
    },
    urlAnalysis: {
      score: Number,
      issues: [String],
      details: {
        length: Number,
        hasHTTPS: Boolean,
        hasIP: Boolean
      }
    },
    domainAnalysis: {
      score: Number,
      issues: [String],
      details: {
        isTrusted: Boolean,
        whois: {
          creationDate: String,
          ageInDays: Number,
          isNew: Boolean
        }
      }
    },
    contentAnalysis: {
      accessible: Boolean,
      score: Number,
      issues: [String],
      details: {
        title: String,
        hasForms: Boolean,
        formFields: Number,
        externalScripts: Number,
        hasUrgentLanguage: Boolean
      }
    },
    sslAnalysis: {
      hasSSL: Boolean,
      score: Number,
      issues: [String],
      details: {
        protocol: String
      }
    }
  },
  recommendations: [String],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  ipAddress: String,
  userAgent: String
});

// Create indexes for better performance
analysisResultSchema.index({ url: 1, createdAt: -1 });
analysisResultSchema.index({ isPhishing: 1, createdAt: -1 });

module.exports = mongoose.model('AnalysisResult', analysisResultSchema);
