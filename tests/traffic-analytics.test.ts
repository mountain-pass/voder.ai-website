/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  analyzeTrafficSource,
  categorizeTrafficSource,
  extractSourceName,
  extractUTMParams,
  isLinkedInTraffic,
  isPaidTraffic,
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
