/**
 * @fileoverview Segment mapping system for narrative content
 * Maps scroll progress to active narrative segments and acts
 * Per story 026.02-BIZ-SEGMENT-MAPPING
 */

/**
 * Segment configuration with ID, scroll range, and content
 */
export interface NarrativeSegment {
  id: number;
  range: [number, number]; // Start and end scroll percentages
  content: string;
}

/**
 * Act configuration with range and segments
 */
export interface NarrativeAct {
  range: [number, number]; // Start and end scroll percentages
  segments: NarrativeSegment[];
}

/**
 * Complete narrative map with all acts
 */
export interface NarrativeMap {
  acts: Record<string, NarrativeAct>;
}

/**
 * Active act with name included
 */
interface ActiveAct extends NarrativeAct {
  name: string;
}

/**
 * Narrative map configuration
 * REQ-FIVE-ACTS: Map all five narrative acts (Magic, Peak, Turn, Chaos, Reality)
 * REQ-SEGMENT-TIMING: Each segment has optimal scroll range for pacing
 * REQ-SMOOTH-BOUNDARIES: Overlapping ranges for smooth transitions between segments
 */
export const narrativeMap: NarrativeMap = {
  acts: {
    magic: {
      range: [0, 20],
      segments: [
        {
          id: 1,
          range: [0, 12],
          content: 'Remember when AI coding felt like magic?',
        },
        {
          id: 2,
          range: [8, 20],
          content: 'When shipping features was fast and exciting?',
        },
      ],
    },
    peak: {
      range: [20, 40],
      segments: [
        {
          id: 3,
          range: [18, 32],
          content: 'You showed it to your team. You posted about it.',
        },
        {
          id: 4,
          range: [28, 40],
          content: 'Features flew into production. You felt unstoppable.',
        },
      ],
    },
    turn: {
      range: [40, 60],
      segments: [{ id: 5, range: [38, 60], content: 'Then it happened...' }],
    },
    chaos: {
      range: [60, 80],
      segments: [
        {
          id: 6,
          range: [58, 80],
          content: 'Your codebase became a nightmare. Nothing works.',
        },
      ],
    },
    reality: {
      range: [80, 100],
      segments: [
        {
          id: 7,
          range: [78, 92],
          content: 'The excitement turned to dread. Magic became quicksand.',
        },
        {
          id: 8,
          range: [88, 100],
          content: "Now you're stuck cleaning up the mess...",
        },
      ],
    },
  },
};

/**
 * SegmentMapper - Maps scroll progress to active narrative segments
 * REQ-PERCENTAGE-RANGES: Each segment has defined start and end scroll percentages
 * REQ-ACTIVE-DETECTION: Calculate which segments are active at current scroll position
 * REQ-ACT-ORGANIZATION: Segments grouped by narrative acts for logical organization
 */
export class SegmentMapper {
  public activeSegments: Set<number> = new Set();
  public currentAct: ActiveAct | null = null;
  private narrativeMap: NarrativeMap;

  /**
   * Create segment mapper with narrative configuration
   * REQ-CONFIGURABLE-MAP: Segment ranges easily adjustable through configuration
   */
  constructor(narrativeMapConfig: NarrativeMap = narrativeMap) {
    this.narrativeMap = narrativeMapConfig;
  }

  /**
   * Update segment states based on scroll progress
   * REQ-STATE-TRACKING: Track current active segments and transitions
   * REQ-EFFICIENT-CALCULATION: Lightweight mapping calculations
   */
  public updateSegmentStates(scrollProgress: number): void {
    const previousActive = new Set(this.activeSegments);

    this.activeSegments.clear();

    // Find active act
    this.currentAct = this.findActiveAct(scrollProgress);

    // Find active segments
    if (this.currentAct) {
      this.currentAct.segments.forEach((segment) => {
        if (this.isSegmentActive(segment, scrollProgress)) {
          this.activeSegments.add(segment.id);
        }
      });
    }

    // Log changes
    if (!this.setsEqual(previousActive, this.activeSegments)) {
      this.logSegmentChange(scrollProgress);
    }
  }

  /**
   * Find the active act for current scroll progress
   */
  private findActiveAct(scrollProgress: number): ActiveAct | null {
    for (const [actName, act] of Object.entries(this.narrativeMap.acts)) {
      if (scrollProgress >= act.range[0] && scrollProgress <= act.range[1]) {
        return { name: actName, ...act };
      }
    }

    return null;
  }

  /**
   * Check if a segment is active at current scroll progress
   */
  private isSegmentActive(segment: NarrativeSegment, scrollProgress: number): boolean {
    return scrollProgress >= segment.range[0] && scrollProgress <= segment.range[1];
  }

  /**
   * Log segment state changes
   * REQ-DEBUG-LOGGING: Clear console output showing segment states
   */
  private logSegmentChange(scrollProgress: number): void {
    const activeIds = Array.from(this.activeSegments).sort((a, b) => a - b);

    // eslint-disable-next-line no-console -- REQ-DEBUG-LOGGING: Console output required per specification
    console.log(
      `Scroll ${scrollProgress.toFixed(1)}% - Act: ${this.currentAct?.name || 'none'} - Active segments: [${activeIds.join(', ')}]`,
    );
  }

  /**
   * Compare two sets for equality
   */
  private setsEqual(set1: Set<number>, set2: Set<number>): boolean {
    if (set1.size !== set2.size) return false;
    for (const item of set1) {
      if (!set2.has(item)) return false;
    }

    return true;
  }

  /**
   * Get all segment IDs (for testing)
   */
  public getAllSegmentIds(): number[] {
    const ids: number[] = [];

    Object.values(this.narrativeMap.acts).forEach((act) => {
      act.segments.forEach((segment) => {
        ids.push(segment.id);
      });
    });

    return ids.sort((a, b) => a - b);
  }

  /**
   * Get act name for a segment ID (for testing)
   */
  public getActForSegment(segmentId: number): string | null {
    for (const [actName, act] of Object.entries(this.narrativeMap.acts)) {
      if (act.segments.some((seg) => seg.id === segmentId)) {
        return actName;
      }
    }

    return null;
  }
}
