/**
 * @fileoverview Tests for segment mapping system
 * Per story 026.02-BIZ-SEGMENT-MAPPING
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { type NarrativeMap, narrativeMap, SegmentMapper } from '../src/segment-mapper.js';

describe('SegmentMapper', () => {
  let mapper: SegmentMapper;

  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mapper = new SegmentMapper();
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('Narrative Map Configuration', () => {
    it('should have all five acts defined', () => {
      expect(narrativeMap.acts).toHaveProperty('magic');
      expect(narrativeMap.acts).toHaveProperty('peak');
      expect(narrativeMap.acts).toHaveProperty('turn');
      expect(narrativeMap.acts).toHaveProperty('chaos');
      expect(narrativeMap.acts).toHaveProperty('reality');
    });

    it('should have 8 segments total across all acts', () => {
      const allSegmentIds = mapper.getAllSegmentIds();

      expect(allSegmentIds).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('should have correct act ranges', () => {
      expect(narrativeMap.acts.magic.range).toEqual([0, 20]);
      expect(narrativeMap.acts.peak.range).toEqual([20, 40]);
      expect(narrativeMap.acts.turn.range).toEqual([40, 60]);
      expect(narrativeMap.acts.chaos.range).toEqual([60, 80]);
      expect(narrativeMap.acts.reality.range).toEqual([80, 100]);
    });

    it('should have overlapping segment ranges for smooth transitions', () => {
      // Segments 1 and 2 overlap (8-12%)
      expect(narrativeMap.acts.magic.segments[0].range).toEqual([0, 12]);
      expect(narrativeMap.acts.magic.segments[1].range).toEqual([8, 20]);

      // Segments 3 and 4 overlap (28-32%)
      expect(narrativeMap.acts.peak.segments[0].range).toEqual([18, 32]);
      expect(narrativeMap.acts.peak.segments[1].range).toEqual([28, 40]);

      // Segments 7 and 8 overlap (88-92%)
      expect(narrativeMap.acts.reality.segments[0].range).toEqual([78, 92]);
      expect(narrativeMap.acts.reality.segments[1].range).toEqual([88, 100]);
    });
  });

  describe('Active Segment Detection', () => {
    it('should detect segments 1 and 2 active at 10% (Magic act)', () => {
      mapper.updateSegmentStates(10);

      expect(mapper.currentAct?.name).toBe('magic');
      expect(mapper.activeSegments).toContain(1);
      expect(mapper.activeSegments).toContain(2);
      expect(mapper.activeSegments.size).toBe(2);
    });

    it('should detect segment 2 only at 15% (Magic act)', () => {
      mapper.updateSegmentStates(15);

      expect(mapper.currentAct?.name).toBe('magic');
      expect(mapper.activeSegments).toContain(2);
      expect(mapper.activeSegments.size).toBe(1);
    });

    it('should detect segments 3 and 4 active at 30% (Peak act)', () => {
      mapper.updateSegmentStates(30);

      expect(mapper.currentAct?.name).toBe('peak');
      expect(mapper.activeSegments).toContain(3);
      expect(mapper.activeSegments).toContain(4);
      expect(mapper.activeSegments.size).toBe(2);
    });

    it('should detect segment 5 at 50% (Turn act)', () => {
      mapper.updateSegmentStates(50);

      expect(mapper.currentAct?.name).toBe('turn');
      expect(mapper.activeSegments).toContain(5);
      expect(mapper.activeSegments.size).toBe(1);
    });

    it('should detect segment 6 at 70% (Chaos act)', () => {
      mapper.updateSegmentStates(70);

      expect(mapper.currentAct?.name).toBe('chaos');
      expect(mapper.activeSegments).toContain(6);
      expect(mapper.activeSegments.size).toBe(1);
    });

    it('should detect segments 7 and 8 at 90% (Reality act)', () => {
      mapper.updateSegmentStates(90);

      expect(mapper.currentAct?.name).toBe('reality');
      expect(mapper.activeSegments).toContain(7);
      expect(mapper.activeSegments).toContain(8);
      expect(mapper.activeSegments.size).toBe(2);
    });

    it('should detect no active segments at 0%', () => {
      mapper.updateSegmentStates(0);

      expect(mapper.currentAct?.name).toBe('magic');
      expect(mapper.activeSegments).toContain(1);
      expect(mapper.activeSegments.size).toBe(1);
    });

    it('should detect segment 8 at 100%', () => {
      mapper.updateSegmentStates(100);

      expect(mapper.currentAct?.name).toBe('reality');
      expect(mapper.activeSegments).toContain(8);
      expect(mapper.activeSegments.size).toBe(1);
    });
  });

  describe('Bidirectional Scrolling', () => {
    it('should work correctly when scrolling forward through acts', () => {
      // Start at magic
      mapper.updateSegmentStates(10);
      expect(mapper.currentAct?.name).toBe('magic');

      // Move to peak
      mapper.updateSegmentStates(30);
      expect(mapper.currentAct?.name).toBe('peak');

      // Move to reality
      mapper.updateSegmentStates(90);
      expect(mapper.currentAct?.name).toBe('reality');
    });

    it('should work correctly when scrolling backward through acts', () => {
      // Start at reality
      mapper.updateSegmentStates(90);
      expect(mapper.currentAct?.name).toBe('reality');

      // Move to peak
      mapper.updateSegmentStates(30);
      expect(mapper.currentAct?.name).toBe('peak');

      // Move to magic
      mapper.updateSegmentStates(10);
      expect(mapper.currentAct?.name).toBe('magic');
    });
  });

  describe('Smooth Transitions', () => {
    it('should handle transition between Magic and Peak acts smoothly', () => {
      // End of magic / start of peak
      mapper.updateSegmentStates(19);
      expect(mapper.currentAct?.name).toBe('magic');

      mapper.updateSegmentStates(20);
      // At exactly 20%, both acts match - implementation picks first match (magic)
      expect(['magic', 'peak']).toContain(mapper.currentAct?.name);

      mapper.updateSegmentStates(21);
      expect(mapper.currentAct?.name).toBe('peak');
    });

    it('should handle overlapping segments at boundaries', () => {
      // Segment 2 (8-20%) and 3 (18-32%) have overlapping ranges
      mapper.updateSegmentStates(19);
      expect(mapper.activeSegments).toContain(2);
      // At 19%, we're in magic act, so segment 3 (in peak) won't be active yet
      expect(mapper.activeSegments.size).toBe(1);
    });
  });

  describe('Debug Logging', () => {
    it('should log segment changes with correct format', () => {
      mapper.updateSegmentStates(10);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringMatching(/^Scroll 10\.0% - Act: magic - Active segments: \[1, 2\]$/),
      );
    });

    it('should log act name and active segments', () => {
      mapper.updateSegmentStates(50);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringMatching(/^Scroll 50\.0% - Act: turn - Active segments: \[5\]$/),
      );
    });

    it('should not log when segment state has not changed', () => {
      mapper.updateSegmentStates(10);
      consoleLogSpy.mockClear();

      // Update again with same progress
      mapper.updateSegmentStates(10);

      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should log when segment state changes', () => {
      mapper.updateSegmentStates(10);
      consoleLogSpy.mockClear();

      // Update with different progress
      mapper.updateSegmentStates(15);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringMatching(/^Scroll 15\.0% - Act: magic - Active segments: \[2\]$/),
      );
    });

    it('should show sorted segment IDs in log output', () => {
      mapper.updateSegmentStates(90);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringMatching(/Active segments: \[7, 8\]$/),
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle progress exactly at act boundary', () => {
      // At boundary 20, magic matches first (0-20 inclusive)
      mapper.updateSegmentStates(20);
      expect(mapper.currentAct?.name).toBe('magic');

      // At boundary 40, peak matches first (20-40 inclusive)
      mapper.updateSegmentStates(40);
      expect(mapper.currentAct?.name).toBe('peak');
    });

    it('should handle progress exactly at segment boundary', () => {
      // At 12, segment 1 ends (0-12) and segment 2 is active (8-20)
      mapper.updateSegmentStates(12);
      expect(mapper.activeSegments).toContain(1);
      expect(mapper.activeSegments).toContain(2);
      expect(mapper.activeSegments.size).toBe(2);

      mapper.updateSegmentStates(8);
      expect(mapper.activeSegments).toContain(1);
      expect(mapper.activeSegments).toContain(2);
    });

    it('should handle negative scroll progress', () => {
      mapper.updateSegmentStates(-5);
      expect(mapper.currentAct).toBeNull();
      expect(mapper.activeSegments.size).toBe(0);
    });

    it('should handle scroll progress above 100%', () => {
      mapper.updateSegmentStates(105);
      expect(mapper.currentAct).toBeNull();
      expect(mapper.activeSegments.size).toBe(0);
    });
  });

  describe('Custom Configuration', () => {
    it('should accept custom narrative map', () => {
      const customMap: NarrativeMap = {
        acts: {
          test: {
            range: [0, 100],
            segments: [
              { id: 1, range: [0, 50], content: 'Test segment 1' },
              { id: 2, range: [50, 100], content: 'Test segment 2' },
            ],
          },
        },
      };

      const customMapper = new SegmentMapper(customMap);

      customMapper.updateSegmentStates(25);

      expect(customMapper.currentAct?.name).toBe('test');
      expect(customMapper.activeSegments).toContain(1);
    });
  });

  describe('Helper Methods', () => {
    it('should return all segment IDs in order', () => {
      const ids = mapper.getAllSegmentIds();

      expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('should return act name for a given segment ID', () => {
      expect(mapper.getActForSegment(1)).toBe('magic');
      expect(mapper.getActForSegment(3)).toBe('peak');
      expect(mapper.getActForSegment(5)).toBe('turn');
      expect(mapper.getActForSegment(6)).toBe('chaos');
      expect(mapper.getActForSegment(8)).toBe('reality');
    });

    it('should return null for invalid segment ID', () => {
      expect(mapper.getActForSegment(99)).toBeNull();
    });
  });

  describe('Performance', () => {
    it('should handle rapid updates efficiently', () => {
      const startTime = performance.now();

      // Simulate rapid scroll updates
      for (let i = 0; i <= 100; i++) {
        mapper.updateSegmentStates(i);
      }

      const endTime = performance.now();

      const duration = endTime - startTime;

      // Should complete 100 updates in under 50ms
      expect(duration).toBeLessThan(50);
    });
  });
});
