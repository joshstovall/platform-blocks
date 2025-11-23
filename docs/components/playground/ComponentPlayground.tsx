import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import {
  Card,
  Text,
  Flex,
  Switch,
  SegmentedControl,
  Select,
  Input,
  NumberInput,
  Slider,
  Chip,
  ColorSwatch,
  Space,
  CodeBlock
} from '@platform-blocks/ui';
import * as Blocks from '@platform-blocks/ui';
import type { ComponentPlaygroundConfig, PlaygroundControlOverride, PlaygroundControlType } from './registry';

interface PropDoc {
  name: string;
  type?: string;
  description?: string;
  required?: boolean;
  defaultValue?: string;
  internal?: boolean;
}

interface ComponentPlaygroundProps {
  component: string;
  propsMeta: PropDoc[];
  config: ComponentPlaygroundConfig;
}

interface ControlDefinition {
  name: string;
  label: string;
  type?: string;
  description?: string;
  required?: boolean;
  controlType: PlaygroundControlType;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  colorPresets?: string[];
  initialValue: any;
}

const SIZE_TOKEN_OPTIONS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
const DEFAULT_COLOR_PRESETS = ['#228be6', '#845ef7', '#12b886', '#f59f00', '#e03131', '#0f172a', '#f8f9fa'];
const SPACING_PROP_NAMES = ['m', 'mx', 'my', 'mt', 'mr', 'mb', 'ml', 'p', 'px', 'py', 'pt', 'pr', 'pb', 'pl', 'gap', 'rowGap', 'columnGap'];
const CONTROL_EXCLUDED_PROPS = ['children', 'style', 'testID', 'ref', 'id', 'className', 'key', 'fullWidth'];
const GLOBAL_EXCLUDED_PROPS = new Set([...CONTROL_EXCLUDED_PROPS, ...SPACING_PROP_NAMES, 'checked', 'defaultChecked', 'activeTab', 'defaultValue']);

const TYPE_TOKEN_MAPPINGS: Record<string, string[]> = {
  SizeValue: SIZE_TOKEN_OPTIONS,
  ComponentSizeValue: SIZE_TOKEN_OPTIONS,
  ComponentSize: SIZE_TOKEN_OPTIONS
};

const DEFAULT_NUMBER_RANGE = { min: 0, max: 100, step: 1 };
const CONTROL_TYPES_WITH_FIELD_LABEL = new Set<PlaygroundControlType>([
  'boolean',
  'segmented',
  'select',
  'number',
  'size-slider',
  'color',
  'text'
]);

