import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { Task, taskStore } from '../../store/taskStore';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';

export default function TaskDetails() {
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    try {
      setLoading(true);
      const tasks = await taskStore.getTasks();
      const foundTask = tasks.find(t => t.id === id);
      if (foundTask) {
        setTask(foundTask);
      } else {
        Alert.alert('Error', 'Task not found');
        router.back();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async () => {
    if (!task) return;

    try {
      const updatedTask = { ...task, completed: !task.completed };
      await taskStore.updateTask(updatedTask);
      setTask(updatedTask);
      Alert.alert('Success', 'Task status updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const deleteTask = async () => {
    if (!task) return;

    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await taskStore.deleteTask(task.id);
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!task) return null;

  return (
    <ScrollView style={styles.container}>
      <Animatable.View animation="fadeIn" duration={500}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={deleteTask}
          >
            <Ionicons name="trash-outline" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={[styles.priorityBadge, styles[task.priority]]}>
            <Text style={styles.priorityText}>{task.priority}</Text>
          </View>

          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.description}>{task.description}</Text>

          <View style={styles.metaInfo}>
            <Text style={styles.dateText}>
              Created: {new Date(task.createdAt).toLocaleDateString()}
            </Text>
            {task.dueDate && (
              <Text style={styles.dateText}>
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </Text>
            )}
          </View>

          <View style={styles.tags}>
            {task.tags?.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity 
            style={[styles.completeButton, task.completed && styles.completedButton]}
            onPress={toggleComplete}
          >
            <Text style={styles.buttonText}>
              {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 15,
  },
  high: {
    backgroundColor: '#FFE5E5',
  },
  medium: {
    backgroundColor: '#FFF3E0',
  },
  low: {
    backgroundColor: '#E8F5E9',
  },
  priorityText: {
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  metaInfo: {
    marginBottom: 20,
  },
  dateText: {
    color: '#666',
    marginBottom: 5,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 30,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#666',
    fontSize: 14,
  },
  completeButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  completedButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
    color: '#666',
  },
});