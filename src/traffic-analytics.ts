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

export interface BounceAnalytics {
  sessionStart: number;
  pageViewCount: number;
  engagementThreshold: number;
  bounceTracked: boolean;
  trafficSource: TrafficSource;
}

// Global bounce tracking state
let bounceState: BounceAnalytics | null = null;

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

/**
 * Initialize bounce rate tracking for the current session
 */
export function initializeBounceTracking(trafficSource: TrafficSource): void {
  if (typeof window === 'undefined') return;

  bounceState = {
    sessionStart: Date.now(),
    pageViewCount: 1,
    engagementThreshold: 10000, // 10 seconds
    bounceTracked: false,
    trafficSource,
  };

  // Set up engagement tracking
  setupEngagementTracking();

  // Set up exit tracking
  setupExitTracking();
}

/**
 * Set up engagement tracking to detect meaningful interaction
 */
function setupEngagementTracking(): void {
  if (typeof window === 'undefined' || !bounceState) return;

  // Track scroll engagement
  const handleScroll = () => {
    if (!bounceState || bounceState.bounceTracked) return;

    const scrollPercent =
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

    if (scrollPercent > 25) {
      trackEngagement('scroll', { scrollPercent });
    }
  };

  // Track time-based engagement
  setTimeout(() => {
    if (!bounceState || bounceState.bounceTracked) return;
    trackEngagement('time', { duration: bounceState.engagementThreshold });
  }, bounceState.engagementThreshold);

  // Track click engagement
  const handleClick = () => {
    if (!bounceState || bounceState.bounceTracked) return;
    trackEngagement('click', {});
  };

  // Add event listeners
  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('click', handleClick);

  // Cleanup function for event listeners
  const cleanup = () => {
    window.removeEventListener('scroll', handleScroll);
    document.removeEventListener('click', handleClick);
  };

  // Store cleanup function for later use
  (window as any).__bounceTrackingCleanup = cleanup;
}

/**
 * Set up exit tracking to detect bounce behavior
 */
function setupExitTracking(): void {
  if (typeof window === 'undefined' || !bounceState) return;

  // Track page unload for potential bounce
  const handleBeforeUnload = () => {
    if (!bounceState) return;

    const sessionDuration = Date.now() - bounceState.sessionStart;

    const isBounce = bounceState.pageViewCount === 1 && !bounceState.bounceTracked;

    if (isBounce) {
      const bounceType = sessionDuration < bounceState.engagementThreshold ? 'quick' : 'considered';

      trackBounce(bounceType, sessionDuration);
    }
  };

  // Track visibility change for mobile/tab switching
  const handleVisibilityChange = () => {
    if (!bounceState || document.hidden) return;

    const sessionDuration = Date.now() - bounceState.sessionStart;

    if (sessionDuration > bounceState.engagementThreshold && !bounceState.bounceTracked) {
      trackEngagement('visibility', { duration: sessionDuration });
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  document.addEventListener('visibilitychange', handleVisibilityChange);
}

/**
 * Track engagement event that prevents bounce classification
 */
function trackEngagement(type: string, data: Record<string, any>): void {
  if (!bounceState || bounceState.bounceTracked) return;

  bounceState.bounceTracked = true;

  if (typeof window !== 'undefined' && (window as any).clarity) {
    const clarity = (window as any).clarity;

    // Track engagement event
    clarity('event', 'engagement', {
      type,
      ...data,
      sessionDuration: Date.now() - bounceState.sessionStart,
      trafficCategory: bounceState.trafficSource.category,
      trafficSource: bounceState.trafficSource.source,
      isLinkedIn: bounceState.trafficSource.isLinkedIn,
    });

    console.warn('Engagement tracked:', {
      type,
      data,
      sessionDuration: Date.now() - bounceState.sessionStart,
    });
  }
}

/**
 * Track bounce event with classification
 */
function trackBounce(bounceType: 'quick' | 'considered', duration: number): void {
  if (!bounceState) return;

  if (typeof window !== 'undefined' && (window as any).clarity) {
    const clarity = (window as any).clarity;

    // Track bounce event
    clarity('event', 'bounce', {
      bounceType,
      duration,
      trafficCategory: bounceState.trafficSource.category,
      trafficSource: bounceState.trafficSource.source,
      isLinkedIn: bounceState.trafficSource.isLinkedIn,
      isPaid: bounceState.trafficSource.isPaid,
    });

    // Set bounce rate custom tags
    clarity('set', 'bounce_rate', 'true');
    clarity('set', 'bounce_type', bounceType);
    clarity('set', 'session_duration', duration.toString());

    console.warn('Bounce tracked:', {
      bounceType,
      duration,
      trafficSource: bounceState.trafficSource.source,
    });
  }
}

/**
 * Get current bounce analytics state (for testing)
 */
export function getBounceState(): BounceAnalytics | null {
  return bounceState;
}

/**
 * Reset bounce tracking state (for testing)
 */
export function resetBounceTracking(): void {
  bounceState = null;

  // Cleanup event listeners if they exist
  if (typeof window !== 'undefined' && (window as any).__bounceTrackingCleanup) {
    (window as any).__bounceTrackingCleanup();
    delete (window as any).__bounceTrackingCleanup;
  }
}
