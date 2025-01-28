import { BlurView as ExpoBlurView } from 'expo-blur';
import { forwardRef } from 'react';
import type { BlurViewProps } from 'expo-blur';

export default forwardRef<ExpoBlurView, BlurViewProps>((props, ref) => (
  <ExpoBlurView {...props} ref={ref} />
)); 