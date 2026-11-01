import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont as loadBebas} from '@remotion/google-fonts/BebasNeue';
import {loadFont as loadNunito} from '@remotion/google-fonts/Nunito';

// Self-contained channel branding: no project theme imports, so this folder can be copied into any video.
// Everything is sized from the composition width, so it works at 1920×1080, 3840×2160 or any 16:9 size.

export const wordFont = loadBebas('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;
export const tagFont = loadNunito('normal', {weights: ['800'], subsets: ['latin']}).fontFamily;

export const BRAND = {
  cyan: '#33CCFF',
  grey: '#646464',
  white: '#FFFFFF',
  paper: '#F8F8F8',
  paperEdge: '#ECECEC',
  ink: '#1C1C1C',
  black: '#050505',
};

export type BrandVariant = 'light' | 'dark';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** The NOOSPHERE wordmark: cyan N, grey (light) or white (dark) for the rest. `size` is the font size in px. */
export const Wordmark: React.FC<{variant?: BrandVariant; size?: number; style?: React.CSSProperties}> = ({variant = 'dark', size = 300, style}) => (
  <div
    style={{
      fontFamily: wordFont,
      fontSize: size,
      lineHeight: 1,
      letterSpacing: size * 0.012,
      whiteSpace: 'nowrap',
      color: variant === 'dark' ? BRAND.white : BRAND.grey,
      ...style,
    }}
  >
    <span style={{color: BRAND.cyan}}>N</span>OOSPHERE
  </div>
);

/** Full-frame background: flat paper grey ("before") or near-black radial ("after"). */
export const BrandBackground: React.FC<{variant?: BrandVariant; children?: React.ReactNode}> = ({variant = 'dark', children}) => (
  <AbsoluteFill
    style={{
      background:
        variant === 'dark'
          ? `radial-gradient(ellipse at 50% 50%, ${BRAND.ink} 0%, #0C0C0C 55%, ${BRAND.black} 100%)`
          : `radial-gradient(ellipse at 50% 50%, ${BRAND.white} 0%, ${BRAND.paper} 60%, ${BRAND.paperEdge} 100%)`,
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Optional tagline under the wordmark. */
const Tagline: React.FC<{text: string; variant: BrandVariant; size: number; o?: number; dy?: number}> = ({text, variant, size, o = 1, dy = 0}) => {
  const [before, after] = text.split(/why/i);
  return (
    <div
      style={{
        fontFamily: tagFont,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: size * 0.08,
        color: variant === 'dark' ? BRAND.white : BRAND.grey,
        opacity: o,
        position: 'absolute',
        left: 0,
        right: 0,
        top: '50%',
        textAlign: 'center',
        transform: `translateY(${size * 3.4 + dy}px)`,
      }}
    >
      {after === undefined ? (
        text
      ) : (
        <>
          {before}
          <span style={{color: BRAND.cyan}}>why</span>
          {after}
        </>
      )}
    </div>
  );
};

/** Static 16:9 logo card: replaces "Noosphere-banner Grey Before Transition.png" (light) and "Noosphere Channel Logo After Transition.png" (dark). */
export const LogoCard: React.FC<{variant?: BrandVariant; scale?: number; tagline?: string}> = ({variant = 'dark', scale = 1, tagline}) => {
  const {width} = useVideoConfig();
  const size = width * 0.19 * scale;
  return (
    <BrandBackground variant={variant}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', }}>
        <Wordmark variant={variant} size={size} />
        {tagline ? <Tagline text={tagline} variant={variant} size={size * 0.16} /> : null}
      </AbsoluteFill>
    </BrandBackground>
  );
};

export const LogoCardLight: React.FC = () => <LogoCard variant="light" />;
export const LogoCardDark: React.FC = () => <LogoCard variant="dark" />;

export type LogoTransitionProps = {
  /** Seconds before the wordmark pops in. */
  delay?: number;
  /** Seconds the light card holds before the wipe starts. */
  hold?: number;
  /** Length of the light → dark wipe, seconds. */
  wipe?: number;
  /** Tagline shown after the wipe; empty string hides it. */
  tagline?: string;
  scale?: number;
};

/** Animated channel sting: grey "before" card, circular wipe from the cyan N into the dark "after" card. */
export const LogoTransition: React.FC<LogoTransitionProps> = ({delay = 0.2, hold = 0.9, wipe = 0.8, tagline = 'The why behind everything.', scale = 1}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const sec = (s: number) => Math.round(s * fps);

  const enter = spring({frame: frame - sec(delay), fps, config: {damping: 14, mass: 0.7, stiffness: 120}});
  const wipeStart = delay + hold;
  const w = interpolate(frame, [sec(wipeStart), sec(wipeStart + wipe)], [0, 1], {...clamp, easing: Easing.bezier(0.33, 0, 0.2, 1)});
  const tag = interpolate(frame, [sec(wipeStart + wipe * 0.6), sec(wipeStart + wipe * 0.6 + 0.6)], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});

  const size = width * 0.19 * scale;
  // The wipe grows from the centre of the cyan N.
  const originX = width / 2 - size * 1.61;
  const radius = w * Math.hypot(width, height);

  const layer = (variant: BrandVariant, clip?: string) => (
    <AbsoluteFill style={{clipPath: clip}}>
      <BrandBackground variant={variant}>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', }}>
          <Wordmark variant={variant} size={size} style={{transform: `scale(${0.85 + 0.15 * enter})`, opacity: Math.min(1, enter)}} />
          {tagline ? <Tagline text={tagline} variant={variant} size={size * 0.16} o={variant === 'dark' ? tag : 0} dy={(1 - tag) * size * 0.08} /> : null}
        </AbsoluteFill>
      </BrandBackground>
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill>
      {layer('light')}
      {layer('dark', `circle(${radius}px at ${originX}px ${height / 2}px)`)}
    </AbsoluteFill>
  );
};

/** Total frames LogoTransition needs to fully play, plus a short tail. */
export const logoTransitionFrames = (fps: number, p: LogoTransitionProps = {}) =>
  Math.round(((p.delay ?? 0.2) + (p.hold ?? 0.9) + (p.wipe ?? 0.8) + 1.6) * fps);
