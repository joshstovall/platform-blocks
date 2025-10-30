Demonstrates the `dropzone` variant with desktop drag & drop support and a tap-to-browse fallback on native/touch platforms.

Key points:
- `variant="dropzone"` renders a large dashed area with instructions.
- Drag files over the zone (web/desktop) to highlight and drop.
- On touch/native (Platform !== web) users tap to open the picker (drag events are ignored).
- Accepts images, PDF, and plain text in this example.
- Shows a simple list of selected file names beneath the dropzone.

`enableDragDrop` defaults to `Platform.OS === 'web'` so no extra prop is required here.