import { StyleSheet } from 'react-native';

export const finderStyles = StyleSheet.create({
  window: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)'
  },
  titleBar: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
    backgroundColor: '#eceef1',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)'
  },
  trafficDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  layout: {
    flexDirection: 'row',
    height: 420,
    backgroundColor: '#f8f9fa'
  },
  sidebar: {
    width: 170,
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.06)',
    padding: 8,
    gap: 4,
    backgroundColor: '#f1f3f5'
  },
  sidebarSectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
    opacity: 0.6
  },
  filePane: {
    flex: 1,
    padding: 12,
    gap: 6,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 4
  },
  fileGrid: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
    gap: 2
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
    gap: 8
  },
  fileName: {
    flex: 1,
    fontSize: 13
  },
  previewPane: {
    width: 240,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0,0,0,0.06)',
    padding: 12,
    gap: 8,
    backgroundColor: '#ffffff'
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600'
  }
});