export function ComponentPlayground({ component, propsMeta, config }: ComponentPlaygroundProps) {
  const { width } = useWindowDimensions();
  const isStacked = width < 1100;
  const targetName = config.component || component;
  const targetComponent = Blocks[targetName as keyof typeof Blocks] as React.ComponentType | undefined;

  const { controls, defaults } = useMemo(() => deriveControls(propsMeta, config), [propsMeta, config]);
  const defaultsKey = useMemo(() => JSON.stringify(defaults), [defaults]);
  const [values, setValues] = useState<Record<string, any>>(defaults);

  useEffect(() => {
    setValues(defaults);
  }, [defaultsKey]);

  const previewProps = useMemo(() => ({ ...(config.initialProps || {}), ...values }), [config.initialProps, values]);

  const renderedComponent = useMemo(() => {
    if (!targetComponent) return null;
    try {
      const node = React.createElement(targetComponent, previewProps);
      return config.previewWrapper ? config.previewWrapper(node, previewProps) : node;
    } catch (err) {
      console.warn('[ComponentPlayground] Failed to render preview', err);
      return <Text colorVariant="error">Component threw while rendering. Check console for details.</Text>;
    }
  }, [config.previewWrapper, previewProps, targetComponent]);

  const snippet = useMemo(() => buildSnippet(targetName, previewProps), [previewProps, targetName]);

  const handlePropChange = (name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const controlsContent = controls.length ? (
    <ScrollView contentContainerStyle={styles.controlsContent} showsVerticalScrollIndicator={false}>
      {controls.map(control => {
        const usesFieldLabel = CONTROL_TYPES_WITH_FIELD_LABEL.has(control.controlType);
        const showHeader = control.required || !usesFieldLabel;
        return (
          <View key={control.name} >
            {showHeader && (
              <Flex direction="row" justify="space-between" align="center" style={styles.controlHeader}>
                <View>
                  {!usesFieldLabel && (
                    <Text variant="small" weight="semibold">{control.label}</Text>
                  )}
                </View>
                {control.required && <Chip size="xs" variant="outline">Required</Chip>}
              </Flex>
            )}
            <View style={styles.controlBody}>
              {renderControl(control, values[control.name], handlePropChange)}
            </View>
            {/* {control.description && (
              <Text variant="small" colorVariant="muted" style={styles.controlDescription}>
                {control.description}
              </Text>
            )} */}
          </View>
        );
      })}
    </ScrollView>
  ) : (
    <View style={styles.emptyState}>
      <Text variant="p" colorVariant="muted">
        No interactive props detected yet. Add doc comments in the component source to expose controls.
      </Text>
    </View>
  );

  return (
    <View style={[styles.wrapper, isStacked && styles.wrapperStack]}>
      <View style={[styles.previewColumn, isStacked && styles.fullWidth]}>
        <Card style={styles.previewCard}>
          {targetComponent ? (
            renderedComponent || (
              <Text variant="p" colorVariant="muted">
                Component rendered no output.
              </Text>
            )
          ) : (
            <Text variant="p" colorVariant="error">
              {`Component "${targetName}" is not exported from @platform-blocks/ui.`}
            </Text>
          )}
        </Card>
        <Card style={styles.snippetCard}>
          <Text variant="small" colorVariant="muted" style={styles.snippetLabel}>JSX preview</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <CodeBlock >{snippet}</CodeBlock>
          </ScrollView>
        </Card>
      </View>
      <Card style={[styles.controlsCard, isStacked && styles.fullWidth]}>
        {controlsContent}
      </Card>
    </View>
  );
}

function renderControl(
  control: ControlDefinition,
  value: any,
  onChange: (name: string, next: any) => void
): React.ReactNode {
  const commonPlaceholder = control.placeholder || `Set ${control.label.toLowerCase()}`;
  const handleChange = (nextValue: any) => onChange(control.name, nextValue);

  switch (control.controlType) {
    case 'boolean':
      return (
        <Switch
          label={control.label}
          labelPosition="right"
          checked={Boolean(value)}
          onChange={(checked: boolean) => handleChange(checked)}
          required={control.required}
          // description={control.description}
        />
      );
    case 'segmented':
      if (!control.options || !control.options.length) break;
      return (
        <SegmentedControl
          fullWidth
          label={control.label}
          // description={control.description}
          data={control.options.map(option => ({ label: formatOptionLabel(option), value: option }))}
          value={(value ?? control.options[0]) as string}
          onChange={(next: string) => handleChange(next)}
        />
      );
    case 'select':
      if (!control.options || !control.options.length) break;
      return (
        <Select
          label={control.label}
          // description={control.description}
          options={control.options.map(option => ({ label: formatOptionLabel(option), value: option }))}
          value={value ?? null}
          onChange={(next) => handleChange(next ?? undefined)}
          placeholder={commonPlaceholder}
        />
      );
    case 'number': {
      const min = control.min ?? DEFAULT_NUMBER_RANGE.min;
      const max = control.max ?? DEFAULT_NUMBER_RANGE.max;
      const step = control.step ?? DEFAULT_NUMBER_RANGE.step;
      const sliderValue = typeof value === 'number'
        ? value
        : typeof control.initialValue === 'number'
          ? control.initialValue
          : min;
      return (
        <View>
          <Slider
            label={control.label}
            // description={control.description}
            required={control.required}
            value={sliderValue}
            min={min}
            max={max}
            step={step}
            onChange={(next: number) => handleChange(next)}
          />
          <Space h="xs" />
          <NumberInput
            value={sliderValue}
            min={min}
            max={max}
            step={step}
            onChange={(next) => handleChange(typeof next === 'number' ? next : sliderValue)}
          />
        </View>
      );
    }
    case 'size-slider': {
      const tokens = (control.options && control.options.length ? control.options : SIZE_TOKEN_OPTIONS);
      const fallbackToken = (typeof control.initialValue === 'string' && tokens.includes(control.initialValue)) ? control.initialValue : tokens[0];
      const currentToken = (typeof value === 'string' && tokens.includes(value)) ? value : fallbackToken;
      const currentIndex = Math.max(0, tokens.indexOf(currentToken));
      const ticks = tokens.map((token, idx) => ({ value: idx, label: formatOptionLabel(token) }));
      return (
        <View>
          <Slider
            label={control.label}
            // description={control.description}
            required={control.required}
            value={currentIndex}
            min={0}
            max={Math.max(tokens.length - 1, 0)}
            step={1}
            ticks={ticks}
            showTicks
            restrictToTicks
            onChange={(nextIdx: number) => {
              const clamped = Math.min(tokens.length - 1, Math.max(0, Math.round(nextIdx)));
              handleChange(tokens[clamped]);
            }}
          />
          <Space h="xs" />
          {/* <Text variant="small" colorVariant="muted">
            {formatOptionLabel(currentToken)}
          </Text> */}
        </View>
      );
    }
    case 'color': {
      const presets = control.colorPresets?.length ? control.colorPresets : DEFAULT_COLOR_PRESETS;
      const currentValue = typeof value === 'string' ? value : (control.initialValue ?? presets[0]);
      return (
        <View>
          <Input
            label={control.label}
            // description={control.description}
            required={control.required}
            value={currentValue || ''}
            onChangeText={(text) => handleChange(text)}
            placeholder={commonPlaceholder}
          />
          <Flex direction="row" wrap="wrap" gap={8} style={styles.colorRow}>
            {presets.map(color => (
              <ColorSwatch
                key={`${control.name}-${color}`}
                color={color}
                selected={currentValue === color}
                onPress={() => handleChange(color)}
              />
            ))}
          </Flex>
        </View>
      );
    }
    case 'text':
    default:
      return (
        <Input
          label={control.label}
          // description={control.description}
          required={control.required}
          value={value ?? ''}
          onChangeText={(text) => handleChange(text)}
          placeholder={commonPlaceholder}
        />
      );
  }

  return (
    <Input
      label={control.label}
      // description={control.description}
      required={control.required}
      value={value ?? ''}
      onChangeText={(text) => handleChange(text)}
      placeholder={commonPlaceholder}
    />
  );
}

function deriveControls(propsMeta: PropDoc[], config: ComponentPlaygroundConfig) {
  const hiddenProps = new Set([...(config.hiddenProps || []), ...GLOBAL_EXCLUDED_PROPS]);
  const overrides = config.controlOverrides || {};

  const controls: ControlDefinition[] = [];

  for (const prop of propsMeta) {
    if (shouldSkipProp(prop, hiddenProps)) continue;
    const override = overrides[prop.name];
    if (override === false) continue;
    const control = buildControlDefinition(prop, override);
    if (control) {
      controls.push(control);
    }
  }

  const pinned = config.pinnedProps || [];
  controls.sort((a, b) => {
    const idxA = pinned.indexOf(a.name);
    const idxB = pinned.indexOf(b.name);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.name.localeCompare(b.name);
  });

  const defaults: Record<string, any> = { ...(config.initialProps || {}) };
  controls.forEach(control => {
    if (defaults[control.name] === undefined) {
      defaults[control.name] = control.initialValue;
    }
  });

  return { controls, defaults };
}

function shouldSkipProp(prop: PropDoc, hidden: Set<string>): boolean {
  if (!prop?.name) return true;
  if (hidden.has(prop.name)) return true;
  const type = prop.type || '';
  if (/^on[A-Z]/.test(prop.name)) return true;
  if (prop.internal) return true;
  if (type.includes('=>') || /function/i.test(type)) return true;
  if (/React\.ReactNode|ReactNode|ReactElement|JSX\./i.test(type)) return true;
  if (/StyleProp|ViewStyle|TextStyle/i.test(type)) return true;
  return false;
}

function buildControlDefinition(prop: PropDoc, override?: PlaygroundControlOverride): ControlDefinition | null {
  const type = prop.type || '';
  let controlType: PlaygroundControlType | undefined = override?.controlType;
  let options = override?.options;

  if (!controlType) {
    const isComponentSize = type.includes('ComponentSizeValue');
    const typeOptionKey = Object.keys(TYPE_TOKEN_MAPPINGS).find(key => type.includes(key));
    const literalOptions = options ?? extractStringLiterals(type);

    if (prop.name === 'size') {
      const candidateOptions = (literalOptions && literalOptions.length ? literalOptions : TYPE_TOKEN_MAPPINGS.ComponentSizeValue) ?? SIZE_TOKEN_OPTIONS;
      const deduped = candidateOptions.filter((option, index) => candidateOptions.indexOf(option) === index);
      options = deduped.length ? deduped : SIZE_TOKEN_OPTIONS;
      controlType = 'size-slider';
    } else if (isComponentSize) {
      options = TYPE_TOKEN_MAPPINGS.ComponentSizeValue;
      controlType = 'size-slider';
    } else if (isBooleanType(type)) {
      controlType = 'boolean';
    } else if (literalOptions && literalOptions.length) {
      options = literalOptions;
      controlType = literalOptions.length <= 4 ? 'segmented' : 'select';
    } else if (typeOptionKey) {
      options = TYPE_TOKEN_MAPPINGS[typeOptionKey];
      controlType = options.length <= 4 ? 'segmented' : 'select';
    } else if (looksLikeColor(prop.name, type)) {
      controlType = 'color';
    } else if (isNumberLike(type)) {
      controlType = 'number';
    } else {
      controlType = 'text';
    }
  } else if (!options && override?.options) {
    options = override.options;
  }

  if (prop.name === 'variant' && options && options.length) {
    controlType = 'select';
  }

  if ((controlType === 'segmented' || controlType === 'select') && (!options || !options.length)) {
    controlType = 'text';
  }

  if (prop.name === 'size' && controlType !== 'size-slider') {
    const literalSizeOptions = extractStringLiterals(type);
    const candidateOptions = options && options.length
      ? options
      : literalSizeOptions && literalSizeOptions.length
        ? literalSizeOptions
        : type.includes('ComponentSizeValue') || type.includes('ComponentSize')
          ? TYPE_TOKEN_MAPPINGS.ComponentSizeValue
          : null;

    if (candidateOptions && candidateOptions.length) {
      const deduped = candidateOptions.filter((option, index) => candidateOptions.indexOf(option) === index);
      if (deduped.length) {
        options = deduped;
        controlType = 'size-slider';
      }
    }
  }

  const initialValue = deriveInitialValue(controlType, options, prop.defaultValue, override);

  return {
    name: prop.name,
    label: formatOptionLabel(prop.name),
    type: type || undefined,
    description: prop.description || undefined,
    required: prop.required,
    controlType,
    options,
    min: override?.min,
    max: override?.max,
    step: override?.step,
    placeholder: override?.placeholder,
    colorPresets: override?.colorPresets,
    initialValue
  };
}

function deriveInitialValue(
  controlType: PlaygroundControlType,
  options: string[] | undefined,
  rawDefault: string | undefined,
  override?: PlaygroundControlOverride
) {
  if (override && override.placeholder && controlType === 'text') {
    const parsed = parseDefaultValue(rawDefault);
    return parsed ?? '';
  }

  const parsedDefault = parseDefaultValue(rawDefault);

  if (controlType === 'boolean') {
    return typeof parsedDefault === 'boolean' ? parsedDefault : false;
  }

  if ((controlType === 'segmented' || controlType === 'select') && options?.length) {
    if (parsedDefault && options.includes(String(parsedDefault))) {
      return parsedDefault;
    }
    return options[0];
  }

  if (controlType === 'number') {
    return typeof parsedDefault === 'number' ? parsedDefault : undefined;
  }

  if (controlType === 'color') {
    return typeof parsedDefault === 'string' ? parsedDefault : undefined;
  }

  return parsedDefault || '';
}

function parseDefaultValue(raw?: string): any {
  if (!raw) return undefined;
  let sanitized = raw.trim();
  if (!sanitized) return undefined;
  if (/^undefined$/i.test(sanitized)) return undefined;
  if (/^null$/i.test(sanitized)) return null;
  sanitized = sanitized.replace(/\sas\s.+$/, '');
  if (/^\[(.*)\]$/.test(sanitized) || /^{.*}$/.test(sanitized)) return undefined;
  if (/^true$/i.test(sanitized)) return true;
  if (/^false$/i.test(sanitized)) return false;
  if ((sanitized.startsWith("'") && sanitized.endsWith("'")) || (sanitized.startsWith('"') && sanitized.endsWith('"'))) {
    return sanitized.slice(1, -1);
  }
  const numeric = Number(sanitized);
  if (!Number.isNaN(numeric)) return numeric;
  return sanitized;
}

function extractStringLiterals(type: string): string[] | null {
  const matches = type.match(/'([^']+)'/g) || type.match(/"([^"]+)"/g);
  if (!matches) return null;
  const values = matches
    .map(token => token.slice(1, -1))
    .filter(Boolean);
  return values.length ? Array.from(new Set(values)) : null;
}

