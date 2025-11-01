# Keyboard Management Roadmap

Holistic plan for improving keyboard behavior across Platform Blocks inputs, especially on mobile devices where focus management and viewport shifts cause user friction.

## 1. Current State Assessment
- **Audit focus flows**: Document how refs, `requestAnimationFrame`, and `InteractionManager` are used inside `AutoComplete`, `Select`, `Input`, `Form`, and related components. Note inconsistencies such as the forced refocus in `AutoComplete` multi-select mode.
- **Identify platform gaps**: Capture differences between web and native (Android/iOS) including keyboard dismissal expectations, overlay positioning, and auto-focus defaults.
- **Collect real scenarios**: Work with docs app, sample demos, and internal partner apps to list screens where the keyboard currently obscures inputs or immediately reopens after selection.

## 2. Design Goals
- **Predictable dismissal**: Selecting an option should dismiss the keyboard unless the consumer explicitly opts back into focus.
- **Shared avoidance strategy**: Inputs near the bottom of the screen stay visible when the keyboard opens via a shared layout solution (not component-by-component hacks).
- **Configurable behavior**: Provide easy escape hatches (props/hooks) so teams can opt into custom focus/keyboard patterns without forking components.

## 3. API & Architecture Proposal
1. **Keyboard Management Context**
   - `KeyboardManagerProvider` exposes `dismiss()`, `refocus(componentId)`, and keyboard height events.
   - Hook (`useKeyboardManager`) for components to access shared utilities instead of directly calling `Keyboard.dismiss`.
2. **Standard Selection Contract**
   - Introduce helper `handleSelectionComplete({ mode, preferFocus, refs })` used by AutoComplete, Select, ComboBox, etc.
   - Prop `refocusAfterSelect?: boolean` (default: `Platform.OS === 'web'` or `multiSelect`) centralizes today’s per-component logic.
3. **Unified Layout Primitives**
   - Create `KeyboardAwareLayout` component wrapping `KeyboardAvoidingView` + scroll manager (e.g., `react-native-keyboard-aware-scroll-view` or RN 0.81 `KeyboardController`).
   - Embed within docs app (`Providers.tsx`) and expose for downstream apps via `@platform-blocks/ui`.
4. **Overlay Coordination**
   - Ensure popovers/menus/portals read keyboard height from the manager so suggestion lists reposition when keyboard shows/hides.

## 4. Implementation Phases
- **Phase A – Infrastructure**
  - Ship provider + hook, implement layout primitive, add global keyboard height observer (RN `Keyboard` API / `KeyboardController`).
- **Phase B – Component Updates**
  - Refactor `AutoComplete`, `Select`, `Input` variants to use new helper/props.
  - Remove hardcoded refocus logic; respect `refocusAfterSelect` default.
  - Update docs demos to set explicit behavior for both web and native.
- **Phase C – Overlay Integration**
  - Wire `usePopoverPositioning` updates to react to keyboard height, ensuring menus avoid the keyboard.
- **Phase D – Cleanup & Telemetry**
  - Add console warnings or dev-mode logs when legacy props conflict with new behavior.
  - Offer compatibility shim (e.g., auto-detect older behavior and warn).

## 5. Testing Strategy
- **Unit & Integration**: Jest tests covering selection flows (single vs multi, web vs native) ensuring keyboard dismissal logic respects new prop defaults.
- **End-to-End**: Detox (native) and Playwright (web) scenarios: typing into inputs at bottom of screen, picking suggestions, verifying visibility.
- **Manual QA Matrix**: Document test plan by device (iPhone, iPad, Android) and orientation (portrait/landscape).

## 6. Documentation & Migration
- New “Keyboard Handling” guide covering provider setup, layout usage, and component props.
- Migration notes for apps relying on old auto-refocus behavior, including code snippets for opting back in.
- Update demos to showcase best practices (e.g., `KeyboardAwareLayout` wrapping forms and Autocomplete examples).

## 7. Rollout & Feedback
- Release behind feature flag or prerelease (`0.2.x-beta`) for partner teams.
- Gather feedback via issue template focusing on focus/dismissal behavior.
- Iterate before finalizing defaults in stable release.

## 8. Long-Term Improvements
- Evaluate adopting the new `KeyboardController` APIs (RN 0.81+) for smoother keyboard height animations.
- Consider platform-specific delegates that allow bridging native keyboard events for advanced integrations.
- Monitor React Native ecosystem (Expo Router, React Navigation) for built-in helpers we can layer on.
