import React, { useState } from 'react';
import { View } from 'react-native';
import { Waveform } from '../../Waveform';
import { Text } from '../../../Text';

// Sample audio peaks data
const samplePeaks = [
  0.1, 0.3, 0.7, 0.4, 0.2, 0.8, 0.6, 0.3, 0.9, 0.5,
  0.2, 0.4, 0.7, 0.8, 0.3, 0.6, 0.9, 0.4, 0.1, 0.5,
  0.7, 0.6, 0.2, 0.8, 0.4, 0.3, 0.9, 0.5, 0.1, 0.7,
  0.3, 0.8, 0.6, 0.2, 0.5, 0.9, 0.4, 0.1, 0.7, 0.3
];

export default function FullWidthWaveformDemo() {
  const [progress1, setProgress1] = useState(0.4);
  const [progress2, setProgress2] = useState(0.4);
  const [progress3, setProgress3] = useState(0.6);
  const [isDragging2, setIsDragging2] = useState(false);
  const [isDragging3, setIsDragging3] = useState(false);

  const handleDragStart2 = (position: number) => {
    setIsDragging2(true);
    setProgress2(position);
  };

  const handleDragEnd2 = (position: number) => {
    setIsDragging2(false);
    setProgress2(position);
  };

  const handleDragStart3 = (position: number) => {
    setIsDragging3(true);
    setProgress3(position);
  };

  const handleDragEnd3 = (position: number) => {
    setIsDragging3(false);
    setProgress3(position);
  };

  return (
    <View style={{ padding: 20, gap: 20 }}>
      <View>
        <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>
          Fixed Width (300px)
        </Text>
        <View style={{  padding: 10 }}>
          <Waveform
            peaks={samplePeaks}
            width={300}
            height={60}
            color="primary"
            progress={progress1}
            interactive
            onSeek={setProgress1}
           

          />
          <Text style={{ marginTop: 5, fontSize: 12 }}>
            Progress: {Math.round(progress1 * 100)}% (Click to seek)
          </Text>
        </View>
      </View>

      <View>
        <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>
          Full Width with Drag
        </Text>
        <View style={{ padding: 10 }}>
          <Waveform
            peaks={samplePeaks}
            height={60}
            color="primary"
            progress={progress2}
            fullWidth
            interactive
            onSeek={setProgress2}
            onDragStart={handleDragStart2}
            onDrag={setProgress2}
            onDragEnd={handleDragEnd2}
        showProgressLine
             showTimeStamps
              duration={180}          // 3 minutes
  timeStampInterval={30}  // Every 30 seconds
          />
          <Text style={{ marginTop: 5, fontSize: 12 }}>
            Progress: {Math.round(progress2 * 100)}% {isDragging2 ? '(Dragging)' : '(Click/Drag to seek)'}
          </Text>
        </View>
      </View>

      <View>
        <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>
          Full Width in Container with Drag
        </Text>
        <View style={{  padding: 10, width: '80%' }}>
          <Waveform
            peaks={samplePeaks}
            height={60}
            color="secondary"
            progress={progress3}
            fullWidth
            variant="rounded"
            interactive
            onSeek={setProgress3}
            onDragStart={handleDragStart3}
            onDrag={setProgress3}
            onDragEnd={handleDragEnd3}
          />
          <Text style={{ marginTop: 5, fontSize: 12 }}>
            Progress: {Math.round(progress3 * 100)}% {isDragging3 ? '(Dragging)' : '(Click/Drag to seek)'}
          </Text>
        </View>
      </View>
    </View>
  );
}