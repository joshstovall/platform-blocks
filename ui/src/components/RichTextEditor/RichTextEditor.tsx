import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform, TextInput, ScrollView } from 'react-native';
import { RichTextEditorProps, RichTextEditorContent, RichTextEditorFormat, RichTextEditorSelection } from './types';
import { useTheme } from '../../core/theme';
import { Icon } from '../Icon';
import { useRichTextEditorStyles } from './styles';

// Default toolbar configuration
const DEFAULT_TOOLBAR_TOOLS = [
  'bold',
  'italic',
  'underline',
  'separator',
  'heading',
  'separator',
  'align',
  'separator',
  'list',
  'separator',
  'link',
  'separator',
  'color',
] as const;

export const RichTextEditor: React.FC<RichTextEditorProps> = React.memo(({
  defaultValue,
  value,
  onChange,
  onSelectionChange,
  onFocus,
  onBlur,
  placeholder = 'Start typing...',
  readOnly = false,
  disabled = false,
  toolbar = {
    enabled: true,
    position: 'top',
    tools: DEFAULT_TOOLBAR_TOOLS,
  },
  formats = {
    fontFamilies: ['Arial', 'Georgia', 'Times New Roman', 'Courier New'],
    fontSizes: [12, 14, 16, 18, 20, 24, 28, 32],
    colors: ['#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FF0000', '#00FF00', '#0000FF'],
    headings: [1, 2, 3, 4, 5, 6],
  },
  images = { enabled: true },
  links = { enabled: true, openInNewTab: true },
  plugins = [],
  autosave,
  spellCheck = true,
  maxLength,
  minHeight = 200,
  maxHeight = 600,
  className,
  theme: themeOverride = 'auto',
  error,
  helperText,
  style,
  ...props
}) => {
  const theme = useTheme();
  const styles = useRichTextEditorStyles();
  const [content, setContent] = useState<RichTextEditorContent>(
    value || defaultValue || { html: '', text: '' }
  );
  const [selection, setSelection] = useState<RichTextEditorSelection>({
    index: 0,
    length: 0,
  });
  const [activeFormats, setActiveFormats] = useState<RichTextEditorFormat>({});
  const [isFocused, setIsFocused] = useState(false);
  const editorRef = useRef<TextInput>(null);
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Update content when value prop changes
  useEffect(() => {
    if (value && value !== content) {
      setContent(value);
    }
  }, [value]);

  // Autosave functionality
  useEffect(() => {
    if (autosave?.enabled && autosave.onSave) {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }

      autosaveTimerRef.current = setTimeout(() => {
        autosave.onSave!(content);
      }, autosave.interval || 5000);

      return () => {
        if (autosaveTimerRef.current) {
          clearTimeout(autosaveTimerRef.current);
        }
      };
    }
  }, [content, autosave]);

  const handleContentChange = useCallback((text: string) => {
    const newContent: RichTextEditorContent = {
      text,
      html: text, // For now, treating as plain text
    };

    setContent(newContent);
    onChange?.(newContent);
  }, [onChange]);

  const handleSelectionChange = useCallback((selection: { start: number; end: number }) => {
    const newSelection: RichTextEditorSelection = {
      index: selection.start,
      length: selection.end - selection.start,
      format: activeFormats,
    };

    setSelection(newSelection);
    onSelectionChange?.(newSelection);
  }, [activeFormats, onSelectionChange]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  const applyFormat = useCallback((format: Partial<RichTextEditorFormat>) => {
    if (readOnly || disabled) return;

    const newFormats = { ...activeFormats, ...format };
    setActiveFormats(newFormats);

    // In a real implementation, this would apply formatting to the selected text
    // For this demo, we'll just track the format state
  }, [activeFormats, readOnly, disabled]);

  const toggleFormat = useCallback((formatKey: keyof RichTextEditorFormat) => {
    if (readOnly || disabled) return;

    const currentValue = activeFormats[formatKey];
    applyFormat({ [formatKey]: !currentValue });
  }, [activeFormats, applyFormat, readOnly, disabled]);

  const insertText = useCallback((text: string) => {
    if (readOnly || disabled) return;

    const currentText = content.text;
    const { index } = selection;
    const newText = currentText.slice(0, index) + text + currentText.slice(index);

    handleContentChange(newText);
  }, [content.text, selection, handleContentChange, readOnly, disabled]);

  const insertLink = useCallback(() => {
    if (!links?.enabled || readOnly || disabled) return;

    // In a real implementation, this would show a link dialog
    const url = prompt('Enter URL:');
    if (url && (!links.validate || links.validate(url))) {
      applyFormat({ link: url });
    }
  }, [links, applyFormat, readOnly, disabled]);

  const insertImage = useCallback(async () => {
    if (!images?.enabled || readOnly || disabled) return;

    // In a real implementation, this would show a file picker
    // For now, we'll just insert a placeholder
    insertText('[Image]');
  }, [images, insertText, readOnly, disabled]);

  const setHeading = useCallback((level: 1 | 2 | 3 | 4 | 5 | 6 | null) => {
    applyFormat({ heading: level });
  }, [applyFormat]);

  const setAlignment = useCallback((align: 'left' | 'center' | 'right' | 'justify') => {
    applyFormat({ align });
  }, [applyFormat]);

  const setList = useCallback((listType: 'ordered' | 'unordered' | null) => {
    applyFormat({ list: listType });
  }, [applyFormat]);

  const getToolButtonStyle = useCallback((isActive: boolean) => [
    styles.toolButton,
    {
      backgroundColor: isActive
        ? (theme.colorScheme === 'dark' ? theme.colors.primary[7] : theme.colors.primary[1])
        : 'transparent',
      borderColor: isActive ? theme.colors.primary[4] : theme.backgrounds.border,
    },
    (disabled || readOnly) && styles.disabled,
  ], [styles.toolButton, theme, disabled, readOnly]);

  const renderToolButton = useCallback((
    tool: string,
    icon: string,
    onPress: () => void,
    isActive = false
  ) => (
    <TouchableOpacity
      key={tool}
      onPress={onPress}
      disabled={disabled || readOnly}
      style={getToolButtonStyle(isActive)}
    >
      <Icon
        name={icon as any}
        size={16}
        color={isActive ? theme.colors.primary[5] : theme.text.secondary}
      />
    </TouchableOpacity>
  ), [theme, disabled, readOnly, getToolButtonStyle]);

  const renderToolSeparator = useCallback((index: number) => (
    <View
      key={`separator-${index}`}
      style={styles.toolSeparator}
    />
  ), [styles.toolSeparator]);

  const renderToolbar = useCallback(() => {
    if (!toolbar?.enabled) return null;

    const tools = toolbar.tools || DEFAULT_TOOLBAR_TOOLS;

    return (
      <View style={styles.toolbar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.toolbarContent}
        >
          {tools.map((tool, index) => {
            if (tool === 'separator') {
              return renderToolSeparator(index);
            }

            switch (tool) {
              case 'bold':
                return renderToolButton(
                  'bold',
                  'bold',
                  () => toggleFormat('bold'),
                  !!activeFormats.bold
                );
              case 'italic':
                return renderToolButton(
                  'italic',
                  'italic',
                  () => toggleFormat('italic'),
                  !!activeFormats.italic
                );
              case 'underline':
                return renderToolButton(
                  'underline',
                  'underline',
                  () => toggleFormat('underline'),
                  !!activeFormats.underline
                );
              case 'strikethrough':
                return renderToolButton(
                  'strikethrough',
                  'strikethrough',
                  () => toggleFormat('strikethrough'),
                  !!activeFormats.strikethrough
                );
              case 'heading':
                return renderToolButton(
                  'heading',
                  'heading',
                  () => applyFormat({ heading: activeFormats.heading ? null : 2 }),
                  !!activeFormats.heading
                );
              case 'align':
                return renderToolButton(
                  'align',
                  'alignLeft', // Default to left align icon, could be dynamic based on current align
                  () => setAlignment(activeFormats.align === 'left' ? 'center' : 'left'),
                  !!activeFormats.align
                );
              case 'list':
                return renderToolButton(
                  'list',
                  'listUnordered', // Default to unordered list icon, could be dynamic
                  () => setList(activeFormats.list === 'unordered' ? 'ordered' : 'unordered'),
                  !!activeFormats.list
                );
              case 'link':
                return renderToolButton(
                  'link',
                  'link',
                  insertLink,
                  !!activeFormats.link
                );
              case 'image':
                return renderToolButton(
                  'image',
                  'image',
                  () => {}, // TODO: Implement image insertion
                  false
                );
              case 'code':
                return renderToolButton(
                  'code',
                  'code',
                  () => toggleFormat('code'),
                  !!activeFormats.code
                );
              case 'quote':
                return renderToolButton(
                  'quote',
                  'quote',
                  () => toggleFormat('quote'),
                  !!activeFormats.quote
                );
              case 'color':
                return renderToolButton(
                  'color',
                  'color',
                  () => {}, // TODO: Implement color picker
                  !!activeFormats.color
                );
              default:
                return null;
            }
          })}
        </ScrollView>
      </View>
    );
  }, [toolbar, theme, activeFormats, renderToolButton, renderToolSeparator, toggleFormat, insertLink, styles.toolbar, styles.toolbarContent]);

  const renderEditor = useCallback(() => (
    <View
      style={[
        styles.editorContainer,
        {
          borderColor: isFocused ? theme.colors.primary[5] : theme.backgrounds.border,
          minHeight,
          maxHeight,
        },
        error && { borderColor: theme.colors.error[5] },
        (disabled || readOnly) && styles.disabled,
      ]}
    >
      <TextInput
        ref={editorRef}
        value={content.text}
        onChangeText={handleContentChange}
        onSelectionChange={(event) => handleSelectionChange(event.nativeEvent.selection)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        placeholderTextColor={theme.text.muted}
        multiline
        textAlignVertical="top"
        editable={!disabled && !readOnly}
        spellCheck={spellCheck}
        maxLength={maxLength}
        style={[
          styles.textInput,
          Platform.OS === 'web' ? { outlineWidth: 0 } : null,
          {
            color: theme.text.primary,
            fontSize: activeFormats.fontSize || 16,
            fontFamily: activeFormats.fontFamily || theme.fontFamily,
            fontWeight: activeFormats.bold ? 'bold' : 'normal',
            fontStyle: activeFormats.italic ? 'italic' : 'normal',
            textDecorationLine: activeFormats.underline ? 'underline' : 'none',
            textAlign: activeFormats.align || 'left',
          },
        ]}
        {...props}
      />
    </View>
  ), [
    content.text,
    handleContentChange,
    handleSelectionChange,
    handleFocus,
    handleBlur,
    placeholder,
    disabled,
    readOnly,
    spellCheck,
    maxLength,
    isFocused,
    theme,
    minHeight,
    maxHeight,
    error,
    activeFormats,
    props,
    styles.editorContainer,
    styles.disabled,
    styles.textInput,
  ]);

  return (
    <View style={[styles.container, style]}>
      {toolbar?.position === 'top' && renderToolbar()}

      {renderEditor()}

      {toolbar?.position === 'bottom' && renderToolbar()}

      {/* Character count */}
      {maxLength && (
      <Text style={[styles.characterCount, { color: theme.text.secondary }]}>
          {content.text.length}/{maxLength}
        </Text>
      )}

      {/* Error message */}
      {error && (
      <Text style={[styles.errorText, { color: theme.colors.error[5] }]}> 
          {error}
        </Text>
      )}

      {/* Helper text */}
      {helperText && !error && (
      <Text style={[styles.helperText, { color: theme.text.secondary }]}> 
          {helperText}
        </Text>
      )}
    </View>
  );
});

RichTextEditor.displayName = 'RichTextEditor';
