import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, Card, Button, Input, Flex, Icon, Checkbox, useTheme } from '@platform-blocks/ui';
import { Task } from './types';
import { initialTasks } from './mockData';
import { styles } from './styles';

export function TodoExample() {
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const theme = useTheme();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return theme.colors.error[5];
      case 'medium': return theme.colors.warning[5];
      case 'low': return theme.colors.success[5];
      default: return theme.colors.gray[5];
    }
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        text: newTask,
        completed: false,
        priority: 'medium'
      }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
      <View style={styles.todoContainer}>
        <View style={styles.todoHeader}>
          <Text size="xl" weight="bold">
            Task Manager
          </Text>
          <Text color="muted">
            {tasks.filter(t => !t.completed).length} of {tasks.length} tasks remaining
          </Text>
        </View>

        <View style={styles.addTaskSection}>
          <Flex direction="row" gap={8}>
            <Input
              value={newTask}
              onChangeText={setNewTask}
              onEnter={addTask}
              placeholder="Add new task..."
              style={styles.taskInput}
            />
            <Button 
              variant="gradient" 
              title="Add" 
              onPress={addTask}
              endIcon={<Icon name="plus" size="sm" />}
            />
          </Flex>
        </View>

        <View style={styles.tasksList}>
          {tasks.map((task) => (
            <Card key={task.id} style={styles.taskCard} variant="outline">
              <Flex direction="row" align="center" gap={12}>
                <Checkbox
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  size="md"
                  label={
                    <Flex direction="row" align="center" justify="space-between" style={styles.taskContent}>
                      <Text 
                        style={[
                          styles.taskText,
                          task.completed && styles.completedTask
                        ]}
                      >
                        {task.text}
                      </Text>
                      <View style={[
                        styles.priorityBadge,
                        { backgroundColor: getPriorityColor(task.priority) }
                      ]}>
                        <Text size="xs" color="white" weight="medium">
                          {task.priority.toUpperCase()}
                        </Text>
                      </View>
                    </Flex>
                  }
                />
              </Flex>
            </Card>
          ))}
        </View>
      </View>
  );
}
