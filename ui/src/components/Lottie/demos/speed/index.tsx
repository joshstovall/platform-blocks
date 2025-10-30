import { useState } from 'react';
import { Lottie, Text, Slider, Block } from '@platform-blocks/ui';
import file from '../../../../../../docs/assets/Blocks.lottie';

export default function Demo() {
  const [speed, setSpeed] = useState(1);
  return (
    <Block>
      <Lottie source={file} autoPlay loop speed={speed} />
      <Block direction="row" >
        <Slider label={<Text>Speed: {speed}x</Text>} value={speed} min={0.25} max={2} step={0.25} onChange={val => setSpeed(val)} fullWidth />
      </Block>
    </Block>
  );
}
