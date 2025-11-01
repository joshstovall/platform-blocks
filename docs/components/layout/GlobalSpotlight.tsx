import React from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Spotlight, useGlobalHotkeys, directSpotlight, useDirectSpotlightState, Icon } from '@platform-blocks/ui';
import { useSpotlightData } from '../../utils/spotlightIntegration';
import { useI18n } from '@platform-blocks/ui';

export const GlobalSpotlight: React.FC = () => {
  const router = useRouter();
  const { getSpotlightActions } = useSpotlightData(router);
  const { state, close, setQuery } = useDirectSpotlightState();
  const { t } = useI18n();
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  useGlobalHotkeys('global-spotlight-toggle', ['mod+k', () => { if (state.opened) { setQuery(''); close(); } else { directSpotlight.open(); } }]);

  const spotlightActions = React.useMemo(() => {
    const actions = getSpotlightActions(state.query);
    // console.log('Spotlight actions:', actions);
    return actions;
  }, [state.query, getSpotlightActions]);
  const flatActions = React.useMemo(() => {
    const out: any[] = [];
    spotlightActions.forEach(item => {
      if ('group' in item) out.push(...item.actions);
      else out.push(item);
    });
    // console.log('flatActions created:', out);
    return out;
  }, [spotlightActions]);

  const navigateUp = React.useCallback(() => { if (!flatActions.length) return; setSelectedIndex(i => (i <= 0 ? flatActions.length - 1 : i - 1)); }, [flatActions.length]);
  const navigateDown = React.useCallback(() => { if (!flatActions.length) return; setSelectedIndex(i => (i === -1 || i >= flatActions.length - 1 ? 0 : i + 1)); }, [flatActions.length]);
  const selectAction = React.useCallback(() => {
    console.log('=== SELECT ACTION CALLED (keyboard) ===');
    let idx = selectedIndex;
    if (idx === -1 && flatActions.length) idx = 0;
    const action = flatActions[idx];
    console.log('Selected action:', action, 'index:', idx);
    if (action) {
      console.log('Calling action.onPress');
      action.onPress?.();
      setQuery('');
      close();
    }
  }, [selectedIndex, flatActions, setQuery, close]);

  React.useEffect(() => { setSelectedIndex(-1); }, [state.query]);

  React.useEffect(() => { if (Platform.OS !== 'web') return; if (!state.opened) return; const onKeyDown = (e: KeyboardEvent) => { if ((e as any).isComposing) return; const tag = (e.target as HTMLElement)?.tagName; const isInput = tag === 'INPUT' || tag === 'TEXTAREA'; switch (e.key) { case 'ArrowDown': if (isInput) return; e.preventDefault(); navigateDown(); break; case 'ArrowUp': if (isInput) return; e.preventDefault(); navigateUp(); break; case 'Enter': e.preventDefault(); selectAction(); break; case 'Escape': e.preventDefault(); setQuery(''); close(); break; } }; window.addEventListener('keydown', onKeyDown); return () => window.removeEventListener('keydown', onKeyDown); }, [state.opened, navigateDown, navigateUp, selectAction, setQuery, close]);

  return (
    <Spotlight.Root query={state.query} onQueryChange={setQuery} opened={state.opened} onClose={() => { setQuery(''); close(); }}>
      <Spotlight.Search value={state.query} onChangeText={setQuery} placeholder={t('actions.searchPlaceholder')} onNavigateDown={navigateDown} onNavigateUp={navigateUp} onSelectAction={selectAction} onClose={() => { setQuery(''); close(); }} />
      <Spotlight.ActionsList>
        {spotlightActions.length > 0 ? (() => {
          let flatIdx = 0; return spotlightActions.map((item, groupIdx) => {
            if ('group' in item) {
              return (
                <Spotlight.ActionsGroup key={`group-${groupIdx}`} label={item.group}>
                  {item.actions.map(action => {
                    const isSelected = flatIdx === selectedIndex; flatIdx++; return (
                      <Spotlight.Action key={action.id} label={action.label} description={action.description} selected={isSelected} leftSection={action.icon ? (<Icon name={action.icon as any} size="md" />) : undefined} highlightQuery={state.query} onPress={() => {
                        console.log('=== SPOTLIGHT ACTION ONPRESS CALLED ===');
                        console.log('Action from render:', action);
                        console.log('Action onPress function:', action.onPress);
                        console.log('About to call action.onPress');
                        action.onPress?.();
                        console.log('Called action.onPress, now closing');
                        setQuery('');
                        close();
                      }} />);
                  })}
                </Spotlight.ActionsGroup>
              );
            } else {
              const isSelected = flatIdx === selectedIndex; flatIdx++; return (
                <Spotlight.Action key={item.id} label={item.label} description={item.description} selected={isSelected} leftSection={item.icon ? (<Icon name={item.icon as any} size="md" />) : undefined} highlightQuery={state.query} onPress={() => {
                  console.log('=== SPOTLIGHT ACTION ONPRESS CALLED ===');
                  console.log('Item from render:', item);
                  console.log('Item onPress function:', item.onPress);
                  console.log('About to call item.onPress');
                  item.onPress?.();
                  console.log('Called item.onPress, now closing');
                  setQuery('');
                  close();
                }} />);
            }
          });
        })() : state.query.trim() ? (<Spotlight.Empty>{t('spotlight.noResults', { query: state.query })}</Spotlight.Empty>) : null}
      </Spotlight.ActionsList>
    </Spotlight.Root>
  );
};