function looksLikeColor(name: string, type: string): boolean {
  const lowered = name.toLowerCase();
  if (lowered.includes('color')) return true;
  return /color/i.test(type);
}

function isBooleanType(type: string): boolean {
  const normalized = type.toLowerCase();
  return normalized.includes('boolean') || /^'?(true|false)'?\s*\|\s*'?(true|false)'?$/.test(normalized);
}

function isNumberLike(type: string): boolean {
  return /number/.test(type) || /(\d+\s*\|\s*)+\d+/.test(type);
}

function formatOptionLabel(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^\w/g, match => match.toUpperCase());
}

function buildSnippet(component: string, props: Record<string, any>): string {
  const entries = Object.entries(props || {}).filter(([key, val]) => val !== undefined && typeof val !== 'function');
  const attrParts = entries
    .filter(([key]) => key !== 'children')
    .map(([key, val]) => formatAttribute(key, val))
    .filter(Boolean) as string[];
  const joinedAttrs = attrParts.length ? `\n${attrParts.map(part => `  ${part}`).join('\n')}\n` : '';
  const children = props.children;
  if (typeof children === 'string' && children.length) {
    return `<${component}${joinedAttrs}>${children}</${component}>`;
  }
  if (joinedAttrs) {
    return `<${component}${joinedAttrs}/>`;
  }
  return `<${component} />`;
}

