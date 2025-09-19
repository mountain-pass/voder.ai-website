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

export interface SessionAnalytics {
  sessionId: string;
  sessionStart: number;
  sessionEnd?: number;
  isNewVisitor: boolean;
  isReturningVisitor: boolean;
  visitorId: string;
  visitCount: number;
  lastVisit?: number;
  timeSinceLastVisit?: number;
  sessionDuration?: number;
  deviceInfo: DeviceInfo;
  frequencyCategory: 'new' | 'occasional' | 'regular' | 'frequent';
}

export interface DeviceInfo {
  userAgent: string;
  screen: {
    width: number;
    height: number;
  };
  viewport: {
    width: number;
    height: number;
  };
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  browser: string;
  os: string;
}

export interface VisitorData {
  visitorId: string;
  visitCount: number;
  lastVisit: number;
  totalSessions: number;
  firstVisit: number;
  loyaltyScore: number;
}

// Global bounce tracking state
let bounceState: BounceAnalytics | null = null;

// Global session tracking state
let sessionState: SessionAnalytics | null = null;

// Session configuration constants
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

const VISITOR_STORAGE_KEY = 'voder_visitor_data';

const SESSION_STORAGE_KEY = 'voder_session_data';

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
  const isLinkedInReferrer =
    referrer.toLowerCase().includes('linkedin.com') || referrer.toLowerCase().includes('lnkd.in');

  const isLinkedInUTM = utmSource?.toLowerCase().includes('linkedin') ?? false;

  return isLinkedInReferrer || isLinkedInUTM;
}

/**
 * Generate a unique visitor ID or retrieve existing one
 */
function generateVisitorId(): string {
  if (typeof window === 'undefined') return 'server-side';

  // Try to get existing visitor ID from localStorage
  try {
    const storedData = localStorage.getItem(VISITOR_STORAGE_KEY);

    if (storedData) {
      const visitorData: VisitorData = JSON.parse(storedData);

      return visitorData.visitorId;
    }
  } catch (error) {
    console.warn('Error reading visitor data from localStorage:', error);
  }

  // Generate new visitor ID
  const timestamp = Date.now();

  const random = Math.random().toString(36).substring(2, 15);

  return `visitor_${timestamp}_${random}`;
}

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  const timestamp = Date.now();

  const random = Math.random().toString(36).substring(2, 15);

  return `session_${timestamp}_${random}`;
}

/**
 * Detect device information
 */
function detectDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      userAgent: 'server-side',
      screen: { width: 0, height: 0 },
      viewport: { width: 0, height: 0 },
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      browser: 'unknown',
      os: 'unknown',
    };
  }

  const userAgent = navigator.userAgent;

  const screen = {
    width: window.screen.width,
    height: window.screen.height,
  };

  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // Simple device type detection based on viewport width
  const isMobile = viewport.width <= 768;

  const isTablet = viewport.width > 768 && viewport.width <= 1024;

  const isDesktop = viewport.width > 1024;

  // Simple browser detection
  let browser = 'unknown';

  if (userAgent.includes('Edg/')) browser = 'edge';
  else if (userAgent.includes('Firefox')) browser = 'firefox';
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'safari';
  else if (userAgent.includes('Chrome')) browser = 'chrome';

  // Simple OS detection
  let os = 'unknown';

  if (userAgent.includes('Android')) os = 'android';
  else if (userAgent.includes('iPhone') || userAgent.includes('iPad') || userAgent.includes('iOS'))
    os = 'ios';
  else if (userAgent.includes('Windows')) os = 'windows';
  else if (userAgent.includes('Mac')) os = 'macos';
  else if (userAgent.includes('Linux')) os = 'linux';

  return {
    userAgent,
    screen,
    viewport,
    isMobile,
    isTablet,
    isDesktop,
    browser,
    os,
  };
}

/**
 * Get or create visitor data from localStorage
 * Returns both current and original lastVisit times
 */
