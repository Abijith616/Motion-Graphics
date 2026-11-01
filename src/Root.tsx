import React from 'react';
import {Composition, Folder, Still} from 'remotion';
import {DURATION_SEC, Video} from './Video';
import {LogoCardDark, LogoCardLight, LogoTransition, logoTransitionFrames} from './brand/Noosphere';
import {FPS, H, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="ScuderiaFerrari" component={Video} durationInFrames={Math.ceil(DURATION_SEC * FPS)} fps={FPS} width={W} height={H} />
    <Folder name="Brand">
      <Still id="LogoBefore" component={LogoCardLight} width={W} height={H} />
      <Still id="LogoAfter" component={LogoCardDark} width={W} height={H} />
      <Composition id="LogoTransition" component={LogoTransition} durationInFrames={logoTransitionFrames(FPS)} fps={FPS} width={W} height={H} defaultProps={{}} />
    </Folder>
  </>
);
