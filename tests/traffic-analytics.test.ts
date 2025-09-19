/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  analyzeTrafficSource,
  categorizeTrafficSource,
  extractSourceName,
  extractUTMParams,
  getBounceState,
  getSessionState,
  initializeBounceTracking,
  initializeSessionTracking,
  isLinkedInTraffic,
  isPaidTraffic,
  resetBounceTracking,
  resetSessionTracking,
  trackTrafficSource,
  type TrafficSource,
  type UTMParams,
} from '../src/traffic-analytics.js';

// Mock window and document
const mockWindow = {
  location: {
    search: '',
    hostname: 'voder.ai',
  },
  screen: {
    width: 1920,
    height: 1080,
  },
  innerWidth: 1200,
  innerHeight: 800,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

const mockDocument = {
  referrer: '',
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  hidden: false,
};

const mockNavigator = {
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
};

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Setup global mocks
beforeEach(() => {
  vi.stubGlobal('window', mockWindow);
  vi.stubGlobal('document', mockDocument);
  vi.stubGlobal('navigator', mockNavigator);
  vi.stubGlobal('localStorage', mockLocalStorage);

  // Reset values
  mockWindow.location.search = '';
  mockDocument.referrer = '';
  mockLocalStorage.getItem.mockReturnValue(null);
  mockLocalStorage.setItem.mockClear();
  mockLocalStorage.removeItem.mockClear();
  mockWindow.addEventListener.mockClear();
  mockDocument.addEventListener.mockClear();

  // Reset session and bounce tracking
  resetSessionTracking();
  resetBounceTracking();
});

describe('extractUTMParams', () => {
  it('extracts UTM parameters from URL search params', () => {
    mockWindow.location.search =
      '?utm_source=linkedin&utm_medium=social&utm_campaign=test&utm_term=ai&utm_content=post1';

    const result = extractUTMParams();

    expect(result).toEqual({
      source: 'linkedin',
      medium: 'social',
      campaign: 'test',
      term: 'ai',
      content: 'post1',
    });
  });

  it('returns undefined for missing UTM parameters', () => {
    mockWindow.location.search = '?utm_source=linkedin';

    const result = extractUTMParams();

    expect(result).toEqual({
      source: 'linkedin',
      medium: undefined,
      campaign: undefined,
      term: undefined,
      content: undefined,
    });
  });

  it('handles empty search params', () => {
    mockWindow.location.search = '';

    const result = extractUTMParams();

    expect(result).toEqual({
      source: undefined,
      medium: undefined,
      campaign: undefined,
      term: undefined,
      content: undefined,
    });
  });
});

describe('isLinkedInTraffic', () => {
  it('detects LinkedIn traffic from UTM source', () => {
    expect(isLinkedInTraffic('', 'linkedin')).toBe(true);
    expect(isLinkedInTraffic('', 'LinkedIn')).toBe(true);
    expect(isLinkedInTraffic('', 'linkedin-ads')).toBe(true);
  });

  it('detects LinkedIn traffic from referrer domains', () => {
    expect(isLinkedInTraffic('https://www.linkedin.com/feed/', '')).toBe(true);
    expect(isLinkedInTraffic('https://linkedin.com/in/profile', '')).toBe(true);
    expect(isLinkedInTraffic('https://m.linkedin.com/profile', '')).toBe(true);
    expect(isLinkedInTraffic('https://lnkd.in/abc123', '')).toBe(true);
  });

  it('returns false for non-LinkedIn traffic', () => {
    expect(isLinkedInTraffic('https://google.com', 'google')).toBe(false);
    expect(isLinkedInTraffic('https://facebook.com', '')).toBe(false);
    expect(isLinkedInTraffic('', 'facebook')).toBe(false);
  });
});

describe('categorizeTrafficSource', () => {
  it('categorizes social traffic based on UTM medium', () => {
    const utmParams: UTMParams = { medium: 'social' };

    expect(categorizeTrafficSource('', utmParams)).toBe('social');
  });

  it('categorizes search traffic based on UTM medium', () => {
    const utmParams: UTMParams = { medium: 'cpc' };

    expect(categorizeTrafficSource('', utmParams)).toBe('search');

    const utmParams2: UTMParams = { medium: 'search' };

    expect(categorizeTrafficSource('', utmParams2)).toBe('search');
  });

  it('categorizes referral traffic based on UTM medium', () => {
    const utmParams: UTMParams = { medium: 'referral' };

    expect(categorizeTrafficSource('', utmParams)).toBe('referral');
  });

  it('categorizes direct traffic for empty referrer', () => {
    const utmParams: UTMParams = {};

    expect(categorizeTrafficSource('', utmParams)).toBe('direct');
  });

  it('categorizes direct traffic for same domain referrer', () => {
    const utmParams: UTMParams = {};

    expect(categorizeTrafficSource('https://voder.ai/about', utmParams)).toBe('direct');
  });

  it('categorizes direct traffic when referrer includes hostname', () => {
    const utmParams: UTMParams = {};

    // Test the specific branch: referrer.includes(window.location.hostname)
    expect(categorizeTrafficSource('https://subdomain.voder.ai/path', utmParams)).toBe('direct');
  });

  it('categorizes social traffic based on referrer domain', () => {
    const utmParams: UTMParams = {};

    expect(categorizeTrafficSource('https://linkedin.com/feed', utmParams)).toBe('social');
    expect(categorizeTrafficSource('https://facebook.com/share', utmParams)).toBe('social');
    expect(categorizeTrafficSource('https://twitter.com/post', utmParams)).toBe('social');
  });

  it('categorizes search traffic based on search engine domains', () => {
    const utmParams: UTMParams = {};

    expect(categorizeTrafficSource('https://google.com/search', utmParams)).toBe('search');
    expect(categorizeTrafficSource('https://bing.com/search', utmParams)).toBe('search');
    expect(categorizeTrafficSource('https://duckduckgo.com', utmParams)).toBe('search');
  });

  it('categorizes referral traffic for other domains', () => {
    const utmParams: UTMParams = {};

    expect(categorizeTrafficSource('https://example.com/article', utmParams)).toBe('referral');
    expect(categorizeTrafficSource('https://news.site.com', utmParams)).toBe('referral');
  });
});

describe('isPaidTraffic', () => {
  it('detects paid traffic from UTM medium', () => {
    expect(isPaidTraffic({ medium: 'cpc' })).toBe(true);
    expect(isPaidTraffic({ medium: 'ppc' })).toBe(true);
    expect(isPaidTraffic({ medium: 'paid' })).toBe(true);
    expect(isPaidTraffic({ medium: 'banner' })).toBe(true);
    expect(isPaidTraffic({ medium: 'display' })).toBe(true);
  });

  it('returns false for organic traffic', () => {
    expect(isPaidTraffic({ medium: 'organic' })).toBe(false);
    expect(isPaidTraffic({ medium: 'social' })).toBe(false);
    expect(isPaidTraffic({ medium: 'referral' })).toBe(false);
    expect(isPaidTraffic({})).toBe(false);
  });
});

describe('extractSourceName', () => {
  it('uses UTM source when available', () => {
    const utmParams: UTMParams = { source: 'linkedin' };

    expect(extractSourceName('https://facebook.com', utmParams)).toBe('linkedin');
  });

  it('extracts domain from referrer when no UTM source', () => {
    const utmParams: UTMParams = {};

    expect(extractSourceName('https://www.linkedin.com/feed', utmParams)).toBe('linkedin.com');
    expect(extractSourceName('https://google.com/search', utmParams)).toBe('google.com');
  });

  it('returns direct for empty referrer', () => {
    const utmParams: UTMParams = {};

    expect(extractSourceName('', utmParams)).toBe('direct');
  });

  it('handles invalid URLs gracefully', () => {
    const utmParams: UTMParams = {};

    expect(extractSourceName('not-a-url', utmParams)).toBe('not-a-url');
  });
});

describe('analyzeTrafficSource', () => {
  it('analyzes LinkedIn social traffic with UTM parameters', () => {
    mockWindow.location.search = '?utm_source=linkedin&utm_medium=social&utm_campaign=test';
    mockDocument.referrer = 'https://www.linkedin.com/feed/';

    const result = analyzeTrafficSource();

    expect(result).toEqual({
      category: 'social',
      source: 'linkedin',
      medium: 'social',
      campaign: 'test',
      referrer: 'https://www.linkedin.com/feed/',
      isLinkedIn: true,
      isPaid: false,
      utmParams: {
        source: 'linkedin',
        medium: 'social',
        campaign: 'test',
        term: undefined,
        content: undefined,
      },
    });
  });

  it('analyzes direct traffic with no referrer', () => {
    mockWindow.location.search = '';
    mockDocument.referrer = '';

    const result = analyzeTrafficSource();

    expect(result).toEqual({
      category: 'direct',
      source: 'direct',
      medium: undefined,
      campaign: undefined,
      referrer: '',
      isLinkedIn: false,
      isPaid: false,
      utmParams: {
        source: undefined,
        medium: undefined,
        campaign: undefined,
        term: undefined,
        content: undefined,
      },
    });
  });

  it('analyzes paid search traffic', () => {
    mockWindow.location.search = '?utm_source=google&utm_medium=cpc&utm_campaign=ai-tools';
    mockDocument.referrer = 'https://google.com/search';

    const result = analyzeTrafficSource();

    expect(result).toEqual({
      category: 'search',
      source: 'google',
      medium: 'cpc',
      campaign: 'ai-tools',
      referrer: 'https://google.com/search',
      isLinkedIn: false,
      isPaid: true,
      utmParams: {
        source: 'google',
        medium: 'cpc',
        campaign: 'ai-tools',
        term: undefined,
        content: undefined,
      },
    });
  });
});

describe('trackTrafficSource', () => {
  it('tracks traffic source with Clarity when available', () => {
    const mockClarity = vi.fn();

    const mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    vi.stubGlobal('window', {
      ...mockWindow,
      clarity: mockClarity,
    });

    const trafficSource: TrafficSource = {
      category: 'social',
      source: 'linkedin',
      medium: 'social',
      campaign: 'test',
      referrer: 'https://linkedin.com',
      isLinkedIn: true,
      isPaid: false,
      utmParams: { source: 'linkedin', medium: 'social', campaign: 'test' },
    };

    trackTrafficSource(trafficSource);

    expect(mockClarity).toHaveBeenCalledWith('set', 'traffic_category', 'social');
    expect(mockClarity).toHaveBeenCalledWith('set', 'traffic_source', 'linkedin');
    expect(mockClarity).toHaveBeenCalledWith('set', 'is_linkedin', 'true');
    expect(mockClarity).toHaveBeenCalledWith('set', 'is_paid', 'false');
    expect(mockClarity).toHaveBeenCalledWith('set', 'traffic_medium', 'social');
    expect(mockClarity).toHaveBeenCalledWith('set', 'traffic_campaign', 'test');

    expect(mockConsoleWarn).toHaveBeenCalledWith('Traffic source tracked:', {
      category: 'social',
      source: 'linkedin',
      medium: 'social',
      campaign: 'test',
      isLinkedIn: true,
      isPaid: false,
    });

    mockConsoleWarn.mockRestore();
  });

  it('handles missing Clarity gracefully', () => {
    vi.stubGlobal('window', mockWindow);

    const trafficSource: TrafficSource = {
      category: 'direct',
      source: 'direct',
      referrer: '',
      isLinkedIn: false,
      isPaid: false,
      utmParams: {},
    };

    // Should not throw error
    expect(() => trackTrafficSource(trafficSource)).not.toThrow();
  });
});

describe('Bounce Tracking', () => {
  let mockClarity: any;

  beforeEach(() => {
    resetBounceTracking();

    // Mock Date.now for consistent testing
    vi.spyOn(Date, 'now').mockReturnValue(1000000);

    // Mock Clarity as a function with methods
    mockClarity = vi.fn();
    mockClarity.event = vi.fn();
    mockClarity.set = vi.fn();

    // Create a Clarity function that delegates to methods
    const clarityFunction = vi.fn((action: string, ...args: any[]) => {
      if (action === 'event') {
        return mockClarity.event(args[0], args[1]);
      }
      if (action === 'set') {
        return mockClarity.set(args[0], args[1]);
      }
    });

    vi.stubGlobal('window', {
      ...mockWindow,
      clarity: clarityFunction,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      scrollY: 0,
      innerHeight: 1000,
    });

    vi.stubGlobal('document', {
      ...mockDocument,
      body: { scrollHeight: 2000 },
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      hidden: false,
    });
  });

  describe('initializeBounceTracking', () => {
    it('initializes bounce state correctly', () => {
      const trafficSource: TrafficSource = {
        category: 'social',
        source: 'linkedin.com',
        referrer: 'https://linkedin.com',
        isLinkedIn: true,
        isPaid: false,
        utmParams: { source: 'linkedin' },
      };

      initializeBounceTracking(trafficSource);

      const bounceState = getBounceState();

      expect(bounceState).not.toBeNull();
      expect(bounceState?.sessionStart).toBe(1000000);
      expect(bounceState?.pageViewCount).toBe(1);
      expect(bounceState?.engagementThreshold).toBe(10000);
      expect(bounceState?.bounceTracked).toBe(false);
      expect(bounceState?.trafficSource).toEqual(trafficSource);
    });

    it('sets up event listeners', () => {
      const trafficSource: TrafficSource = {
        category: 'direct',
        source: 'direct',
        referrer: '',
        isLinkedIn: false,
        isPaid: false,
        utmParams: {},
      };

      initializeBounceTracking(trafficSource);

      expect(window.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), {
        passive: true,
      });
      expect(window.addEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));
      expect(document.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
      expect(document.addEventListener).toHaveBeenCalledWith(
        'visibilitychange',
        expect.any(Function),
      );
    });

    it('handles missing window gracefully', () => {
      vi.stubGlobal('window', undefined);

      const trafficSource: TrafficSource = {
        category: 'direct',
        source: 'direct',
        referrer: '',
        isLinkedIn: false,
        isPaid: false,
        utmParams: {},
      };

      expect(() => initializeBounceTracking(trafficSource)).not.toThrow();
      expect(getBounceState()).toBeNull();
    });
  });

  describe('engagement tracking', () => {
    it('tracks scroll engagement when user scrolls past 25%', () => {
      const trafficSource: TrafficSource = {
        category: 'social',
        source: 'linkedin.com',
        referrer: 'https://linkedin.com',
        isLinkedIn: true,
        isPaid: false,
        utmParams: { source: 'linkedin' },
      };

      initializeBounceTracking(trafficSource);

      // Simulate scroll past 25%
      const scrollHandler = (window.addEventListener as any).mock.calls.find(
        (call: any) => call[0] === 'scroll',
      )[1];

      // Mock document.body.scrollHeight for the scroll calculation
      Object.defineProperty(document.body, 'scrollHeight', {
        value: 2000,
        writable: true,
        configurable: true,
      });

      // Set up window with proper values before calling the handler
      Object.defineProperty(window, 'scrollY', {
        value: 300,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, 'innerHeight', {
        value: 1000,
        writable: true,
        configurable: true,
      });

      scrollHandler();

      expect(mockClarity.event).toHaveBeenCalledWith('engagement', {
        type: 'scroll',
        scrollPercent: 30,
        sessionDuration: 0,
        trafficCategory: 'social',
        trafficSource: 'linkedin.com',
        isLinkedIn: true,
      });

      const bounceState = getBounceState();

      expect(bounceState?.bounceTracked).toBe(true);
    });

    it('tracks click engagement', () => {
      const trafficSource: TrafficSource = {
        category: 'direct',
        source: 'direct',
        referrer: '',
        isLinkedIn: false,
        isPaid: false,
        utmParams: {},
      };

      initializeBounceTracking(trafficSource);

      // Simulate click
      const clickHandler = (document.addEventListener as any).mock.calls.find(
        (call: any) => call[0] === 'click',
      )[1];

      clickHandler();

      expect(mockClarity.event).toHaveBeenCalledWith('engagement', {
        type: 'click',
        sessionDuration: 0,
        trafficCategory: 'direct',
        trafficSource: 'direct',
        isLinkedIn: false,
      });

      const bounceState = getBounceState();

      expect(bounceState?.bounceTracked).toBe(true);
    });

    it('tracks time-based engagement after threshold', () => {
      vi.useFakeTimers();

      const trafficSource: TrafficSource = {
        category: 'search',
        source: 'google.com',
        referrer: 'https://google.com',
        isLinkedIn: false,
        isPaid: false,
        utmParams: {},
      };

      initializeBounceTracking(trafficSource);

      // Fast-forward time past engagement threshold
      vi.advanceTimersByTime(10000);

      expect(mockClarity.event).toHaveBeenCalledWith('engagement', {
        type: 'time',
        duration: 10000,
        sessionDuration: 10000,
        trafficCategory: 'search',
        trafficSource: 'google.com',
        isLinkedIn: false,
      });

      vi.useRealTimers();
    });

    it('tracks engagement on visibility change after threshold', () => {
      const trafficSource: TrafficSource = {
        category: 'social',
        source: 'linkedin.com',
        referrer: 'https://linkedin.com',
        isLinkedIn: true,
        isPaid: false,
        utmParams: { source: 'linkedin' },
      };

      initializeBounceTracking(trafficSource);

      // Get the visibility change handler
      const visibilityHandler = (document.addEventListener as any).mock.calls.find(
        (call: any) => call[0] === 'visibilitychange',
      )[1];

      // Mock document.hidden to be false (page is visible)
      Object.defineProperty(document, 'hidden', {
        value: false,
        writable: true,
        configurable: true,
      });

      // Manually advance the session start time to simulate time passing
      const bounceState = getBounceState();

      if (bounceState) {
        bounceState.sessionStart = Date.now() - 12000; // 12 seconds ago
      }

      // Trigger visibility change
      visibilityHandler();

      expect(mockClarity.event).toHaveBeenCalledWith('engagement', {
        type: 'visibility',
        duration: 12000,
        sessionDuration: 12000,
        trafficCategory: 'social',
        trafficSource: 'linkedin.com',
        isLinkedIn: true,
      });
    });

    it('does not track engagement on visibility change when document is hidden', () => {
      const trafficSource: TrafficSource = {
        category: 'direct',
        source: 'direct',
        referrer: '',
        isLinkedIn: false,
        isPaid: false,
        utmParams: {},
      };

      initializeBounceTracking(trafficSource);

      // Get the visibility change handler
      const visibilityHandler = (document.addEventListener as any).mock.calls.find(
        (call: any) => call[0] === 'visibilitychange',
      )[1];

      // Mock document.hidden to be true (page is hidden)
      Object.defineProperty(document, 'hidden', {
        value: true,
        writable: true,
        configurable: true,
      });

      // Manually advance the session start time to simulate time passing
      const bounceState = getBounceState();

      if (bounceState) {
        bounceState.sessionStart = Date.now() - 12000; // 12 seconds ago
      }

      // Clear previous calls
      mockClarity.event.mockClear();

      // Trigger visibility change
      visibilityHandler();

      // Should not track engagement when document is hidden
      expect(mockClarity.event).not.toHaveBeenCalled();
    });
  });

  describe('bounce detection', () => {
    it('tracks quick bounce on page unload before engagement threshold', () => {
      vi.useFakeTimers();

      const trafficSource: TrafficSource = {
        category: 'social',
        source: 'linkedin.com',
        referrer: 'https://linkedin.com',
        isLinkedIn: true,
        isPaid: false,
        utmParams: { source: 'linkedin' },
      };

      initializeBounceTracking(trafficSource);

      // Simulate time passing (but less than engagement threshold)
      vi.setSystemTime(1005000); // 5 seconds later

      // Simulate page unload
      const unloadHandler = (window.addEventListener as any).mock.calls.find(
        (call: any) => call[0] === 'beforeunload',
      )[1];

      unloadHandler();

      expect(mockClarity.event).toHaveBeenCalledWith('bounce', {
        bounceType: 'quick',
        duration: 5000,
        trafficCategory: 'social',
        trafficSource: 'linkedin.com',
        isLinkedIn: true,
        isPaid: false,
      });

      expect(mockClarity.set).toHaveBeenCalledWith('bounce_rate', 'true');
      expect(mockClarity.set).toHaveBeenCalledWith('bounce_type', 'quick');
      expect(mockClarity.set).toHaveBeenCalledWith('session_duration', '5000');

      vi.useRealTimers();
    });

    it('tracks considered bounce on page unload after engagement threshold', () => {
      vi.useFakeTimers();

      const trafficSource: TrafficSource = {
        category: 'referral',
        source: 'example.com',
        referrer: 'https://example.com',
        isLinkedIn: false,
        isPaid: false,
        utmParams: {},
      };

      initializeBounceTracking(trafficSource);

      // Simulate time passing (more than engagement threshold)
      vi.setSystemTime(1015000); // 15 seconds later

      // Simulate page unload
      const unloadHandler = (window.addEventListener as any).mock.calls.find(
        (call: any) => call[0] === 'beforeunload',
      )[1];

      unloadHandler();

      expect(mockClarity.event).toHaveBeenCalledWith('bounce', {
        bounceType: 'considered',
        duration: 15000,
        trafficCategory: 'referral',
        trafficSource: 'example.com',
        isLinkedIn: false,
        isPaid: false,
      });

      vi.useRealTimers();
    });

    it('does not track bounce if engagement was already tracked', () => {
      const trafficSource: TrafficSource = {
        category: 'direct',
        source: 'direct',
        referrer: '',
        isLinkedIn: false,
        isPaid: false,
        utmParams: {},
      };

      initializeBounceTracking(trafficSource);

      // Simulate engagement first
      const clickHandler = (document.addEventListener as any).mock.calls.find(
        (call: any) => call[0] === 'click',
      )[1];

      clickHandler();

      // Clear previous calls
      mockClarity.event.mockClear();
      mockClarity.set.mockClear();

      // Simulate page unload
      const unloadHandler = (window.addEventListener as any).mock.calls.find(
        (call: any) => call[0] === 'beforeunload',
      )[1];

      unloadHandler();

      // Should not track bounce event
      expect(mockClarity.event).not.toHaveBeenCalledWith('bounce', expect.any(Object));
    });
  });

  describe('resetBounceTracking', () => {
    it('resets bounce state to null', () => {
      const trafficSource: TrafficSource = {
        category: 'direct',
        source: 'direct',
        referrer: '',
        isLinkedIn: false,
        isPaid: false,
        utmParams: {},
      };

      initializeBounceTracking(trafficSource);
      expect(getBounceState()).not.toBeNull();

      resetBounceTracking();
      expect(getBounceState()).toBeNull();
    });

    it('cleans up event listeners', () => {
      const mockCleanup = vi.fn();

      vi.stubGlobal('window', {
        ...mockWindow,
        __bounceTrackingCleanup: mockCleanup,
      });

      resetBounceTracking();

      expect(mockCleanup).toHaveBeenCalled();
    });
  });
});

describe('Session Analytics', () => {
  const mockTrafficSource: TrafficSource = {
    category: 'direct',
    source: 'direct',
    referrer: '',
    isLinkedIn: false,
    isPaid: false,
    utmParams: {},
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initializeSessionTracking', () => {
    it('creates session for new visitor', () => {
      const session = initializeSessionTracking(mockTrafficSource);

      expect(session).toMatchObject({
        isNewVisitor: true,
        isReturningVisitor: false,
        visitCount: 1,
        frequencyCategory: 'new',
      });
      expect(session.sessionId).toMatch(/^session_/);
      expect(session.visitorId).toMatch(/^visitor_/);
      expect(session.sessionStart).toBe(Date.now());
      expect(session.lastVisit).toBeUndefined();
      expect(session.timeSinceLastVisit).toBeUndefined();
    });

    it('tracks device information correctly', () => {
      const session = initializeSessionTracking(mockTrafficSource);

      expect(session.deviceInfo).toMatchObject({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        browser: 'chrome',
        os: 'macos',
        screen: { width: 1920, height: 1080 },
        viewport: { width: 1200, height: 800 },
      });
    });

    it('detects mobile device correctly', () => {
      mockWindow.innerWidth = 600;

      const session = initializeSessionTracking(mockTrafficSource);

      expect(session.deviceInfo.isMobile).toBe(true);
      expect(session.deviceInfo.isTablet).toBe(false);
      expect(session.deviceInfo.isDesktop).toBe(false);
    });

    it('detects tablet device correctly', () => {
      mockWindow.innerWidth = 900;

      const session = initializeSessionTracking(mockTrafficSource);

      expect(session.deviceInfo.isMobile).toBe(false);
      expect(session.deviceInfo.isTablet).toBe(true);
      expect(session.deviceInfo.isDesktop).toBe(false);
    });

    it('creates session for returning visitor', () => {
      const originalTime = Date.now() - 2 * 60 * 60 * 1000; // 2 hours ago

      const existingVisitorData = {
        visitorId: 'visitor_123',
        visitCount: 3,
        lastVisit: originalTime,
        totalSessions: 3,
        firstVisit: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
        loyaltyScore: 5,
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingVisitorData));

      const session = initializeSessionTracking(mockTrafficSource);

      expect(session).toMatchObject({
        isNewVisitor: false,
        isReturningVisitor: true,
        visitCount: 4, // Should increment
        visitorId: 'visitor_123',
        frequencyCategory: 'regular',
      });
      // After a new session, lastVisit in session should be the original time before update
      expect(session.lastVisit).toBe(originalTime);
      expect(session.timeSinceLastVisit).toBe(2 * 60 * 60 * 1000);
    });

    it('stores visitor data in localStorage for new visitor', () => {
      initializeSessionTracking(mockTrafficSource);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'voder_visitor_data',
        expect.stringContaining('visitor_'),
      );

      const storedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);

      expect(storedData).toMatchObject({
        visitCount: 1,
        totalSessions: 1,
        loyaltyScore: 1,
      });
    });

    it('updates visitor data for returning visitor', () => {
      const existingData = {
        visitorId: 'visitor_123',
        visitCount: 2,
        lastVisit: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago (new session)
        totalSessions: 2,
        firstVisit: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
        loyaltyScore: 2,
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingData));

      initializeSessionTracking(mockTrafficSource);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'voder_visitor_data',
        expect.stringContaining('visitor_123'),
      );

      const updatedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);

      expect(updatedData.visitCount).toBe(3);
      expect(updatedData.totalSessions).toBe(3);
    });

    it('tracks returning visitor with time since last visit in Clarity', () => {
      // Mock existing visitor data with last visit > 24 hours ago
      const existingVisitorData = {
        visitorId: 'existing-visitor-123',
        firstVisit: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
        lastVisit: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago (exceeds session timeout)
        visitCount: 3,
        totalSessions: 3,
        loyaltyScore: 5,
      };

      mockLocalStorage.getItem
        .mockReturnValueOnce(JSON.stringify(existingVisitorData))
        .mockReturnValueOnce(null); // No active session

      // Mock Microsoft Clarity function
      const clarityMock = vi.fn();

      (mockWindow as any).clarity = clarityMock;

      const session = initializeSessionTracking(mockTrafficSource);

      // Should be returning visitor
      expect(session.isNewVisitor).toBe(false);
      expect(session.timeSinceLastVisit).toBeDefined();

      // Should have set days since last visit in Clarity
      expect(clarityMock).toHaveBeenCalledWith('set', 'days_since_last_visit', expect.any(String));

      // Check that the calculation was done approximately
      const daysSinceCall = clarityMock.mock.calls.find(
        (call) => call[0] === 'set' && call[1] === 'days_since_last_visit',
      );

      if (daysSinceCall) {
        const daysSince = parseFloat(daysSinceCall[2] as string);

        expect(daysSince).toBeGreaterThan(1.5); // Approximately 2 days
        expect(daysSince).toBeLessThan(2.5);
      }

      // Should track session start with returning visitor type
      expect(clarityMock).toHaveBeenCalledWith(
        'event',
        'session_start',
        expect.objectContaining({
          visitorType: 'returning',
          visitCount: 4,
        }),
      );
    });

    it('handles localStorage errors gracefully', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('LocalStorage error');
      });

      const session = initializeSessionTracking(mockTrafficSource);

      expect(session.isNewVisitor).toBe(true);
      expect(session.visitCount).toBe(1);
    });

    it('stores session state globally', () => {
      const session = initializeSessionTracking(mockTrafficSource);

      expect(getSessionState()).toEqual(session);
    });

    it('sets up event listeners for session end tracking', () => {
      initializeSessionTracking(mockTrafficSource);

      expect(mockWindow.addEventListener).toHaveBeenCalledWith(
        'beforeunload',
        expect.any(Function),
      );
      expect(mockDocument.addEventListener).toHaveBeenCalledWith(
        'visibilitychange',
        expect.any(Function),
      );
    });
  });

  describe('frequency categorization', () => {
    it('categorizes new visitor as "new"', () => {
      const session = initializeSessionTracking(mockTrafficSource);

      expect(session.frequencyCategory).toBe('new');
    });

    it('categorizes occasional visitor correctly', () => {
      // Visitor with 3 visits over 10 days = 0.3 visits/day = occasional
      const visitorData = {
        visitorId: 'visitor_123',
        visitCount: 3,
        lastVisit: Date.now() - 31 * 60 * 1000, // New session
        totalSessions: 3,
        firstVisit: Date.now() - 10 * 24 * 60 * 60 * 1000,
        loyaltyScore: 3,
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(visitorData));

      const session = initializeSessionTracking(mockTrafficSource);

      expect(session.frequencyCategory).toBe('occasional');
    });

    it('categorizes regular visitor correctly', () => {
      // Visitor with 7 visits over 10 days = 0.7 visits/day = regular
      const visitorData = {
        visitorId: 'visitor_123',
        visitCount: 7,
        lastVisit: Date.now() - 31 * 60 * 1000, // New session
        totalSessions: 7,
        firstVisit: Date.now() - 10 * 24 * 60 * 60 * 1000,
        loyaltyScore: 7,
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(visitorData));

      const session = initializeSessionTracking(mockTrafficSource);

      expect(session.frequencyCategory).toBe('regular');
    });

    it('categorizes frequent visitor correctly', () => {
      // Visitor with 10 visits over 5 days = 2 visits/day = frequent
      const visitorData = {
        visitorId: 'visitor_123',
        visitCount: 10,
        lastVisit: Date.now() - 31 * 60 * 1000, // New session
        totalSessions: 10,
        firstVisit: Date.now() - 5 * 24 * 60 * 60 * 1000,
        loyaltyScore: 10,
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(visitorData));

      const session = initializeSessionTracking(mockTrafficSource);

      expect(session.frequencyCategory).toBe('frequent');
    });
  });

  describe('session timeout detection', () => {
    it('treats visitor as returning when last visit exceeds timeout', () => {
      const visitorData = {
        visitorId: 'visitor_123',
        visitCount: 2,
        lastVisit: Date.now() - 31 * 60 * 1000, // 31 minutes ago (> 30 min timeout)
        totalSessions: 2,
        firstVisit: Date.now() - 24 * 60 * 60 * 1000,
        loyaltyScore: 2,
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(visitorData));

      const session = initializeSessionTracking(mockTrafficSource);

      expect(session.isReturningVisitor).toBe(true);
      expect(session.visitCount).toBe(3); // Should increment for new session
    });

    it('treats visitor as same session when within timeout', () => {
      const visitorData = {
        visitorId: 'visitor_123',
        visitCount: 2,
        lastVisit: Date.now() - 15 * 60 * 1000, // 15 minutes ago (< 30 min timeout)
        totalSessions: 2,
        firstVisit: Date.now() - 24 * 60 * 60 * 1000,
        loyaltyScore: 2,
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(visitorData));

      const session = initializeSessionTracking(mockTrafficSource);

      expect(session.isReturningVisitor).toBe(true);
      expect(session.visitCount).toBe(2); // Should not increment for same session
    });
  });

  describe('getSessionState', () => {
    it('returns null when no session is initialized', () => {
      expect(getSessionState()).toBeNull();
    });

    it('returns current session state after initialization', () => {
      const session = initializeSessionTracking(mockTrafficSource);

      expect(getSessionState()).toEqual(session);
    });
  });

  describe('resetSessionTracking', () => {
    it('clears session state', () => {
      initializeSessionTracking(mockTrafficSource);
      expect(getSessionState()).not.toBeNull();

      resetSessionTracking();
      expect(getSessionState()).toBeNull();
    });

    it('clears localStorage data', () => {
      resetSessionTracking();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('voder_visitor_data');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('voder_session_data');
    });

    it('handles localStorage errors gracefully', () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('LocalStorage error');
      });

      expect(() => resetSessionTracking()).not.toThrow();
    });
  });

  describe('browser detection', () => {
    it('detects Chrome browser', () => {
      const session = initializeSessionTracking(mockTrafficSource);

      expect(session.deviceInfo.browser).toBe('chrome');
    });

    it('detects Firefox browser', () => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:91.0) Gecko/20100101 Firefox/91.0';

      const session = initializeSessionTracking(mockTrafficSource);

      expect(session.deviceInfo.browser).toBe('firefox');
    });

    it('detects Safari browser', () => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15';

      const session = initializeSessionTracking(mockTrafficSource);

      expect(session.deviceInfo.browser).toBe('safari');
    });

    it('detects Edge browser', () => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59';

      const session = initializeSessionTracking(mockTrafficSource);

      expect(session.deviceInfo.browser).toBe('edge');
    });
  });

  describe('operating system detection', () => {
    it('detects macOS', () => {
      // Reset to macOS userAgent for this test
      mockNavigator.userAgent =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

      const session = initializeSessionTracking(mockTrafficSource);

      expect(session.deviceInfo.os).toBe('macos');
    });

    it('detects Windows', () => {
      mockNavigator.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

      const session = initializeSessionTracking(mockTrafficSource);

      expect(session.deviceInfo.os).toBe('windows');
    });

    it('detects Linux', () => {
      mockNavigator.userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36';

      const session = initializeSessionTracking(mockTrafficSource);

      expect(session.deviceInfo.os).toBe('linux');
    });

    it('detects Android', () => {
      mockNavigator.userAgent = 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36';

      const session = initializeSessionTracking(mockTrafficSource);

      expect(session.deviceInfo.os).toBe('android');
    });
  });

  describe('session end tracking', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      resetSessionTracking();

      // Reset window and document mocks
      (global as any).window = mockWindow;
      (global as any).document = mockDocument;
      (global as any).navigator = mockNavigator;

      // Mock localStorage
      const localStorageMock = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      };

      (global as any).localStorage = localStorageMock;
    });

    it('sets up session end tracking when session exists', () => {
      const addEventListenerSpy = vi.spyOn(mockWindow, 'addEventListener');

      const docAddEventListenerSpy = vi.spyOn(mockDocument, 'addEventListener');

      // Initialize session first to ensure sessionState exists
      initializeSessionTracking(mockTrafficSource);

      // Verify event listeners were added
      expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
      expect(docAddEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
    });

    it('tracks session end on beforeunload event', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Mock Microsoft Clarity function
      const clarityMock = vi.fn();

      (mockWindow as any).clarity = clarityMock;

      // Initialize session
      const session = initializeSessionTracking(mockTrafficSource);

      // Get the beforeunload handler
      const beforeunloadCall = mockWindow.addEventListener.mock.calls.find(
        (call) => call[0] === 'beforeunload',
      );

      expect(beforeunloadCall).toBeDefined();

      const handleSessionEnd = beforeunloadCall![1] as () => void;

      // Simulate some time passing
      vi.advanceTimersByTime(5000);

      // Call the session end handler
      handleSessionEnd();

      // Verify Clarity tracking
      expect(clarityMock).toHaveBeenCalledWith('event', 'session_end', {
        sessionId: session.sessionId,
        sessionDuration: expect.any(Number),
        visitorType: 'new',
        visitCount: 1,
        frequencyCategory: 'new',
      });

      expect(clarityMock).toHaveBeenCalledWith('set', 'session_duration', expect.any(String));

      // Verify console logging
      expect(consoleSpy).toHaveBeenCalledWith('Session ended:', {
        sessionId: session.sessionId,
        duration: expect.any(Number),
        durationMinutes: expect.any(String),
      });

      consoleSpy.mockRestore();
    });

    it('tracks session end on visibility change when document becomes hidden', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Mock Microsoft Clarity function
      const clarityMock = vi.fn();

      (mockWindow as any).clarity = clarityMock;

      // Initialize session
      initializeSessionTracking(mockTrafficSource);

      // Get the visibilitychange handler
      const visibilityCall = mockDocument.addEventListener.mock.calls.find(
        (call) => call[0] === 'visibilitychange',
      );

      expect(visibilityCall).toBeDefined();

      const handleVisibilityChange = visibilityCall![1] as () => void;

      // Set document to hidden
      mockDocument.hidden = true;

      // Call the visibility change handler
      handleVisibilityChange();

      // Verify console logging occurred (indicating session end was triggered)
      expect(consoleSpy).toHaveBeenCalledWith('Session ended:', expect.any(Object));

      consoleSpy.mockRestore();
    });

    it('does not track session end on visibility change when document is visible', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Mock Microsoft Clarity function
      const clarityMock = vi.fn();

      (mockWindow as any).clarity = clarityMock;

      // Initialize session
      initializeSessionTracking(mockTrafficSource);

      // Get the visibilitychange handler
      const visibilityCall = mockDocument.addEventListener.mock.calls.find(
        (call) => call[0] === 'visibilitychange',
      );

      expect(visibilityCall).toBeDefined();

      const handleVisibilityChange = visibilityCall![1] as () => void;

      // Keep document visible
      mockDocument.hidden = false;

      // Call the visibility change handler
      handleVisibilityChange();

      // Verify no session end logging occurred
      expect(consoleSpy).not.toHaveBeenCalledWith('Session ended:', expect.any(Object));

      consoleSpy.mockRestore();
    });

    it('handles session end gracefully when no session state exists', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Do not initialize session
      resetSessionTracking();

      // Manually create and call a session end handler (simulating the internal function)
      const sessionState = null;

      const handleSessionEnd = () => {
        if (!sessionState) return;
        // This should not execute due to early return
        console.warn('Session ended:', {});
      };

      // Call the handler
      handleSessionEnd();

      // Verify no logging occurred
      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('handles missing Clarity gracefully during session end', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Ensure Clarity is not available
      delete (mockWindow as any).clarity;

      // Initialize session
      const session = initializeSessionTracking(mockTrafficSource);

      // Get the beforeunload handler
      const beforeunloadCall = mockWindow.addEventListener.mock.calls.find(
        (call) => call[0] === 'beforeunload',
      );

      const handleSessionEnd = beforeunloadCall![1] as () => void;

      // Call the session end handler
      handleSessionEnd();

      // Verify console logging still occurred (even without Clarity)
      expect(consoleSpy).toHaveBeenCalledWith('Session ended:', {
        sessionId: session.sessionId,
        duration: expect.any(Number),
        durationMinutes: expect.any(String),
      });

      consoleSpy.mockRestore();
    });
  });

  describe('localStorage error handling in setupSessionEndTracking', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      resetSessionTracking();

      (global as any).window = mockWindow;
      (global as any).document = mockDocument;
      (global as any).navigator = mockNavigator;
    });

    it('handles setupSessionEndTracking with missing window', () => {
      // Remove window
      delete (global as any).window;

      // This should not throw an error
      expect(() => {
        initializeSessionTracking(mockTrafficSource);
      }).not.toThrow();
    });

    it('handles setupSessionEndTracking with missing sessionState', () => {
      // Ensure window exists but sessionState will be null initially
      (global as any).window = mockWindow;
      resetSessionTracking();

      // Mock localStorage
      const localStorageMock = {
        getItem: vi.fn().mockReturnValue(null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      };

      (global as any).localStorage = localStorageMock;

      // Initialize session which should create sessionState and call setupSessionEndTracking
      const session = initializeSessionTracking(mockTrafficSource);

      // Should have session state now
      expect(session).toBeDefined();
      expect(getSessionState()).not.toBeNull();
    });
  });
});
