import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, Platform } from 'react-native';
import { Text, Flex, Button, Gauge, useTheme, ToggleButton, Slider, Card, Badge, Tabs, Input, Checkbox, Select, Icon, Indicator } from '@platform-blocks/ui';
import { PageWrapper } from '@platform-blocks/docs/components/PageWrapper';

/**
 * Full Chromatic Tuner Mini-App
 * ------------------------------------------------------
 * A more feature-rich mock of a tuner workflow:
 * - Simulated pitch detection (placeholder for real mic input)
 * - Lock note & reference A4 adjust
 * - Alternate temperaments / display options (mock selects)
 * - Historical pitch presets (dropdown)
 * - Session stats (time listening, most stable note)
 * - Recording mock (captures last N detected notes & deviations)
 * - Tabbed interface: Tuner | History | Settings
 */

interface DetectedPitch { frequency: number; note: string; cents: number; }

const A4 = 440;
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function frequencyToNoteData(freq: number): DetectedPitch {
  if (!freq || freq <= 0) return { frequency: 0, note: '-', cents: 0 };
  const midi = 69 + 12 * Math.log2(freq / A4);
  const nearest = Math.round(midi);
  const cents = Math.min(50, Math.max(-50, Math.round((midi - nearest) * 100)));
  const octave = Math.floor(nearest / 12) - 1;
  const name = NOTES[(nearest % 12 + 12) % 12];
  return { frequency: freq, note: `${name}${octave}`, cents };
}