function getVisitorData(): {
  visitorData: VisitorData;
  originalLastVisit?: number;
  timeSinceLastVisit?: number;
} {
  if (typeof window === 'undefined') {
    return {
      visitorData: {
        visitorId: 'server-side',
        visitCount: 1,
        lastVisit: Date.now(),
        totalSessions: 1,
        firstVisit: Date.now(),
        loyaltyScore: 1,
      },
    };
  }

  try {
    const storedData = localStorage.getItem(VISITOR_STORAGE_KEY);

    if (storedData) {
      const visitorData: VisitorData = JSON.parse(storedData);

      const originalLastVisit = visitorData.lastVisit;

      // Check if this is a new session (based on session timeout)
      const timeSinceLastVisit = Date.now() - visitorData.lastVisit;

      const isNewSession = timeSinceLastVisit > SESSION_TIMEOUT;

      if (isNewSession) {
        // Update visitor data for new session
        visitorData.visitCount += 1;
        visitorData.totalSessions += 1;
        visitorData.lastVisit = Date.now();

        // Calculate loyalty score based on frequency
        const daysSinceFirst = (Date.now() - visitorData.firstVisit) / (1000 * 60 * 60 * 24);

        visitorData.loyaltyScore = Math.min(
          visitorData.visitCount / Math.max(daysSinceFirst, 1),
          10,
        );

        // Save updated data
        localStorage.setItem(VISITOR_STORAGE_KEY, JSON.stringify(visitorData));

        return {
          visitorData,
          originalLastVisit,
          timeSinceLastVisit,
        };
      }

      return {
        visitorData,
        originalLastVisit: undefined, // Same session
        timeSinceLastVisit: undefined,
      };
    }
  } catch (error) {
    console.warn('Error reading visitor data from localStorage:', error);
  }

  // Create new visitor data
  const newVisitorData: VisitorData = {
    visitorId: generateVisitorId(),
    visitCount: 1,
    lastVisit: Date.now(),
    totalSessions: 1,
    firstVisit: Date.now(),
    loyaltyScore: 1,
  };

  try {
    localStorage.setItem(VISITOR_STORAGE_KEY, JSON.stringify(newVisitorData));
  } catch (error) {
    console.warn('Error storing visitor data to localStorage:', error);
  }

  return { visitorData: newVisitorData };
}

/**
 * Calculate frequency category based on visit patterns
 */