function formatAttribute(key: string, value: any): string | null {
  if (typeof value === 'boolean') {
    return value ? key : `${key}={false}`;
  }
  if (typeof value === 'number') {
    return `${key}={${value}}`;
  }
  if (typeof value === 'string') {
    const escaped = value.replace(/"/g, '\\"');
    return `${key}="${escaped}"`;
  }
  return null;
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    gap: 24
  },
  wrapperStack: {
    flexDirection: 'column'
  },
  previewColumn: {
    flex: 1,
    gap: 16
  },
  controlsCard: {
    flex: 1,
    padding: 24,
    minHeight: 320
  },
  previewCard: {
    padding: 32,
    minHeight: 280,
    alignItems: 'center',
    justifyContent: 'center'
  },
  snippetCard: {
    padding: 20
  },
  snippetLabel: {
    marginBottom: 8
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 14
  },
  controlsContent: {
    gap: 20
  },
  controlBlock: {
    // borderBottomWidth: StyleSheet.hairlineWidth,
  },
  controlHeader: {
    marginBottom: 8
  },
  controlBody: {
    gap: 12
  },
  controlDescription: {
    marginTop: 6
  },
  typeText: {
    marginTop: 2
  },
  colorRow: {
    marginTop: 8
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24
  },
  fullWidth: {
    width: '100%'
  }
});
