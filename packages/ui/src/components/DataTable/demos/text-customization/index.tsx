import { Column, DataTable, Text } from '@platform-blocks/ui';

interface Project {
  id: number;
  name: string;
  status: string;
  owner: string;
}

const data: Project[] = [
  { id: 1, name: 'Atlas redesign', status: 'shipped', owner: 'Jane' },
  { id: 2, name: 'API v2 migration', status: 'in-review', owner: 'Mark' },
  { id: 3, name: 'Onboarding flow', status: 'in-progress', owner: 'Sara' },
  { id: 4, name: 'Analytics rewrite', status: 'planning', owner: 'Lee' },
];

const columns = [
  { key: 'name', header: 'Project', accessor: 'name' as const },
  { key: 'status', header: 'Status', accessor: 'status' as const },
  { key: 'owner', header: 'Owner', accessor: 'owner' as const },
];

export default function Demo() {
  return (
    <Column gap="lg">
      <Column gap="sm">
        <Text size="sm" colorVariant="muted">Default header + cell typography</Text>
        <DataTable<Project> data={data} columns={columns} />
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          Uppercase tracked headers, monospace cells
        </Text>
        <DataTable<Project>
          data={data}
          columns={columns}
          headerTextProps={{
            uppercase: true,
            tracking: 1,
            weight: '700',
            size: 'xs',
            colorVariant: 'muted',
          }}
          cellTextProps={{ ff: 'monospace', size: 'sm' }}
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          Brand serif headers
        </Text>
        <DataTable<Project>
          data={data}
          columns={columns}
          headerTextProps={{ ff: 'Georgia, serif', size: 'md', weight: '600' }}
        />
      </Column>
    </Column>
  );
}
