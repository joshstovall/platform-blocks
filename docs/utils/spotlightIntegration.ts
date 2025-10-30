// Spotlight integration with unified documentation system
// This provides search functionality across components, demos, and documentation

import React from 'react';
import { Platform, Linking } from 'react-native';
import { NAV_SECTIONS } from '../config/navigationConfig';
import {
  getAllNewComponents,
  type NewComponentIndexEntry,
  searchNewDocs
} from './newDemosLoader';
import { getCoreComponentConfig } from '../config/coreComponents';
import { GITHUB_REPO } from 'config/urls';

// Define additional interfaces for Spotlight
interface SearchResult {
  componentName: string;
  demoId?: string;
  demoTitle?: string;
  description?: string;
  content?: string;
  category?: string;
}

// Spotlight now uses internal icon names from our Icon registry
export type SpotlightIcon = string;

export interface SpotlightAction {
  id: string;
  label: string;
  description?: string;
  icon?: SpotlightIcon; // internal icon name
  keywords?: string[];
  category?: string;
  onPress?: () => void; // Updated to onPress to match React Native naming conventions
}

export interface SpotlightActionGroup {
  group: string;
  actions: SpotlightAction[];
}

// Resolve icon for a component using the core component configuration so Spotlight matches /components explorer
function resolveComponentIcon(componentName: string): SpotlightIcon {
  const cfg = getCoreComponentConfig(componentName);
  if (cfg) {
    return cfg.icon;
  }
  // Fallback generic icon
  return 'square';
}

/**
 * Convert component index to spotlight actions
 */
function createComponentActions(components: NewComponentIndexEntry[], router: any): SpotlightAction[] {
  return components.map(component => {
    const title = (component as any).title || component.name;
    const category = (component as any).category || 'component';
    return {
      id: `component-${component.name}`,
      label: title,
      description: component.description || `${category} component`,
      icon: resolveComponentIcon(component.name),
      keywords: [
        component.name.toLowerCase(),
        title.toLowerCase(),
        category,
        'component'
      ],
      category: 'Components',
      onPress: () => {
        console.log('Component action pressed:', component.name);
        router.push(`/components/${component.name}`);
      }
    };
  });
}

/**
 * Convert search index entries to spotlight actions
 */
// Legacy search removed; placeholder no-op
function createSearchActions(): SpotlightAction[] { return []; }

/**
 * Create navigation actions from NAV_SECTIONS config
 */
function createNavigationActions(router: any): SpotlightAction[] {
  const navActions: SpotlightAction[] = [];
  
  // Extract all searchable items from NAV_SECTIONS
  NAV_SECTIONS.forEach(section => {
    section.items.forEach(item => {
      if (item.searchable) {
        navActions.push({
          id: `nav-${section.section.toLowerCase().replace(/\s+/g, '-')}-${item.route.replace(/\//g, '-')}`,
          label: item.label,
          description: item.description || `Navigate to ${item.label}`,
          icon: item.icon,
          keywords: [
            item.label.toLowerCase(),
            section.section.toLowerCase(),
            ...(item.description ? item.description.toLowerCase().split(' ') : [])
          ],
          category: 'Navigation',
          onPress: () => {
            console.log('Navigation action pressed:', item.label, 'route:', item.route);
            router.push(item.route);
          }
        });
      }
    });
  });

  // Add quick actions (non-navigation items)
  navActions.push(
    {
      id: 'action-test-navigation',
      label: 'Test Navigation (Go Home)',
      description: 'Test router navigation to home',
      icon: 'home',
      keywords: ['test', 'navigate', 'home'],
      category: 'Debug',
      onPress: () => {
        console.log('Test navigation action called');
        console.log('Router object:', router);
        console.log('Attempting to navigate to /getting-started');
        router.push('/getting-started');
        console.log('router.push called');
      }
    },
    {
      id: 'action-theme-toggle',
      label: 'Toggle Color Scheme',
      description: 'Switch between light and dark mode',
      icon: 'eye',
      keywords: ['theme', 'dark', 'light', 'color', 'mode', 'toggle'],
      category: 'Quick Actions',
      onPress: () => {
        console.log('Toggle color scheme');
        // This would trigger the color scheme toggle
        // Implementation depends on theme provider setup
      }
    },
    {
      id: 'action-github',
      label: 'View on GitHub',
      description: 'Open project repository',
      icon: 'github',
      keywords: ['github', 'source', 'repository', 'code'],
      category: 'Quick Actions',
      onPress: () => {
        const url = GITHUB_REPO;
        try {
          if (Platform.OS === 'web') {
            if (typeof window !== 'undefined' && typeof (window as any).open === 'function') {
              (window as any).open(url, '_blank', 'noopener,noreferrer');
              return;
            }
          }
          // Fallback to React Native Linking (also works in web if window.open missing)
          Linking.openURL(url).catch(() => {});
        } catch (e) {
          // Swallow errors silently; optionally could surface toast
        }
      }
    }
  );

  return navActions;
}

