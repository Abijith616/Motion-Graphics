import {useCurrentFrame as useRenderFrame, useVideoConfig} from 'remotion';
import {ANIM_FPS} from './theme';

/**
 * Current time in 30-fps "animation frames" — fractional when rendering at 60 fps.
 * Scenes are timed in these units, so changing the render fps never changes animation speed,
 * it only adds in-between frames.
 */
export const useCurrentFrame = () => {
  const frame = useRenderFrame();
  const {fps} = useVideoConfig();
  return (frame * ANIM_FPS) / fps;
};

/** Seconds → render frames (for <Sequence>, audio, durations). */
export const useRenderFps = () => useVideoConfig().fps;
