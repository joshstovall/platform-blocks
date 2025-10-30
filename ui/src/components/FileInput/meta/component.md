---
title: FileInput
description: A file upload component with drag-and-drop, validation, and preview capabilities
source: ui/src/components/FileInput
status: stable
category: Input
props:
  - name: onFilesChange
    type: function
    description: Callback when files are selected or removed
  - name: multiple
    type: boolean
    description: Whether to allow multiple file selection
    default: false
  - name: accept
    type: string
    description: File types to accept (MIME types)
  - name: maxSize
    type: number
    description: Maximum file size in bytes
  - name: maxFiles
    type: number
    description: Maximum number of files allowed
  - name: disabled
    type: boolean
    description: Whether the input is disabled
    default: false
  - name: label
    type: string
    description: Label for the file input
  - name: helperText
    type: string
    description: Additional help text
  - name: error
    type: string
    description: Error message to display
  - name: placeholder
    type: string
    description: Placeholder text for the dropzone
  - name: variant
    type: string
    description: Visual variant
    default: default
  - name: showPreview
    type: boolean
    description: Whether to show file previews
    default: true
examples:
  - basic
  - fileTypes
  - imagePreview
  - upload
  - validation
  - variants
---

The FileInput component provides a user-friendly interface for file uploads with drag-and-drop functionality, file validation, and preview capabilities.

## Features

- Drag-and-drop file upload
- Multiple file selection
- File type validation (MIME types)
- File size limits
- Image preview thumbnails
- Upload progress indicators
- Error handling and validation
- Custom styling variants

## Usage

```tsx
import { FileInput } from '@platform-blocks/ui';

<FileInput
  label="Upload Files"
  onFilesChange={setFiles}
  multiple
  accept="image/*"
  maxSize={5000000}
/>
```
