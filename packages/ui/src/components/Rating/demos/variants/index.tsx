import { useState } from 'react';
import { Block, Rating } from '@platform-blocks/ui';

export default function Demo() {
  const [interactiveValue, setInteractiveValue] = useState<number>(4);

  return (
    <Block gap="lg">
      <Rating
        value={interactiveValue}
        onChange={setInteractiveValue}
        size="lg"
        label="Interactive rating"
      />
      <Rating
        value={4.5}
        readOnly
        size="lg"
        label="Read-only rating"
        disclaimer="Use `readOnly` to show aggregated scores."
      />
      <Rating
        defaultValue={3}
        showTooltip
        size="lg"
        label="Tooltip rating"
        disclaimer="Tooltips show numeric value on hover."
      />
    </Block>
  );
}


