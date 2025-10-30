import React, { useState } from 'react';
import {
  Text,
  Card,
  DataTable,
  Row,
  Tooltip,
  useTheme
} from '@platform-blocks/ui';
import type { DataTableColumn, DataTableSort } from '@platform-blocks/ui';

// Temporary casts to work around React 19 async FC return type (ReactNode | Promise<ReactNode>)
// causing "cannot be used as a JSX component" until global type strategy decided.
// These casts localize the workaround to this file only.
// TODO: Replace with proper React type shim or update library factory typings.
const CardAny: any = Card;
const TextAny: any = Text;
const DataTableAny: any = DataTable;
const RowAny: any = Row;
const TooltipAny: any = Tooltip;

export interface PropMetadata {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description?: string;
  deprecated?: boolean;
  internal?: boolean;
}

interface PropTableProps { props: PropMetadata[]; }

export function PropTable({ props }: PropTableProps) {
  const theme = useTheme();
  const [sortBy, setSortBy] = useState<DataTableSort[]>([]);
  const [showInternal, setShowInternal] = useState(false);

  const filtered = props.filter(p => (showInternal || !p.internal));

  if (filtered.length === 0) {
    return (
      <CardAny variant="outline" style={{ marginVertical: 16 }}>
        <TextAny variant="body" colorVariant="muted" align="center">
          This component has no props.
        </TextAny>
      </CardAny>
    );
  }

  // Define columns for DataTable
  const showDefault = filtered.some(p => p.defaultValue != null && p.defaultValue !== '');
  // Extracted component to safely use hooks per cell instance
  const PropNameCell = ({ value, row }: { value: string; row: PropMetadata }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      } catch {
        console.warn('Failed to copy to clipboard');
      }
    };
    return (
      <RowAny gap={4} align="center">
        <TextAny variant="body" weight="semibold" style={{ fontFamily: 'monospace' }}>
          {value}
        </TextAny>
        <TooltipAny label={copied ? 'Copied!' : 'Copy prop name'}>
          <TextAny
            variant="sup"
            style={{ cursor: 'pointer', color: copied ? theme.colors.primary[5] : theme.colors.gray[6], marginLeft: 4 }}
            onPress={handleCopy}
            aria-label="Copy prop name"
          >📋</TextAny>
        </TooltipAny>
        {row.required && (
          <TooltipAny label="This prop is required"><TextAny variant="sup" color='red'>*</TextAny></TooltipAny>
        )}
        {row.deprecated && (
          <TooltipAny label="Deprecated – avoid use"><TextAny variant="sup" color='orange'>D</TextAny></TooltipAny>
        )}
        {row.internal && (
          <TooltipAny label="Internal – not part of public API"><TextAny variant="sup" color='purple'>I</TextAny></TooltipAny>
        )}
      </RowAny>
    );
  };

  const columns: DataTableColumn<PropMetadata>[] = [
    {
      key: 'name',
      header: 'Name',
      accessor: 'name',
      minWidth: 120,
      sortable: true,
      filterable: true,
      filterType: 'text',
      cell: (value: string, row: PropMetadata) => <PropNameCell value={value} row={row} />,
    },
    showDefault ? {
      key: 'defaultValue',
      header: 'Default',
      accessor: 'defaultValue',
      minWidth: 100,
      sortable: true,
      align: 'center',
      cell: (value: string | undefined) => value ? (
        <TextAny
          variant="caption"
          style={{ fontFamily: 'monospace', color: theme.colors.gray[7] }}
        >
          {value}
        </TextAny>
      ) : <TextAny variant="caption" colorVariant="muted">—</TextAny>
    } : undefined,
    {
      key: 'type',
      header: 'Type',
      accessor: 'type',
      minWidth: 150,
      sortable: true,
      filterable: true,
      filterType: 'text',
      align: 'center',
      cell: (value: string) => (
        <TextAny
          variant="caption"
          style={{
            fontFamily: 'monospace',
            backgroundColor: theme.colors.gray[1],
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
            textAlign: 'center',
          }}
        >
          {value}
        </TextAny>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      accessor: 'description',
      minWidth: 200,
      filterable: true,
      filterType: 'text',
      align: 'left',
      cell: (value: string) =>
        value && (
          <TextAny variant="caption" colorVariant="secondary">
            {value}
          </TextAny>
        )
    }
  ].filter(Boolean) as DataTableColumn<PropMetadata>[];

  return (
    <DataTableAny
      data={filtered}
      columns={columns}
      sortBy={sortBy}
      onSortChange={setSortBy}
      searchable
      searchPlaceholder="Search props by name, type, or description..."
      emptyMessage="No props found"
      variant="default"
      density="normal"
      enableColumnResizing
      fullWidth={true}
      // Demonstrate per-row feature toggles:
      // - internal props remain searchable & sortable (could disable if desired)
      // - deprecated props remain visible but excluded from sorting precedence (sortable: false)
      // - required props always searchable & filterable explicitly (though defaults already true)
      rowFeatureToggle={(row: PropMetadata) => ({
        // Don't let deprecated props influence sort order (they'll be appended after sorted rows)
        sortable: !row.deprecated,
        // Keep all rows filterable so column filters still work
        filterable: true,
        // Optionally exclude internal props from global search by setting searchable: !row.internal
        searchable: true,
      })}
      style={{ width: '100%' }}
      pagination={{
        page: 1,
        pageSize: 50, // Show more props per page since they're typically not too many
        total: filtered.length,
      }}
    />
  );
}
