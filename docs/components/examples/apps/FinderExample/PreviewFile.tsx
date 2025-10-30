import React, { useState, useEffect } from 'react';
import { View, Platform } from 'react-native';
import { Text, useTheme, Image } from '@platform-blocks/ui';
import { FinderFile } from './types';

export interface PreviewFileProps {
  file: FinderFile | undefined;
  style?: any;
}

// Basic file preview (image + video(mp4) + text/json/svg placeholder) extracted from FinderExample
export const PreviewFile: React.FC<PreviewFileProps> = ({ file, style }) => {
  const theme = useTheme();
  const isDark = theme.colorScheme === 'dark';
  const [imageError, setImageError] = useState(false);
  useEffect(() => { setImageError(false); }, [file?.id]);

  if (!file || file.type !== 'file') return null;

  const ext = file.ext || '';
  const isImage = !!file.uri && (file.mime?.startsWith('image/') || ['png','jpg','jpeg','gif','webp'].includes(ext));
  const isVideoMp4 = !!file.uri && file.mime === 'video/mp4';
  const isTextLike = ['md','txt','json'].includes(ext) && !!file.content;
  const isSvg = ext === 'svg' && !!file.content;
  const isAudio = ['mp3','wav','aiff','flac','ogg'].includes(ext);

  return (
    <View style={[{ gap: 8 }, style]}>
      {/* Image */}
      {isImage && (
        <View style={{ width: '100%', aspectRatio: 16/9, borderRadius: 8, overflow: 'hidden', backgroundColor: theme.colors.gray[isDark ? 8 : 1], alignItems: 'center', justifyContent: 'center' }}>
          {!imageError ? (
                <Image
                  src={file.uri!}
              resizeMode="cover"
              style={{ width: '100%', height: '100%' }}
              imageStyle={{ width: '100%', height: '100%' }}
              onError={() => setImageError(true)}
              accessibilityLabel={file.name}
            />
          ) : (
            <Text size="xs" color="muted" style={{ padding: 8 }}>Image failed to load</Text>
          )}
        </View>
      )}

      {/* Video MP4 */}
      {isVideoMp4 && (
        <View style={{ width: '100%', aspectRatio: 16/9, borderRadius: 8, overflow: 'hidden', backgroundColor: theme.colors.gray[isDark ? 8 : 1], alignItems: 'center', justifyContent: 'center' }}>
          {Platform.OS === 'web' ? (
            // @ts-ignore - raw video tag for web
            <video style={{ width: '100%', height: '100%', objectFit: 'cover' }} controls>
              <source src={file.uri} type={file.mime} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <Text size="xs" color="muted" style={{ padding: 8 }}>Video (mp4) preview not supported on native demo</Text>
          )}
        </View>
      )}

      {/* Text-like preview */}
      {isTextLike && (
        <View style={{ maxHeight: 140 }}>
          <Text size="xs" color="gray" style={{ fontFamily: 'monospace' }}>
            {file.content!.slice(0, 400)}{file.content!.length > 400 ? '…' : ''}
          </Text>
        </View>
      )}

      {/* SVG placeholder (not inlining raw for safety here) */}
      {isSvg && (
        <View style={{ width: 120, height: 120, alignItems: 'center', justifyContent: 'center' }}>
          <Text size="xs" color="muted">(SVG preview)</Text>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: theme.colors.primary[5] + '33' }} />
        </View>
      )}

      {/* Audio waveform placeholder */}
      {isAudio && (
        <View style={{ height: 60, justifyContent: 'center', gap: 2, flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 4 }}>
          {Array.from({ length: 32 }).map((_, i) => (
            <View key={i} style={{ width: 2, borderRadius: 1, backgroundColor: theme.colors.primary[5], height: 10 + (Math.sin(i) + 1) * 18 }} />
          ))}
        </View>
      )}

      {/* Fallback */}
      {!isImage && !isVideoMp4 && !isTextLike && !isSvg && !isAudio && (
        <Text size="xs" color="muted">No preview available</Text>
      )}
    </View>
  );
};

export default PreviewFile;