/**
 * Hook for Spotlight integration with unified docs
 */
export function useSpotlightData(router: any) {
  
  const getSpotlightActions = React.useCallback((query: string = ''): (SpotlightAction | SpotlightActionGroup)[] => {
    console.log('getSpotlightActions called with query:', query);
    
    // Get base navigation actions
    const navActions = createNavigationActions(router);
    console.log('Created navigation actions:', navActions.length);
    
    // Get all components for component actions
  const allComponents = getAllNewComponents();
    const componentActions = createComponentActions(allComponents, router);
    console.log('Created component actions:', componentActions.length);
    
    // If no query, return basic navigation and popular components
    if (!query.trim()) {
      const popularComponents = allComponents
        .filter(comp => ['Button', 'Text', 'Card', 'Input', 'Icon'].includes(comp.name))
        .slice(0, 5);
      
      return [
        ...navActions,
        {
          group: 'Popular Components',
          actions: createComponentActions(popularComponents, router)
        }
      ];
    }
    
    // Search through documentation
    const searchResults = searchNewDocs(query);
    const searchActions: SpotlightAction[] = searchResults.map(r => ({
      id: r.id,
      label: r.title,
      description: r.description,
  icon: r.type === 'demo' ? 'code' : resolveComponentIcon(r.title.split('.')[0]),
      keywords: r.keywords,
      category: r.type === 'demo' ? 'Examples' : 'Components',
      onPress: () => {
        console.log('Search result selected:', r);
        if (r.type === 'demo') {
          const parts = r.id.replace(/^demo:/, '').split('.');
          const comp = parts[0];
          router.push(`/components/${comp}`);
        } else if (r.type === 'component') {
          const comp = r.id.replace(/^component:/, '');
          router.push(`/components/${comp}`);
        }
      }
    }));
    
    // Filter components by query
    const filteredComponents = (allComponents as any[]).filter(comp =>
      comp.name.toLowerCase().includes(query.toLowerCase()) ||
      (comp.title || '').toLowerCase().includes(query.toLowerCase()) ||
      (comp.description || '').toLowerCase().includes(query.toLowerCase()) ||
      (comp.category || '').toLowerCase().includes(query.toLowerCase())
    );
    
    const filteredComponentActions = createComponentActions(filteredComponents, router);
    
    // Filter navigation actions
    const filteredNavActions = navActions.filter(action =>
      action.label.toLowerCase().includes(query.toLowerCase()) ||
      action.description?.toLowerCase().includes(query.toLowerCase()) ||
      action.keywords?.some(keyword => keyword.includes(query.toLowerCase()))
    );

    // Separate navigation and quick actions
    const navigationActions = filteredNavActions.filter(action => action.category === 'Navigation');
    const quickActions = filteredNavActions.filter(action => action.category === 'Quick Actions');
    
    // Group results
    const results: (SpotlightAction | SpotlightActionGroup)[] = [];
    
    if (navigationActions.length > 0) {
      results.push({
        group: 'Navigation',
        actions: navigationActions
      });
    }

    if (quickActions.length > 0) {
      results.push({
        group: 'Quick Actions',
        actions: quickActions
      });
    }
    
    if (filteredComponentActions.length > 0) {
      results.push({
        group: 'Components',
        actions: filteredComponentActions.slice(0, 8) // Limit to top 8
      });
    }
    
    if (searchActions.length > 0) {
      results.push({
        group: 'Search Results',
        actions: searchActions.slice(0, 10) // Limit to top 10
      });
    }
    
    return results;
  }, [router]);
  
  return {
    getSpotlightActions
  };
}

/**
 * Get quick actions for empty state
 */
export function getQuickActions(router: any): SpotlightActionGroup[] {
  const popularComponents = (getAllNewComponents() || [])
    .filter((comp: any) => ['Button', 'Text', 'Card', 'Input', 'Icon', 'Flex', 'Dialog'].includes(comp.name))
    .slice(0, 6);
  
  const navActions = createNavigationActions(router);
  const navigationActions = navActions.filter(action => action.category === 'Navigation');
  const quickActionsList = navActions.filter(action => action.category === 'Quick Actions');
  
  return [
    {
      group: 'Navigation',
      actions: navigationActions
    },
    {
      group: 'Quick Actions',
      actions: quickActionsList
    },
    {
      group: 'Popular Components',
      actions: createComponentActions(popularComponents, router)
    }
  ];
}

/**
 * Get search suggestions based on common patterns
 */
export function getSearchSuggestions(): string[] {
  return [
    'button variants',
    'form input',
    'navigation',
    'card layout',
    'text styles',
    'icon usage',
    'dialog modal',
    'loading loader',
    'tooltip hover',
    'tabs navigation'
  ];
}
