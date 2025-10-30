import { Tooltip, Button, Column } from '@platform-blocks/ui';

export default function PositionsTooltipDemo() {
  return (
    <Column gap={20} align="center" style={{ padding: 40 }}>
      <Tooltip label="Top tooltip" position="top">
        <Button title="Top" variant="outline" onPress={() => {}} />
      </Tooltip>
      
      <Tooltip label="Bottom tooltip" position="bottom">
        <Button title="Bottom" variant="outline" onPress={() => {}} />
      </Tooltip>
      
      <Tooltip label="Left tooltip" position="left">
        <Button title="Left" variant="outline" onPress={() => {}} />
      </Tooltip>
      
      <Tooltip label="Right tooltip" position="right">
        <Button title="Right" variant="outline" onPress={() => {}} />
      </Tooltip>

      {/* With arrows */}
      <Tooltip label="Top with arrow" position="top" withArrow>
        <Button title="Top Arrow" variant="gradient" onPress={() => {}} />
      </Tooltip>
      
      <Tooltip label="Bottom with arrow" position="bottom" withArrow>
        <Button title="Bottom Arrow" variant="gradient" onPress={() => {}} />
      </Tooltip>
      
      <Tooltip label="Left with arrow" position="left" withArrow>
        <Button title="Left Arrow" variant="secondary" onPress={() => {}} />
      </Tooltip>
      
      <Tooltip label="Right with arrow" position="right" withArrow>
        <Button title="Right Arrow" variant="secondary" onPress={() => {}} />
      </Tooltip>
    </Column>
  );
}
