# Video Component

A comprehensive video player component that supports YouTube videos, MP4 files, and file buffers with advanced timeline synchronization capabilities.

## Features

### Multiple Video Sources
- **YouTube Videos**: Direct YouTube URL or video ID embedding
- **MP4/WebM Files**: Support for standard video formats via URL
- **File Buffers**: Support for ArrayBuffer or data URL sources
- **Poster Images**: Thumbnail/preview images before playback

### Advanced Controls
- **Playback Controls**: Play, pause, seek, volume, and playback speed
- **Fullscreen Support**: Native fullscreen mode with proper event handling
- **Custom Control Bars**: Configurable control visibility and auto-hide
- **Keyboard Navigation**: Standard video player keyboard shortcuts

### Timeline Synchronization
- **Event Markers**: Add time-based events for interactive experiences
- **Multiple Event Types**: Chapters, markers, annotations, cues, and custom events
- **Real-time Callbacks**: Execute functions at specific video timestamps
- **Visual Timeline**: Display event markers on the progress bar

### Cross-Platform Support
- **Web Optimized**: Full HTML5 video support with custom controls
- **YouTube Integration**: Embedded YouTube player with API control
- **React Native Ready**: Platform-specific implementations

## Use Cases

### Educational Content
```tsx
const educationalTimeline = [
  { id: 'intro', time: 0, type: 'chapter', data: { title: 'Introduction' } },
  { id: 'quiz1', time: 30, type: 'cue', callback: () => showQuiz(1) },
  { id: 'concept', time: 60, type: 'annotation', data: { info: 'Key concept explanation' } }
];
```

### Product Demonstrations
```tsx
const demoTimeline = [
  { id: 'feature1', time: 15, type: 'marker', callback: () => highlightFeature('dashboard') },
  { id: 'feature2', time: 45, type: 'marker', callback: () => highlightFeature('analytics') }
];
```

### Interactive Presentations
```tsx
const presentationTimeline = [
  { id: 'slide1', time: 0, type: 'chapter', callback: () => showSlide(1) },
  { id: 'slide2', time: 30, type: 'chapter', callback: () => showSlide(2) }
];
```

## Props

### Video Sources
- `source.url` - Direct video file URL (MP4, WebM, etc.)
- `source.youtube` - YouTube video URL or ID
- `source.buffer` - ArrayBuffer or data URL
- `source.type` - MIME type for buffer sources

### Timeline Events
- `timeline` - Array of timeline events with timestamps and callbacks
- `onTimelineEvent` - Global timeline event handler
- Event types: 'marker', 'chapter', 'annotation', 'cue', 'custom'

### Playback Configuration
- `autoPlay` - Start playing automatically (requires muted on most platforms)
- `loop` - Loop video playback
- `muted` - Start muted
- `volume` - Initial volume (0-1)
- `playbackRate` - Playback speed multiplier

### Controls & UI
- `controls` - Boolean or detailed configuration object
- `poster` - Thumbnail image URL
- `width/height` - Dimensions or aspect ratio
- YouTube-specific options for embedding customization

## Advanced Usage

### Real-time Synchronization
```tsx
const [currentMarker, setCurrentMarker] = useState(null);

const handleTimelineEvent = (event, state) => {
  setCurrentMarker(event.data.title);
  // Trigger UI updates, analytics, or external integrations
};
```

### Programmatic Control
```tsx
const videoRef = useRef();

const seekToChapter = (chapterTime) => {
  videoRef.current?.seek(chapterTime);
};

const adjustPlaybackSpeed = (rate) => {
  videoRef.current?.setPlaybackRate(rate);
};
```

### Custom Event Processing
Timeline events can trigger any custom logic:
- Update external UI components
- Show/hide overlays or tooltips  
- Send analytics events
- Trigger animations or state changes
- Display supplementary content
- Branch interactive narratives

## Platform Notes

- **YouTube**: Requires `react-native-webview` for mobile platforms
- **Native Video**: Uses HTML5 video on web, extensible for react-native-video
- **Timeline Events**: Work across all platforms with consistent API
- **Fullscreen**: Supported on web with proper keyboard handling

The Video component provides a foundation for building interactive video experiences with precise timeline control and synchronization capabilities.