function useSimulatedPitch(active: boolean, baseFreq: number) {
  const [freq, setFreq] = useState(baseFreq);
  useEffect(() => {
    if (!active) return;
    let raf: number;
    const tick = () => {
      setFreq(prev => {
        const drift = (Math.sin(Date.now() / 600) + Math.sin(Date.now() / 1300)) * 2.2;
        const noise = (Math.random() - 0.5) * 0.9;
        return baseFreq + drift + noise;
      });
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [active, baseFreq]);
  return freq;
}

// Rolling stats & history capture
interface HistoryEntry { ts: number; note: string; cents: number; frequency: number; }

export function ChromaticTunerApp() {
  const theme = useTheme();
  const [tab, setTab] = useState('tuner');
  const [listening, setListening] = useState(false);
  const [recording, setRecording] = useState(false);
  const [targetA4, setTargetA4] = useState(440);
  const [lockNote, setLockNote] = useState(false);
  const [lockedNoteFreq, setLockedNoteFreq] = useState(440);
  const [temperament, setTemperament] = useState('equal');
  const [displayMode, setDisplayMode] = useState('cents');
  const [histPitchPreset, setHistPitchPreset] = useState('modern');
  const [showNeedleTrail, setShowNeedleTrail] = useState(true);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [stableNote, setStableNote] = useState<string | null>(null);
  const listenStartRef = useRef<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [rotated, setRotated] = useState(false);

  const simulatedFreq = useSimulatedPitch(listening, lockNote ? lockedNoteFreq : targetA4);
  const detected = useMemo(() => frequencyToNoteData(simulatedFreq), [simulatedFreq]);

  // Track elapsed listening time
  useEffect(() => {
    let t: any;
    if (listening) {
      if (!listenStartRef.current) listenStartRef.current = Date.now();
      t = setInterval(() => {
        if (listenStartRef.current) setElapsed(Math.floor((Date.now() - listenStartRef.current) / 1000));
      }, 1000);
    } else {
      listenStartRef.current = null;
      setElapsed(0);
    }
    return () => t && clearInterval(t);
  }, [listening]);

  // Build rolling history (mock) when recording
  useEffect(() => {
    if (!recording || !listening) return;
    const id = setInterval(() => {
      setHistory(h => {
        const next: HistoryEntry[] = [...h, { ts: Date.now(), note: detected.note, cents: detected.cents, frequency: detected.frequency }];
        // derive stable note (most frequent in last 60 entries)
        const recent = next.slice(-60);
        const counts: Record<string, number> = {};
        recent.forEach(r => { counts[r.note] = (counts[r.note] || 0) + 1; });
        let top: string | null = null; let max = 0;
        Object.entries(counts).forEach(([n, c]) => { if (c > max) { max = c; top = n; } });
        setStableNote(top);
        return next.slice(-300); // cap history length
      });
    }, 500);
    return () => clearInterval(id);
  }, [recording, listening, detected]);

  const handleLock = () => {
    if (!lockNote) {
      const m = 69 + 12 * Math.log2(simulatedFreq / A4);
      const n = Math.round(m);
      const freq = A4 * Math.pow(2, (n - 69) / 12);
      setLockedNoteFreq(freq);
      setLockNote(true);
    } else {
      setLockNote(false);
    }
  };

  const gaugeValue = detected.cents + 50;

  const accuracyColor = Math.abs(detected.cents) < 5
    ? (theme.colors.success?.[5] || theme.colors.primary[5])
    : Math.abs(detected.cents) < 15
      ? (theme.colors.warning?.[5] || theme.colors.primary[4])
      : theme.colors.error[5];

  const tabItems = [
    { key: 'tuner', label: 'Tuner', content: null },
    { key: 'history', label: 'History', content: null },
    { key: 'settings', label: 'Settings', content: null },
  ];

  // Panels
  const renderTunerPanel = () => (
    <Flex direction="column" gap={24}>
      <Card style={{ alignItems: 'center', gap: 24, padding: 24 }}>
        <Flex direction="row" justify="space-between" style={{ width: '100%' }}>
          <Flex direction="row" gap={12} align="center">
            <ToggleButton value="listen" selected={listening} onPress={() => setListening(l => !l)} size="sm" variant="ghost">
              <Icon name={listening ? 'pause' : 'play'} size="sm" color={listening ? theme.colors.primary[5] : theme.text.secondary} />
            </ToggleButton>
            <Button size="sm" variant={lockNote ? 'filled' : 'outline'} onPress={handleLock}>{lockNote ? 'Unlock' : 'Lock'}</Button>
            <ToggleButton value="rec" selected={recording} onPress={() => setRecording(r => !r)} size="sm" variant="ghost">
              <Icon name={recording ? 'stop' : 'record'} size="sm" color={recording ? theme.colors.error[5] : theme.text.secondary} />
            </ToggleButton>
            <ToggleButton value="rotate" selected={rotated} onPress={() => setRotated(r => !r)} size="sm" variant="ghost" aria-label="Rotate Tuner">
              <Icon name="rotate" size="sm" color={rotated ? theme.colors.primary[5] : theme.text.secondary} />
            </ToggleButton>
          </Flex>
          <Flex direction="row" gap={16} align="center">
            <Text size="xs" colorVariant="secondary">Elapsed: {elapsed}s</Text>
            {stableNote && (
              <Indicator color="primary">
                <Text size="xs" weight="medium" color="white" selectable={false}>
                  Stable: {stableNote}
                </Text>
              </Indicator>
            )}
          </Flex>
        </Flex>
        <Text size="sm" colorVariant="secondary">Detected</Text>
        <Flex direction="row" align="baseline" gap={12}>
          <Text size="xl" weight="bold" style={{ fontSize: 72, lineHeight: 80 }}>{detected.note}</Text>
          <Indicator color={Math.abs(detected.cents) < 5 ? 'success' : Math.abs(detected.cents) < 15 ? 'warning' : 'error'}>
            <Text size="xs" weight="semibold" color="white" selectable={false}>
              {detected.cents > 0 ? `+${detected.cents}` : detected.cents}¢
            </Text>
          </Indicator>
        </Flex>
        <Text size="sm" colorVariant="secondary">{detected.frequency.toFixed(2)} Hz</Text>
        <View style={{ marginTop: 8, alignSelf: 'center', ...(rotated ? { transform: [{ rotate: '90deg' }] } : null) }}>
          <Gauge
            value={gaugeValue}
            min={0}
            max={100}
            size={300}
            thickness={16}
            startAngle={210}
            endAngle={-30}
            rotationOffset={0}
            ranges={[
              { from: 0, to: 20, color: theme.colors.error[4] },
              { from: 20, to: 35, color: theme.colors.warning?.[4] || theme.colors.primary[3] },
              { from: 45, to: 55, color: theme.colors.success?.[5] || theme.colors.primary[5] },
              { from: 65, to: 80, color: theme.colors.warning?.[4] || theme.colors.primary[3] },
              { from: 80, to: 100, color: theme.colors.error[4] },
            ]}
            ticks={{ major: 5, minor: 4, color: theme.colors.gray[4], majorLength: 20, minorLength: 10 }}
            labels={{ positions: [0, 25, 50, 75, 100], formatter: v => (v - 50).toString(), offset: 32 }}
            needle={{ color: accuracyColor, width: 5, length: 0.82 }}
          />
        </View>
        <Text size="sm" weight="medium" style={{ color: accuracyColor }}>
          {Math.abs(detected.cents) < 5 ? 'Perfect' : detected.cents > 0 ? 'Sharp' : 'Flat'}
        </Text>
      </Card>

      <Card style={{ gap: 20, padding: 24 }}>
        <Text size="lg" weight="medium">Quick Controls</Text>
        <Flex direction="row" gap={32} wrap="wrap">
          <View style={{ flex: 1, minWidth: 240 }}>
            <Flex direction="row" justify="space-between" align="center" style={{ marginBottom: 8 }}>
              <Text size="sm" colorVariant="secondary">A4 Reference</Text>
              <Text size="sm" weight="medium">{targetA4} Hz</Text>
            </Flex>
            <Slider min={430} max={450} value={targetA4} onChange={setTargetA4} />
          </View>
          <View style={{ flex: 1, minWidth: 240 }}>
            <Flex direction="row" justify="space-between" align="center" style={{ marginBottom: 8 }}>
              <Text size="sm" colorVariant="secondary">Needle Trail</Text>
              <Checkbox checked={showNeedleTrail} onChange={() => setShowNeedleTrail(t => !t)} />
            </Flex>
            <Text size="xs" colorVariant="secondary">Adds a fading trail to help visualize recent movement.</Text>
          </View>
        </Flex>
        <Flex direction="row" gap={32} wrap="wrap">
          <View style={{ flex: 1, minWidth: 240 }}>
            <Text size="sm" style={{ marginBottom: 6 }} colorVariant="secondary">Temperament</Text>
            <Select options={[{ label: 'Equal Temperament', value: 'equal' }, { label: 'Just Intonation', value: 'just' }, { label: 'Pythagorean', value: 'pyth' }]} value={temperament} onChange={setTemperament} />
          </View>
          <View style={{ flex: 1, minWidth: 240 }}>
            <Text size="sm" style={{ marginBottom: 6 }} colorVariant="secondary">Display Mode</Text>
            <Select options={[{ label: 'Cents', value: 'cents' }, { label: 'Ratio', value: 'ratio' }, { label: 'Hz Delta', value: 'hz' }]} value={displayMode} onChange={setDisplayMode} />
          </View>
          <View style={{ flex: 1, minWidth: 240 }}>
            <Text size="sm" style={{ marginBottom: 6 }} colorVariant="secondary">Historical Pitch</Text>
            <Select options={[{ label: 'Modern A440', value: 'modern' }, { label: 'Baroque A415', value: 'baroque' }, { label: 'Classical A430', value: 'classical' }]} value={histPitchPreset} onChange={setHistPitchPreset} />
          </View>
        </Flex>
      </Card>
    </Flex>
  );

  const renderHistoryPanel = () => (
    <Flex direction="column" gap={24}>
      <Card style={{ padding: 24, gap: 16 }}>
        <Flex direction="row" justify="space-between" align="center">
          <Text size="lg" weight="medium">Recent Detections</Text>
          <Button size="xs" variant="ghost" onPress={() => setHistory([])}>Clear</Button>
        </Flex>
        {history.length === 0 && <Text size="sm" colorVariant="secondary">No history yet. Start recording.</Text>}
        {history.slice(-50).reverse().map(h => (
          <Flex key={h.ts} direction="row" justify="space-between" style={{ paddingVertical: 4 }}>
            <Text size="sm" style={{ width: 80 }}>{h.note}</Text>
            <Text size="sm" style={{ width: 70 }}>{h.cents > 0 ? '+' + h.cents : h.cents}¢</Text>
            <Text size="sm" style={{ width: 90 }}>{h.frequency.toFixed(2)} Hz</Text>
            <Text size="xs" colorVariant="secondary">{new Date(h.ts).toLocaleTimeString()}</Text>
          </Flex>
        ))}
      </Card>
      <Card style={{ padding: 24, gap: 12 }}>
        <Text size="lg" weight="medium">Session Stats</Text>
        <Flex direction="row" gap={32} wrap="wrap">
          <View style={{ minWidth: 140 }}>
            <Text size="xs" colorVariant="secondary">Elapsed</Text>
            <Text size="sm" weight="medium">{elapsed}s</Text>
          </View>
          <View style={{ minWidth: 140 }}>
            <Text size="xs" colorVariant="secondary">Stable Note</Text>
            <Text size="sm" weight="medium">{stableNote || '-'}</Text>
          </View>
          <View style={{ minWidth: 140 }}>
            <Text size="xs" colorVariant="secondary">Entries</Text>
            <Text size="sm" weight="medium">{history.length}</Text>
          </View>
        </Flex>
      </Card>
    </Flex>
  );

  const renderSettingsPanel = () => (
    <Flex direction="column" gap={24}>
      <Card style={{ padding: 24, gap: 20 }}>
        <Text size="lg" weight="medium">General</Text>
        <Flex direction="row" gap={32} wrap="wrap">
          <View style={{ flex: 1, minWidth: 240 }}>
            <Text size="sm" colorVariant="secondary" style={{ marginBottom: 6 }}>App Theme (mock)</Text>
            <Select options={[{ label: 'System', value: 'system' }, { label: 'Light', value: 'light' }, { label: 'Dark', value: 'dark' }]} value={'system'} onChange={() => { }} />
          </View>
          <View style={{ flex: 1, minWidth: 240 }}>
            <Text size="sm" colorVariant="secondary" style={{ marginBottom: 6 }}>Calibration Offset (cents)</Text>
            <Input placeholder="0" />
          </View>
          <View style={{ flex: 1, minWidth: 240 }}>
            <Text size="sm" colorVariant="secondary" style={{ marginBottom: 6 }}>Mic Device (mock)</Text>
            <Select options={[{ label: 'Default Mic', value: 'default' }, { label: 'Interface 1', value: 'int1' }]} value={'default'} onChange={() => { }} />
          </View>
        </Flex>
      </Card>
      <Card style={{ padding: 24, gap: 20 }}>
        <Text size="lg" weight="medium">Advanced</Text>
        <Flex direction="row" gap={32} wrap="wrap">
          <View style={{ flex: 1, minWidth: 240 }}>
            <Text size="sm" colorVariant="secondary" style={{ marginBottom: 6 }}>Smoothing</Text>
            <Select options={[{ label: 'None', value: 'none' }, { label: 'Light', value: 'light' }, { label: 'Aggressive', value: 'agg' }]} value={'light'} onChange={() => { }} />
          </View>
          <View style={{ flex: 1, minWidth: 240 }}>
            <Text size="sm" colorVariant="secondary" style={{ marginBottom: 6 }}>Detection Algorithm</Text>
            <Select options={[{ label: 'AutoCorrelation', value: 'ac' }, { label: 'YIN', value: 'yin' }, { label: 'FFT', value: 'fft' }]} value={'ac'} onChange={() => { }} />
          </View>
          <View style={{ flex: 1, minWidth: 240 }}>
            <Text size="sm" colorVariant="secondary" style={{ marginBottom: 6 }}>Latency (ms)</Text>
            <Input placeholder="~12" />
          </View>
        </Flex>
      </Card>
    </Flex>
  );

  const content = tab === 'tuner' ? renderTunerPanel() : tab === 'history' ? renderHistoryPanel() : renderSettingsPanel();

  return (
    <PageWrapper style={{ flex: 1, backgroundColor: theme.colorScheme === 'dark' ? theme.colors.surface[1] : theme.colors.surface[0] }} contentContainerStyle={{ padding: 32, gap: 32 }}>
      <Flex direction="column" gap={32} style={{ width: '100%', maxWidth: 1080, alignSelf: 'center' }}>
        <Flex direction="row" justify="space-between" align="center">
          <Flex direction="row" gap={12} align="center">
            <Icon name="tuning" size="md" color={theme.colors.primary[5]} />
            <Text size="xl" weight="bold">Chromatic Tuner Pro</Text>
          </Flex>
          <Flex direction="row" gap={12} align="center">
            <Tabs
              items={tabItems}
              activeTab={tab}
              onTabChange={setTab}
              variant="chip"
              /* contentTransition intentionally omitted here if Tabs in docs build doesn't yet expose it */
              navigationOnly
              tabGap={6}
              size="sm"
            />
          </Flex>
        </Flex>
        {content}
        <Flex direction="row" justify="space-between" align="center" style={{ marginTop: 8 }}>
          <Text size="xs" colorVariant="secondary">Simulated tuner. Integrate Web Audio + pitch detection algorithm for production.</Text>
          <Text size="xs" colorVariant="secondary">Platform: {Platform.OS}</Text>
        </Flex>
      </Flex>
    </PageWrapper>
  );
}

export default ChromaticTunerApp;
