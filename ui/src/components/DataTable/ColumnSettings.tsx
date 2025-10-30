import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '../Text';
import { Button } from '../Button';
import { Input } from '../Input';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { useTheme } from '../../core';
import type { DataTableColumn } from './types';

interface ColumnSettingsProps<T = any> {
  column: DataTableColumn<T>;
  onClose: () => void;
  onColumnUpdate?: (columnKey: string, updates: Partial<DataTableColumn<T>>) => void;
  onHideColumn?: (columnKey: string) => void;
  anchorRect?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export function ColumnSettings<T = any>({
  column,
  onClose,
  onColumnUpdate,
  onHideColumn,
  anchorRect
}: ColumnSettingsProps<T>) {
  const theme = useTheme();
  const [editingHeader, setEditingHeader] = useState(false);
  const [tempHeaderValue, setTempHeaderValue] = useState(
    typeof column.header === 'string' ? column.header : ''
  );

  const handleSaveHeader = () => {
    if (onColumnUpdate && tempHeaderValue.trim()) {
      onColumnUpdate(column.key, { header: tempHeaderValue.trim() });
    }
    setEditingHeader(false);
  };

  const handleCancelEdit = () => {
    setTempHeaderValue(typeof column.header === 'string' ? column.header : '');
    setEditingHeader(false);
  };

  return (
    <View
      style={{
        backgroundColor: theme.colors.surface[0],
        borderRadius: 8,
        padding: 16,
        minWidth: 280,
        maxWidth: 320,
        boxShadow: `0 4px 12px ${theme.colors.gray[9]}40`,
        elevation: 8,
        borderWidth: 1,
        borderColor: theme.colors.gray[3],
      }}
    >
      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 16 
      }}>
        <Text weight="semibold" size="md">
          Column Settings
        </Text>
        <Pressable
          onPress={onClose}
          style={{
            padding: 4,
            borderRadius: 4,
            backgroundColor: 'transparent',
          }}
        >
          <Icon name="x" size={16} color={theme.colors.gray[6]} />
        </Pressable>
      </View>

      {/* Column Info */}
      <View style={{ marginBottom: 16 }}>
        <Text size="sm" color="muted" style={{ marginBottom: 4 }}>
          Column Key
        </Text>
        <Text size="sm" weight="medium" style={{ fontFamily: 'monospace' }}>
          {column.key}
        </Text>
      </View>

      {/* Header Edit */}
      <View style={{ marginBottom: 16 }}>
        <Text size="sm" color="muted" style={{ marginBottom: 8 }}>
          Header Text
        </Text>
        {editingHeader ? (
          <Flex direction="column" gap={8}>
            <Input
              value={tempHeaderValue}
              onChangeText={setTempHeaderValue}
              placeholder="Enter header text..."
            />
            <Flex direction="row" gap={8}>
              <Button
                variant="filled"
                size="sm"
                onPress={handleSaveHeader}
                disabled={!tempHeaderValue.trim()}
              >
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onPress={handleCancelEdit}
              >
                Cancel
              </Button>
            </Flex>
          </Flex>
        ) : (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text size="sm" style={{ flex: 1, marginRight: 8 }}>
              {typeof column.header === 'string' ? column.header : column.key}
            </Text>
            <Pressable
              onPress={() => setEditingHeader(true)}
              style={{
                padding: 4,
                borderRadius: 4,
                backgroundColor: theme.colors.gray[1],
              }}
            >
              <Icon name="edit-2" size={14} color={theme.colors.gray[6]} />
            </Pressable>
          </View>
        )}
      </View>

      {/* Column Properties */}
      <View style={{ marginBottom: 16 }}>
        <Text size="sm" color="muted" style={{ marginBottom: 8 }}>
          Properties
        </Text>
        <Flex direction="column" gap={4}>
          {column.sortable && (
            <View style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              backgroundColor: theme.colors.success[1],
              borderRadius: 4,
            }}>
              <Text size="xs" color={theme.colors.success[7]}>
                Sortable
              </Text>
            </View>
          )}
          {column.filterable && (
            <View style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              backgroundColor: theme.colors.primary[1],
              borderRadius: 4,
            }}>
              <Text size="xs" color={theme.colors.primary[7]}>
                Filterable
              </Text>
            </View>
          )}
          {column.resizable && (
            <View style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              backgroundColor: theme.colors.secondary[1],
              borderRadius: 4,
            }}>
              <Text size="xs" color={theme.colors.secondary[7]}>
                Resizable
              </Text>
            </View>
          )}
          {column.editable && (
            <View style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              backgroundColor: theme.colors.warning[1],
              borderRadius: 4,
            }}>
              <Text size="xs" color={theme.colors.warning[7]}>
                Editable
              </Text>
            </View>
          )}
        </Flex>
      </View>

      {/* Actions */}
      <Flex direction="column" gap={8}>
        {onHideColumn && (
          <Button
            variant="outline"
            size="sm"
            onPress={() => {
              onHideColumn(column.key);
              onClose();
            }}
            style={{
              borderColor: theme.colors.warning[4],
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon name="eyeOff" size={14} color={theme.colors.warning[6]} />
              <Text size="sm" color={theme.colors.warning[7]}>
                Hide Column
              </Text>
            </View>
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onPress={onClose}
        >
          Close
        </Button>
      </Flex>
    </View>
  );
}