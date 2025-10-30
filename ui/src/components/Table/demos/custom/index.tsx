import React from 'react';
import { Table, Text, Chip } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Table withTableBorder fullWidth>
      <Table.Caption>Manually composed table with rich cell content</Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Stack</Table.Th>
          <Table.Th align="center">Status</Table.Th>
          <Table.Th align="right">Stars</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {[
          { name: 'platform-blocks', stack: 'RN / Expo', status: 'stable', stars: 4210 },
          { name: 'ignite', stack: 'RN', status: 'active', stars: 9230 },
          { name: 'tamagui', stack: 'RN / Web', status: 'active', stars: 16000 },
          { name: 'nativewind', stack: 'RN', status: 'active', stars: 7600 },
        ].map(row => (
          <Table.Tr key={row.name}>
            <Table.Td>{row.name}</Table.Td>
            <Table.Td>{row.stack}</Table.Td>
            <Table.Td align="center">
              <Chip size="xs" color={row.status === 'stable' ? 'success' : 'primary'} variant="light">
                {row.status}
              </Chip>
            </Table.Td>
            <Table.Td align="right" widthStrategy="min-content">{row.stars.toLocaleString()}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