function calculateFrequencyCategory(
  visitorData: VisitorData,
): 'new' | 'occasional' | 'regular' | 'frequent' {
  if (visitorData.visitCount === 1) return 'new';

  const daysSinceFirst = (Date.now() - visitorData.firstVisit) / (1000 * 60 * 60 * 24);

  const visitsPerDay = visitorData.visitCount / Math.max(daysSinceFirst, 1);

  if (visitsPerDay >= 1) return 'frequent';
  if (visitsPerDay >= 0.5) return 'regular';

  return 'occasional';
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
 * Initialize session tracking for the current visitor
 */
export function initializeSessionTracking(trafficSource: TrafficSource): SessionAnalytics {
  if (typeof window === 'undefined') {
    // Return minimal session data for server-side rendering
    return {
      sessionId: 'server-side',
      sessionStart: Date.now(),
      isNewVisitor: true,
      isReturningVisitor: false,
      visitorId: 'server-side',
      visitCount: 1,
      deviceInfo: detectDeviceInfo(),
      frequencyCategory: 'new',
    };
  }

  // Get or create visitor data
  const {
    visitorData,
    originalLastVisit,
    timeSinceLastVisit: calculatedTimeSinceLastVisit,
  } = getVisitorData();

  // Determine if this is a new visitor based on the current visit count
  // Note: getVisitorData() increments visitCount for new sessions
  const isNewVisitor = visitorData.visitCount === 1;

  const isReturningVisitor = !isNewVisitor;

  // For returning visitors, use the calculated times from getVisitorData
  const sessionLastVisit = isReturningVisitor ? originalLastVisit : undefined;

  const sessionTimeSinceLastVisit = isReturningVisitor ? calculatedTimeSinceLastVisit : undefined;

  // Create session analytics object
  const session: SessionAnalytics = {
    sessionId: generateSessionId(),
    sessionStart: Date.now(),
    isNewVisitor,
    isReturningVisitor,
    visitorId: visitorData.visitorId,
    visitCount: visitorData.visitCount,
    lastVisit: sessionLastVisit,
    timeSinceLastVisit: sessionTimeSinceLastVisit,
    deviceInfo: detectDeviceInfo(),
    frequencyCategory: calculateFrequencyCategory(visitorData),
  };

  // Store session state globally
  sessionState = session;

  // Track session with Microsoft Clarity
  trackSessionWithClarity(session, trafficSource);

  // Set up session end tracking
  setupSessionEndTracking();

  return session;
}

/**
 * Track session data with Microsoft Clarity custom tags
 */
function trackSessionWithClarity(session: SessionAnalytics, trafficSource: TrafficSource): void {
  if (typeof window === 'undefined' || !(window as any).clarity) return;

  const clarity = (window as any).clarity;

  // Set session-related custom tags
  clarity('set', 'session_id', session.sessionId);
  clarity('set', 'visitor_id', session.visitorId);
  clarity('set', 'is_new_visitor', session.isNewVisitor.toString());
  clarity('set', 'is_returning_visitor', session.isReturningVisitor.toString());
  clarity('set', 'visit_count', session.visitCount.toString());
  clarity('set', 'frequency_category', session.frequencyCategory);

  // Set device information
  clarity(
    'set',
    'device_type',
    session.deviceInfo.isMobile ? 'mobile' : session.deviceInfo.isTablet ? 'tablet' : 'desktop',
  );
  clarity('set', 'browser', session.deviceInfo.browser);
  clarity('set', 'operating_system', session.deviceInfo.os);
  clarity(
    'set',
    'screen_resolution',
    `${session.deviceInfo.screen.width}x${session.deviceInfo.screen.height}`,
  );
  clarity(
    'set',
    'viewport_size',
    `${session.deviceInfo.viewport.width}x${session.deviceInfo.viewport.height}`,
  );

  // Set time since last visit for returning visitors
  if (session.timeSinceLastVisit !== undefined) {
    const daysSinceLastVisit = session.timeSinceLastVisit / (1000 * 60 * 60 * 24);

    clarity('set', 'days_since_last_visit', daysSinceLastVisit.toFixed(1));
  }

  // Track session start event
  clarity('event', 'session_start', {
    sessionId: session.sessionId,
    visitorType: session.isNewVisitor ? 'new' : 'returning',
    visitCount: session.visitCount,
    frequencyCategory: session.frequencyCategory,
    deviceType: session.deviceInfo.isMobile
      ? 'mobile'
      : session.deviceInfo.isTablet
        ? 'tablet'
        : 'desktop',
    browser: session.deviceInfo.browser,
    os: session.deviceInfo.os,
    trafficCategory: trafficSource.category,
    trafficSource: trafficSource.source,
  });

  console.warn('Session tracking initialized:', {
    sessionId: session.sessionId,
    visitorType: session.isNewVisitor ? 'new' : 'returning',
    visitCount: session.visitCount,
    frequencyCategory: session.frequencyCategory,
    deviceType: session.deviceInfo.isMobile
      ? 'mobile'
      : session.deviceInfo.isTablet
        ? 'tablet'
        : 'desktop',
  });
}

/**
 * Set up session end tracking
 */
function setupSessionEndTracking(): void {
  if (typeof window === 'undefined' || !sessionState) return;

  const handleSessionEnd = () => {
    if (!sessionState) return;

    const sessionDuration = Date.now() - sessionState.sessionStart;

    sessionState.sessionEnd = Date.now();
    sessionState.sessionDuration = sessionDuration;

    // Track session end with Microsoft Clarity
    if ((window as any).clarity) {
      const clarity = (window as any).clarity;

      clarity('event', 'session_end', {
        sessionId: sessionState.sessionId,
        sessionDuration,
        visitorType: sessionState.isNewVisitor ? 'new' : 'returning',
        visitCount: sessionState.visitCount,
        frequencyCategory: sessionState.frequencyCategory,
      });

      clarity('set', 'session_duration', sessionDuration.toString());
    }

    console.warn('Session ended:', {
      sessionId: sessionState.sessionId,
      duration: sessionDuration,
      durationMinutes: (sessionDuration / (1000 * 60)).toFixed(1),
    });
  };

  // Track session end on page unload
  window.addEventListener('beforeunload', handleSessionEnd);

  // Track session end on visibility change (for mobile/tab switching)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      handleSessionEnd();
    }
  });
}

/**
 * Get current session analytics state (for testing and debugging)
 */
export function getSessionState(): SessionAnalytics | null {
  return sessionState;
}

/**
 * Reset session tracking state (for testing)
 */
export function resetSessionTracking(): void {
  sessionState = null;

  // Clear localStorage for testing
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(VISITOR_STORAGE_KEY);
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (error) {
      console.warn('Error clearing session storage:', error);
    }
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
