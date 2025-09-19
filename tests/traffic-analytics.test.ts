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
  initializeBounceTracking,
  isLinkedInTraffic,
  isPaidTraffic,
  resetBounceTracking,
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
};

const mockDocument = {
  referrer: '',
};

// Setup global mocks
beforeEach(() => {
  vi.stubGlobal('window', mockWindow);
  vi.stubGlobal('document', mockDocument);

  // Reset values
  mockWindow.location.search = '';
  mockDocument.referrer = '';
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

  it('categorizes direct traffic for empty referrer', () => {
    const utmParams: UTMParams = {};

    expect(categorizeTrafficSource('', utmParams)).toBe('direct');
  });

  it('categorizes direct traffic for same domain referrer', () => {
    const utmParams: UTMParams = {};

    expect(categorizeTrafficSource('https://voder.ai/about', utmParams)).toBe('direct');
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
