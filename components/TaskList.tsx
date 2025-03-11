import { View, FlatList, StyleSheet, ActivityIndicator, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { Task, taskStore } from '../store/taskStore';
import TaskCard from './TaskCard';
import { router } from 'expo-router';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');
  const [filterCompleted, setFilterCompleted] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await taskStore.getTasks();
      setTasks(sortTasks(fetchedTasks));
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  }, []);

  const sortTasks = (tasksToSort: Task[]) => {
    const sortedTasks = [...tasksToSort];
    if (sortBy === 'date') {
      sortedTasks.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
    } else {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      sortedTasks.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
    }
    return sortedTasks;
  };

  const handleTaskPress = (task: Task) => {
    router.push(`/tasks/${task.id}`);
  };

  const toggleSort = () => {
    setSortBy(current => current === 'date' ? 'priority' : 'date');
    setTasks(sortTasks(tasks));
  };

  const filteredTasks = tasks.filter(task => !filterCompleted || !task.completed);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.filterButton} onPress={toggleSort}>
          <Ionicons 
            name={sortBy === 'date' ? 'calendar' : 'alert-circle'} 
            size={20} 
            color="#007AFF" 
          />
          <Text style={styles.filterText}>
            Sort by {sortBy === 'date' ? 'Date' : 'Priority'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setFilterCompleted(!filterCompleted)}
        >
          <Ionicons 
            name={filterCompleted ? 'eye-off' : 'eye'} 
            size={20} 
            color="#007AFF" 
          />
          <Text style={styles.filterText}>
            {filterCompleted ? 'Show All' : 'Hide Completed'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animatable.View
            animation="fadeInUp"
            delay={index * 100}
            duration={500}
          >
            <TaskCard
              title={item.title}
              description={item.description}
              priority={item.priority}
              completed={item.completed}
              onPress={() => handleTaskPress(item)}
            />
          </Animatable.View>
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#007AFF"
          />
        }
        ListEmptyComponent={
          <Animatable.View 
            style={styles.emptyState}
            animation="fadeIn"
            delay={300}
          >
            <Ionicons name="list" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No tasks found</Text>
          </Animatable.View>
        }
      />
    </View>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  filterText: {
    marginLeft: 8,
    color: '#007AFF',
    fontWeight: '500',
  },
  list: {
    padding: 16,
    flexGrow: 1,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
});