/**
 * Pacing of the scroll journey. One entry per step: how much scroll that step gets,
 * relative to the others. The important moments (parsing, catalog matching, the final
 * hand-off) get more distance than the simple ones.
 *
 * Shared by the server markup (track height) and the client timeline.
 */
export const STEP_WEIGHTS = [1.0, 1.15, 1.0, 1.5, 1.4, 1.25, 1.25, 1.0, 1.45];

/** A short hold on the last step before the pinned stage releases. */
export const HOLD = 0.4;

export const JOURNEY_LENGTH = STEP_WEIGHTS.reduce((a, b) => a + b, 0) + HOLD;

/** Start time of each step on the timeline. */
export const STEP_STARTS = STEP_WEIGHTS.map((_, i) => STEP_WEIGHTS.slice(0, i).reduce((a, b) => a + b, 0));
