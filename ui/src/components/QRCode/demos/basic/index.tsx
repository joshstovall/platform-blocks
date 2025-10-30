import { QRCode, Column } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap={24} align="center">
      <QRCode
        value="https://platform-blocks.com"
        size={200}
      />
    </Column>
  );
}
