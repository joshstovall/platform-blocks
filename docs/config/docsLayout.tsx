import React from 'react';
import {
  defineAppLayout,
  type AppLayoutRuntimeContext,
} from '@platform-blocks/ui';
import { router } from 'expo-router';
import { AppHeader } from '../components/layout/Header';
import { AppNavigation } from '../components/layout/Navigation';
import { MobileBottomBar } from '../components/layout/BottomBar';
import { GlobalSpotlightLazy, FloatingActionsLazy } from '../components/layout/LazyComponents';
import { useGlobalHotkeys, useThemeMode } from '@platform-blocks/ui';
import { Footer } from '../components/layout/FooterApp';
import { DocsMobileHeader } from '../components/layout/MobileHeader';

const coerceBooleanFromQuery = (
  value: string | string[] | undefined
): boolean | undefined => {
  if (value === undefined) return undefined;
  const raw = Array.isArray(value) ? value[value.length - 1] : value;
  if (raw == null) return undefined;
  const normalized = `${raw}`.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off', 'hide', 'disabled'].includes(normalized)) return false;
  return undefined;
};

const isFullscreenExampleRoute = (ctx: AppLayoutRuntimeContext): boolean => {
  const rawPath = ctx.pathname ?? '';
  if (!rawPath) return false;
  const normalized = rawPath.replace(/^\/+/, '');
  if (!normalized.startsWith('examples')) return false;
  const segments = normalized.split('/').filter(Boolean);
  return segments.length > 1;
};

const shouldShowHeader = (ctx: AppLayoutRuntimeContext): boolean => {
  if (isFullscreenExampleRoute(ctx)) {
    return false;
  }

  const { query } = ctx;
  const direct = coerceBooleanFromQuery(query.showHeader ?? query.header);
  if (direct !== undefined) return direct;

  const hidden = coerceBooleanFromQuery(query.hideHeader);
  if (hidden !== undefined) return !hidden;

  const embed = coerceBooleanFromQuery(query.embed ?? query.embedded ?? query.fullscreen ?? query.preview);
  if (embed !== undefined) return !embed;

  if (ctx.isMobile && ctx.orientation === 'portrait') {
    return true;
  }

  return true;
};

const DocsGlobalHotkeys: React.FC = () => {
  const { cycleMode } = useThemeMode();
  useGlobalHotkeys('color-scheme-toggle', ['ctrl+j', () => cycleMode()]);
  return null;
};

const DocsFloatingActions: React.FC = () => {
  const { cycleMode } = useThemeMode();
  return <FloatingActionsLazy onToggleTheme={cycleMode} />;
};

const applyFocusOnRouteChange = (() => {
  let lastPath: string | undefined;

  return (ctx: AppLayoutRuntimeContext) => {
    if (ctx.platform !== 'web' || typeof document === 'undefined') {
      lastPath = ctx.pathname;
      return;
    }

    if (lastPath && ctx.pathname && lastPath !== ctx.pathname) {
      const el = document.getElementById('main-content');
      if (el && typeof (el as any).focus === 'function') {
        (el as HTMLElement).focus();
      }
    }

    lastPath = ctx.pathname;
  };
})();

export const docsLayout = defineAppLayout({
  id: 'docs-shell',
  breakpoints: {
    headerHeight: { base: 56, md: 60 },
    navbarWidth: { base: 220, lg: 260 },
    bottomNavHeight: 72,
    padding: { base: 0 },
  },
  layout: {
    withSafeArea: true,
    padding: { base: 0 },
  },
  main: {
    id: 'main-content',
    role: 'main',
    maxWidth: 1080,
    centerContent: true,
    props: (ctx: AppLayoutRuntimeContext) => {
      const baseProps = {
        tabIndex: -1,
        focusable: true,
        accessibilityRole: 'main',
      };

      if (isFullscreenExampleRoute(ctx)) {
        return {
          ...baseProps,
          maxWidth: '100%',
          centerContent: false,
          style: { backgroundColor: 'transparent' },
        };
      }

      return baseProps;
    },
  },
  header: {
    render: (ctx: AppLayoutRuntimeContext) => {
      if (ctx.isMobile) {
        return <DocsMobileHeader orientation={ctx.orientation} />;
      }
      return <AppHeader />;
    },
    show: shouldShowHeader,
  },
  navbar: {
    component: AppNavigation,
    show: (ctx: AppLayoutRuntimeContext) => !isFullscreenExampleRoute(ctx),
    props: (ctx: AppLayoutRuntimeContext) => ({
      onNavigate: (route: string) => {
        if (ctx.navigation?.push) {
          ctx.navigation.push(route);
        } else {
          router.push(route);
        }
      },
    }),
    width: { base: '100%', sm: '100%', md: 220, lg: 260 },
    collapsedWidth: 60,
    expandOnHover: true,
    startCollapsedDesktop: true,
  },
  bottomNav: {
    component: MobileBottomBar,
    show: (ctx: AppLayoutRuntimeContext) =>
      ctx.platform !== 'web' && !ctx.isLandscape && !isFullscreenExampleRoute(ctx),
  },
  overlays: [
    { component: DocsGlobalHotkeys },
    {
      component: GlobalSpotlightLazy,
      target: 'root',
      show: (ctx: AppLayoutRuntimeContext) => !isFullscreenExampleRoute(ctx),
    },
    {
      component: DocsFloatingActions,
      target: 'root',
      show: (ctx: AppLayoutRuntimeContext) => !isFullscreenExampleRoute(ctx),
    },
    {
      component: Footer,
      target: 'root-after',
      show: (ctx: AppLayoutRuntimeContext) =>
        ctx.platform === 'web' && !ctx.isMobile && !isFullscreenExampleRoute(ctx),
      key: 'docs-footer',
    },
  ],
  effects: [applyFocusOnRouteChange],
});

const DocsLayoutStub: React.FC = () => null;

export default DocsLayoutStub;
