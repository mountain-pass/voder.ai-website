// Traffic source tracking utilities for analytics
export interface TrafficSource {
  category: 'direct' | 'social' | 'search' | 'referral';
  source: string;
  medium?: string;
  campaign?: string;
  referrer: string;
  isLinkedIn: boolean;
  isPaid: boolean;
  utmParams: UTMParams;
}

export interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

/**
 * Extract UTM parameters from the current URL
 */
export function extractUTMParams(): UTMParams {
  const urlParams = new URLSearchParams(window.location.search);

  return {
    source: urlParams.get('utm_source') || undefined,
    medium: urlParams.get('utm_medium') || undefined,
    campaign: urlParams.get('utm_campaign') || undefined,
    term: urlParams.get('utm_term') || undefined,
    content: urlParams.get('utm_content') || undefined,
  };
}

/**
 * Detect if traffic is from LinkedIn
 */
export function isLinkedInTraffic(referrer: string, utmSource?: string): boolean {
  if (utmSource?.toLowerCase().includes('linkedin')) {
    return true;
  }

  const linkedInDomains = [
    'linkedin.com',
    'www.linkedin.com',
    'm.linkedin.com',
    'touch.www.linkedin.com',
    'lnkd.in',
  ];

  return linkedInDomains.some((domain) => referrer.toLowerCase().includes(domain));
}

/**
 * Categorize traffic source based on referrer and UTM parameters
 */
export function categorizeTrafficSource(
  referrer: string,
  utmParams: UTMParams,
): TrafficSource['category'] {
  // Check UTM medium first
  if (utmParams.medium) {
    const medium = utmParams.medium.toLowerCase();

    if (medium.includes('social')) return 'social';
    if (medium.includes('search') || medium.includes('cpc') || medium.includes('ppc'))
      return 'search';
    if (medium.includes('referral')) return 'referral';
  }

  // If no referrer or same domain, it's direct
  if (!referrer || referrer === '' || referrer.includes(window.location.hostname)) {
    return 'direct';
  }

  // Check for social media domains
  const socialDomains = [
    'linkedin.com',
    'facebook.com',
    'twitter.com',
    'x.com',
    'instagram.com',
    'youtube.com',
    'tiktok.com',
    'pinterest.com',
    'reddit.com',
  ];

  if (socialDomains.some((domain) => referrer.toLowerCase().includes(domain))) {
    return 'social';
  }

  // Check for search engines
  const searchDomains = ['google.', 'bing.', 'yahoo.', 'duckduckgo.', 'baidu.', 'yandex.'];

  if (searchDomains.some((domain) => referrer.toLowerCase().includes(domain))) {
    return 'search';
  }

  // Everything else is referral
  return 'referral';
}

/**
 * Determine if traffic is paid based on UTM parameters
 */
export function isPaidTraffic(utmParams: UTMParams): boolean {
  if (!utmParams.medium) return false;

  const paidMediums = ['cpc', 'ppc', 'paid', 'banner', 'display', 'video', 'sponsored'];

  return paidMediums.some((medium) => utmParams.medium?.toLowerCase().includes(medium));
}

/**
 * Get the source name from referrer URL
 */
export function extractSourceName(referrer: string, utmParams: UTMParams): string {
  // Use UTM source if available
  if (utmParams.source) {
    return utmParams.source;
  }

  // Extract domain from referrer
  if (referrer && referrer !== '') {
    try {
      const url = new URL(referrer);

      return url.hostname.replace('www.', '');
    } catch {
      return referrer;
    }
  }

  return 'direct';
}

/**
 * Analyze current traffic source
 */
export function analyzeTrafficSource(): TrafficSource {
  const referrer = document.referrer || '';

  const utmParams = extractUTMParams();

  const category = categorizeTrafficSource(referrer, utmParams);

  const source = extractSourceName(referrer, utmParams);

  const isLinkedIn = isLinkedInTraffic(referrer, utmParams.source);

  const isPaid = isPaidTraffic(utmParams);

  return {
    category,
    source,
    medium: utmParams.medium,
    campaign: utmParams.campaign,
    referrer,
    isLinkedIn,
    isPaid,
    utmParams,
  };
}

/**
 * Track traffic source with analytics
 */
export function trackTrafficSource(trafficSource: TrafficSource): void {
  // Track with Microsoft Clarity custom tags
  if (typeof window !== 'undefined' && (window as any).clarity) {
    const clarity = (window as any).clarity;

    // Set custom tags for traffic analysis
    clarity('set', 'traffic_category', trafficSource.category);
    clarity('set', 'traffic_source', trafficSource.source);
    clarity('set', 'is_linkedin', trafficSource.isLinkedIn.toString());
    clarity('set', 'is_paid', trafficSource.isPaid.toString());

    if (trafficSource.medium) {
      clarity('set', 'traffic_medium', trafficSource.medium);
    }

    if (trafficSource.campaign) {
      clarity('set', 'traffic_campaign', trafficSource.campaign);
    }

    // Log for debugging
    console.warn('Traffic source tracked:', {
      category: trafficSource.category,
      source: trafficSource.source,
      medium: trafficSource.medium,
      campaign: trafficSource.campaign,
      isLinkedIn: trafficSource.isLinkedIn,
      isPaid: trafficSource.isPaid,
    });
  }
}
