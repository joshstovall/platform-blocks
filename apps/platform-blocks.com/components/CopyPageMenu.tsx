import React, { useCallback, useMemo, useState } from 'react';
import { Linking, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import {
  Button,
  Icon,
  Menu,
  MenuDropdown,
  MenuItem,
  useToast,
} from '@platform-blocks/ui';

interface CopyPageMenuProps {
  /** CSS selector that points at the main article container */
  targetSelector?: string;
  /** Display title used for clipboard metadata and prompts */
  pageTitle: string;
  /** Optional override for the copy button size */
  size?: 'xs' | 'sm' | 'md';
  /** Optional pre-rendered markdown payload */
  markdown?: string;
}

const CHAT_GPT_BASE_URL = 'https://chatgpt.com/';
const CLAUDE_BASE_URL = 'https://claude.ai/new';
const isWeb = Platform.OS === 'web';

export const CopyPageMenu: React.FC<CopyPageMenuProps> = ({
  targetSelector = 'body',
  pageTitle,
  size = 'sm',
  markdown,
}) => {
  const toast = useToast();
  const [copying, setCopying] = useState(false);

  const buildFallbackPayload = useCallback(() => {
    if (typeof document === 'undefined') {
      return '';
    }

    const node = document.querySelector(targetSelector) ?? document.body;
    if (!node) {
      return '';
    }

    const url = typeof window !== 'undefined' ? window.location.href : '';
    const header = [pageTitle?.trim(), url].filter(Boolean).join('\n');
    const content = (node as HTMLElement).innerText?.trim() ?? '';
    return [header, content].filter(Boolean).join('\n\n').trim();
  }, [pageTitle, targetSelector]);

  const buildCopyPayload = useCallback(() => {
    if (markdown && markdown.trim()) {
      return markdown.trim();
    }
    return buildFallbackPayload();
  }, [markdown, buildFallbackPayload]);

  const handleCopy = useCallback(async () => {
    if (!isWeb) {
      toast.info?.('Copy page is only available on the web docs for now.');
      return;
    }

    const payload = buildCopyPayload();
    if (!payload) {
      toast.warning?.('Nothing to copy yet—try again after the page finishes loading.');
      return;
    }

    try {
      setCopying(true);
      await Clipboard.setStringAsync(payload);
      toast.success?.('Copied Markdown to your clipboard.');
    } catch (error) {
      console.error('[CopyPageMenu] Failed to copy page', error);
      toast.error?.('Unable to copy the page. Please try again.');
    } finally {
      setCopying(false);
    }
  }, [buildCopyPayload, toast]);

  const chatPrompt = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.href : '';
    return (
      `Help me understand the Platform Blocks documentation page "${pageTitle}".` +
      (origin ? ` Source: ${origin}.` : '') +
      ' Provide a concise summary and share common usage ideas.'
    );
  }, [pageTitle]);

  const handleOpenChatGPT = useCallback(() => {
    const url = `${CHAT_GPT_BASE_URL}?q=${encodeURIComponent(chatPrompt)}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    Linking.openURL(url).catch(() => {
      toast.error?.('Unable to launch ChatGPT right now.');
    });
  }, [chatPrompt, toast]);

  const handleOpenClaude = useCallback(() => {
    const url = `${CLAUDE_BASE_URL}?q=${encodeURIComponent(chatPrompt)}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    Linking.openURL(url).catch(() => {
      toast.error?.('Unable to launch Claude right now.');
    });
  }, [chatPrompt, toast]);

  return (
    <Menu>
      <Button
        size={size}
        variant="outline"
        startIcon={<Icon name="copy" size="sm" />}
        endIcon={<Icon name="chevron-down" size="xs" />}
        loading={copying}
      >
        Copy Page
      </Button>
      <MenuDropdown>
        <MenuItem startSection={<Icon name="copy" size="sm" />} onPress={handleCopy}>
          Copy Markdown
        </MenuItem>
        <MenuItem
          startSection={<Icon name="chat" size="sm" />}
          endSection={<Icon name="arrow-up" size="xs" />}
          onPress={handleOpenChatGPT}
        >
          Open in ChatGPT
        </MenuItem>
        <MenuItem
          startSection={<Icon name="sparkles" size="sm" />}
          endSection={<Icon name="arrow-up" size="xs" />}
          onPress={handleOpenClaude}
        >
          Open in Claude
        </MenuItem>
      </MenuDropdown>
    </Menu>
  );
};

export default CopyPageMenu;
