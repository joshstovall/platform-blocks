import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  exampleCard: {
    width: '100%',
    height: '100%',
    flex: 1,
    overflow: 'hidden'
  },
  todoContainer: {
    padding: 20,
    flex: 1
  },
  todoHeader: {
    marginBottom: 20
  },
  addTaskSection: {
    marginBottom: 20
  },
  taskInput: {
    flex: 1
  },
  tasksList: {
    gap: 8
  },
  taskCard: {
    padding: 12
  },
  checkButton: {
    width: 36,
    height: 36,
    borderRadius: 18
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  taskText: {
    flex: 1
  },
  completedTask: {
    textDecorationLine: 'line-through',
    opacity: 0.6
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 12
  }
});
