import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Link } from 'expo-router';
import { useState, useEffect } from 'react';
import * as Animatable from 'react-native-animatable';
import TaskCard from '../components/TaskCard';
import SearchBar from '../components/SearchBar';
import TaskFilter from '../components/TaskFilter';
import TaskStats from '../components/TaskStats';
import { taskStore, Task } from '../store/taskStore';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    high: 0,
    medium: 0,
    low: 0
  });
  const [refreshing, setRefreshing] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [tasks]);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadTasks();
    } catch (error) {
      console.error('Error refreshing tasks:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await taskStore.getTasks();
      setTasks(storedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTasks([]);
    }
  };

  const calculateStats = () => {
    setStats({
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length
    });
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const today = new Date().toISOString().split('T')[0];
    const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    switch(selectedFilter) {
      case 'today':
        return matchesSearch && taskDate === today && matchesPriority;
      case 'upcoming':
        return matchesSearch && taskDate > today && matchesPriority;
      case 'completed':
        return matchesSearch && task.completed && matchesPriority;
      default:
        return matchesSearch && matchesPriority;
    }
  }).sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  return (
    <Animatable.View style={styles.container} animation="fadeIn" duration={500}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Animatable.Text style={styles.title} animation="slideInDown">
            Linnovate
          </Animatable.Text>
          <TouchableOpacity 
            style={styles.sortButton}
            onPress={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          >
            <Text style={styles.sortButtonText}>
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Text>
          </TouchableOpacity>
        </View>
        <SearchBar 
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <TaskStats stats={stats} />
      
      <View style={styles.filterContainer}>
        <TaskFilter
          selected={selectedFilter}
          onSelect={setSelectedFilter}
        />
        <View style={styles.priorityFilter}>
          {['all', 'high', 'medium', 'low'].map((priority) => (
            <TouchableOpacity
              key={priority}
              style={[
                styles.priorityButton,
                priorityFilter === priority && styles.activePriorityButton
              ]}
              onPress={() => setPriorityFilter(priority as any)}
            >
              <Text style={[
                styles.priorityButtonText,
                priorityFilter === priority && styles.activePriorityButtonText
              ]}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView 
        style={styles.taskList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {filteredTasks.map((task, index) => (
          <Animatable.View
            key={task.id}
            animation="slideInRight"
            delay={index * 100}
          >
            <TaskCard
              title={task.title}
              description={task.description}
              priority={task.priority}
              completed={task.completed}
              onPress={() => {
                const { router } = require('expo-router');
                router.push(`/tasks/${task.id}`);
              }}
            />
          </Animatable.View>
        ))}
        {filteredTasks.length === 0 && (
          <Animatable.Text 
            style={styles.emptyText}
            animation="fadeIn"
            delay={300}
          >
            No tasks found
          </Animatable.Text>
        )}
      </ScrollView>

      <Animatable.View 
        style={styles.footer}
        animation="slideInUp"
      >
        <Link href="/tasks/new" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Add New Task</Text>
          </TouchableOpacity>
        </Link>
      </Animatable.View>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  taskList: {
    flex: 1,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sortButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  sortButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterContainer: {
    paddingHorizontal: 20,
  },
  priorityFilter: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 15,
  },
  priorityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  activePriorityButton: {
    backgroundColor: '#007AFF',
  },
  priorityButtonText: {
    color: '#666',
    fontSize: 14,
  },
  activePriorityButtonText: {
    color: '#fff',
  },
});
