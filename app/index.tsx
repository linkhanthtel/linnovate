import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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

  const loadTasks = async () => {
    const storedTasks = await taskStore.getTasks();
    setTasks(storedTasks);
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
    const taskDate = new Date(task.createdAt).toISOString().split('T')[0];
    
    switch(selectedFilter) {
      case 'today':
        return matchesSearch && taskDate === today;
      case 'upcoming':
        return matchesSearch && taskDate > today;
      case 'completed':
        return matchesSearch && task.completed;
      default:
        return matchesSearch;
    }
  });

  return (
    <Animatable.View style={styles.container} animation="fadeIn" duration={500}>
      <View style={styles.header}>
        <Animatable.Text style={styles.title} animation="slideInDown">
          Linnovate
        </Animatable.Text>
        <SearchBar 
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <TaskStats stats={stats} />
      
      <TaskFilter
        selected={selectedFilter}
        onSelect={setSelectedFilter}
      />

      <ScrollView style={styles.taskList}>
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
});
