# Analytics Dashboard Access

This document provides information on accessing analytics data for the voder.ai website.

## Microsoft Clarity Dashboard

The website uses Microsoft Clarity for comprehensive user behavior analytics.

### Accessing Analytics Data

**Dashboard URL**: https://clarity.microsoft.com/projects/view/t5zu4kays7

**What's Available**:

- **Page Views**: Real-time and historical page view counts
- **Unique Visitors**: Visitor identification and counting
- **Traffic Sources**: Referrer analysis and traffic source breakdown
- **Session Analytics**: Session duration, bounce rates, and engagement metrics
- **User Behavior**: Heatmaps, session recordings, and interaction patterns
- **Performance Metrics**: Page load times and user experience insights

### Key Analytics Features

#### Page View Tracking (015.0-PO-ANALYTICS-PAGEVIEWS)

✅ **IMPLEMENTED**

- Real-time page view tracking
- Daily and weekly visitor reports
- Unique visitor identification
- Data available within minutes of visitor activity
- Trending and historical analysis

#### Traffic Source Analysis (016.0-PO-ANALYTICS-TRAFFIC)

✅ **IMPLEMENTED**

- Automatic traffic source categorization (direct, social, search, referral)
- LinkedIn traffic specifically identified and tracked
- UTM parameter tracking for campaign attribution
- Referrer URL capture and analysis
- Organic vs paid traffic distinction

#### Bounce Rate Analytics (018.0-PO-ANALYTICS-BOUNCE)

✅ **IMPLEMENTED**

- Bounce rate calculation (single-page sessions)
- Quick bounce vs considered bounce classification
- Engagement tracking (scroll, click, time-based)
- Exit page identification
- Source-specific bounce rate analysis

### Data Access and Reporting

**Real-time Data**: Available immediately in Clarity dashboard  
**Historical Reports**: Full historical data with date range selection  
**Export Options**: Data can be exported for further analysis  
**Update Frequency**: Data refreshes automatically every few minutes

### Privacy Compliance

- Microsoft Clarity complies with GDPR and privacy regulations
- No personally identifiable information (PII) is collected
- Cookie-based tracking with user consent mechanisms
- Data retention follows Microsoft's privacy policies

### Analytics Implementation

The analytics tracking is implemented in:

- **Core Integration**: `src/main.ts` - Clarity initialization
- **Traffic Analysis**: `src/traffic-analytics.ts` - Custom tracking logic
- **Configuration**: Project ID t5zu4kays7 (configurable via environment variables)

### Custom Event Tracking

The website implements custom events for enhanced analytics:

1. **Traffic Source Events**
   - `traffic_source`: Captures detailed source attribution
   - `linkedin_traffic`: Specifically tracks LinkedIn-sourced visits
   - `utm_campaign`: Campaign performance tracking

2. **Engagement Events**
   - `engagement`: User interaction tracking (scroll, click, time)
   - `session_depth`: Session duration and depth analysis

3. **Bounce Classification Events**
   - `bounce`: Bounce event tracking with classification
   - `bounce_type`: Quick vs considered bounce categorization

### Support and Access

For analytics access issues or additional reporting needs:

1. Contact the development team for dashboard access
2. Additional analytics users can be added through Microsoft Clarity admin
3. Custom reporting requirements can be implemented as needed

**Project Status**: All analytics requirements fully implemented and operational.
