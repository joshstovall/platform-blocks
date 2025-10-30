import React from 'react';
import { Lottie } from '@platform-blocks/ui';
import file from '../../../../../../docs/assets/Blocks.lottie';

export default function LottieBasicDemo() {
  return (
    <Lottie source={file} autoPlay loop />
  )
}
