import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#E5DDD5', // WhatsApp background color
  },
  chatHeader: {
    height: 72, // Fixed height for the header
    minHeight: 72, // Ensure minimum height
    maxHeight: 72, // Prevent expansion beyond this
    padding: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    boxShadow: '0 2px 3.84px rgba(0, 0, 0, 0.25)',
    flex: 0, // Ensure it doesn't flex grow
    flexShrink: 0, // Prevent shrinking
    flexGrow: 0, // Prevent growing
    position: 'relative', // Ensure proper positioning
    zIndex: 1, // Lower z-index than sticky headers
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
    paddingBottom: 8,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-end',
    paddingHorizontal: 4,
  },
  ownMessageRow: {
    justifyContent: 'flex-end'
  },
  messageAvatar: {
    marginHorizontal: 8
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 18,
    minWidth: 60,
    position: 'relative',
    marginHorizontal: 4,
  },
  reactionChip: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 1,
    // minWidth: 32,
    height: 24
  },
  reactionChipOwn: {
    position: 'absolute',
    top: -8,
    left: -8,
    zIndex: 1,
    // minWidth: 32,
    height: 24
  },
  userName: {
    marginBottom: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  messageText: {
    lineHeight: 20,
    fontSize: 16,
  },
  messageFooter: {
    marginTop: 6,
    alignItems: 'center',
  },
  messageTime: {
    opacity: 0.7,
    fontSize: 12,
    position:'absolute',
    bottom: 4,
    right: 8
  },
  statusIcon: {
    marginLeft: 4,
    opacity: 0.8
  },
  messageInput: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 8,
    boxShadow: '0 -1px 3px rgba(0, 0, 0, 0.05)',
    elevation: 3,
  },
  textInput: {
    flex: 1
  },
  dateDivider: {
    marginVertical: 16,
    alignItems: 'center'
  },
  replyContainer: {
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  replyBorder: {
    width: 3,
    height: '100%',
    borderRadius: 1.5,
    marginRight: 8
  },
  replyContent: {
    flex: 1
  },
  replyUser: {
    marginBottom: 2,
    fontSize: 13,
    fontWeight: '600',
  },
  replyMessage: {
    opacity: 0.8,
    fontSize: 13,
  },
  stickyDateHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 1000,
    alignItems: 'center',
    overflow: 'visible',
    backgroundColor: 'transparent',
  }
});
