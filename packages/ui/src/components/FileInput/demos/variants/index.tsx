import { useState } from 'react';
import { Column, FileInput, Text } from '@platform-blocks/ui';
import type { FileInputFile } from '@platform-blocks/ui';

const sizes = [
  { label: 'Small', size: 'sm' as const },
  { label: 'Medium (default)', size: 'md' as const },
  { label: 'Large', size: 'lg' as const },
];

export default function Demo() {
  const [files, setFiles] = useState<Record<string, FileInputFile[]>>({});

  const handleChange = (key: string) => (next: FileInputFile[]) => {
    setFiles((prev) => ({ ...prev, [key]: next }));
  };

  return (
    <Column gap="md" fullWidth>
      {sizes.map(({ label, size }) => (
        <Column key={label} gap="xs" fullWidth>
          <Text size="sm" weight="semibold">
            {label}
          </Text>
          <FileInput
            label={`${label} input`}
            helperText={`${label} size example`}
            onFilesChange={handleChange(label)}
            size={size}
            multiple={size === 'lg'}
            fullWidth
          />
          {files[label]?.length ? (
            <Text size="xs" colorVariant="secondary">
              Selected: {files[label].length}
            </Text>
          ) : null}
        </Column>
      ))}

      <Column gap="xs" fullWidth>
        <Text size="sm" weight="semibold">
          Custom placeholder
        </Text>
        <FileInput
          placeholder="Click to select your files"
          helperText="Demonstrates placeholder overrides"
          onFilesChange={handleChange('custom')}
          fullWidth
        />
      </Column>
    </Column>
  );
}
