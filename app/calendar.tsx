import { View, StyleSheet, Text, ScrollView, TouchableOpacity, PanResponder } from 'react-native';
import { Calendar as RNCalendar, DateData } from 'react-native-calendars';
import { useState, useEffect, useRef } from 'react';
import { router } from 'expo-router';
import TaskCard from '../components/TaskCard';
import { taskStore, Task } from '../store/taskStore';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import DateStats from '../components/DateStats';
import FilterBar from '../components/FilterBar';

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [view, setView] = useState<'calendar' | 'agenda'>('calendar');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');
  const [dateStats, setDateStats] = useState({
    total: 0,
    completed: 0,
    high: 0,
    medium: 0,
    low: 0
  });
  const [calendarTheme, setCalendarTheme] = useState({
    light: true,
    compact: false,
  });

  const draggedTask = useRef<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    filterTasks();
    calculateDateStats();
  }, [selectedDate, tasks, filterPriority, filterStatus]);

  const loadTasks = async () => {
    const storedTasks = await taskStore.getTasks();
    setTasks(storedTasks);
    if (!selectedDate) {
      setSelectedDate(new Date().toISOString().split('T')[0]);
    }
  };

  const filterTasks = () => {
    if (!selectedDate) return;
    
    let filtered = tasks.filter(task => {
      const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
      return taskDate === selectedDate;
    });

    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => 
        filterStatus === 'completed' ? task.completed : !task.completed
      );
    }

    setFilteredTasks(filtered);
  };

  const calculateDateStats = () => {
    if (!selectedDate) return;

    const tasksForDate = tasks.filter(task => {
      const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
      return taskDate === selectedDate;
    });

    setDateStats({
      total: tasksForDate.length,
      completed: tasksForDate.filter(t => t.completed).length,
      high: tasksForDate.filter(t => t.priority === 'high').length,
      medium: tasksForDate.filter(t => t.priority === 'medium').length,
      low: tasksForDate.filter(t => t.priority === 'low').length
    });
  };

  const getMarkedDates = () => {
    const marked: any = {
      [selectedDate]: { selected: true, selectedColor: '#007AFF' }
    };
    
    tasks.forEach(task => {
      const date = new Date(task.dueDate).toISOString().split('T')[0];
      if (date !== selectedDate) {
        if (marked[date]) {
          marked[date].dots.push({
            color: getPriorityColor(task.priority)
          });
        } else {
          marked[date] = {
            dots: [{
              color: getPriorityColor(task.priority)
            }],
            marked: true
          };
        }
      }
    });
    
    return marked;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#FF3B30';
      case 'medium': return '#FF9500';
      case 'low': return '#34C759';
      default: return '#007AFF';
    }
  };

  const handleDateSelect = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const handleTaskPress = (taskId: string) => {
    router.push(`/tasks/${taskId}`);
  };

  const addTaskForDate = () => {
    router.push({
      pathname: '/tasks/new',
      params: { date: selectedDate }
    });
  };

  const handleDragStart = (task: Task) => {
    draggedTask.current = task;
  };

  const handleDragEnd = async (newDate: string) => {
    if (draggedTask.current) {
      const updatedTask = {
        ...draggedTask.current,
        dueDate: newDate
      };
      await taskStore.updateTask(updatedTask);
      loadTasks();
      draggedTask.current = null;
    }
  };

  const toggleCalendarTheme = () => {
    setCalendarTheme(prev => ({
      ...prev,
      light: !prev.light
    }));
  };

  const toggleCalendarView = () => {
    setView(prev => prev === 'calendar' ? 'agenda' : 'calendar');
    setCalendarTheme(prev => ({
      ...prev,
      compact: !prev.compact
    }));
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView 
        style={styles.mainScroll}
        contentContainerStyle={styles.mainScrollContent}
        stickyHeaderIndices={[0]}
      >
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Calendar</Text>
              <Text style={styles.subtitle}>
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.iconButton} onPress={toggleCalendarTheme}>
                <Ionicons 
                  name={calendarTheme.light ? 'sunny' : 'moon'} 
                  size={24} 
                  color="#007AFF" 
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={toggleCalendarView}>
                <Ionicons 
                  name={calendarTheme.compact ? 'expand' : 'contract'} 
                  size={24} 
                  color="#007AFF" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {view === 'calendar' && (
            <View style={styles.calendarContainer}>
              <RNCalendar
                onDayPress={handleDateSelect}
                onDayLongPress={(day: DateData) => handleDragEnd(day.dateString)}
                markedDates={getMarkedDates()}
                markingType="multi-dot"
                theme={{
                  ...calendarTheme,
                  backgroundColor: calendarTheme.light ? '#fff' : '#1c1c1e',
                  calendarBackground: calendarTheme.light ? '#fff' : '#1c1c1e',
                  textColor: calendarTheme.light ? '#000' : '#fff',
                  todayTextColor: '#007AFF',
                  selectedDayBackgroundColor: '#007AFF',
                  monthTextColor: calendarTheme.light ? '#000' : '#fff',
                  textMonthFontWeight: 'bold',
                  textMonthFontSize: 18,
                  textDayFontSize: 16,
                  textDayHeaderFontSize: 14,
                  dotStyle: { marginTop: 2 },
                  'stylesheet.day.basic': {
                    base: {
                      width: 44,
                      height: 44,
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  },
                }}
                style={[
                  styles.calendar,
                  calendarTheme.compact && styles.compactCalendar,
                  view !== 'calendar' && styles.hideCalendar
                ]}
              />
            </View>
          )}
        </View>

        <View 
          style={[
            styles.contentContainer,
            calendarTheme.light ? styles.lightContent : styles.darkContent
          ]}
        >
          <View style={styles.statsContainer}>
            <DateStats stats={dateStats} />
            <FilterBar
              priorityFilter={filterPriority}
              statusFilter={filterStatus}
              onPriorityChange={setFilterPriority}
              onStatusChange={setFilterStatus}
            />
          </View>

          <View style={styles.taskContainer}>
            <View style={styles.taskHeader}>
              <View>
                <Text style={[
                  styles.dateTitle,
                  !calendarTheme.light && styles.darkText
                ]}>
                  {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Select a date'}
                </Text>
                <Text style={styles.taskCount}>
                  {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                </Text>
              </View>
              <TouchableOpacity 
                style={[styles.addButton, !calendarTheme.light && styles.darkButton]}
                onPress={addTaskForDate}
              >
                <Ionicons 
                  name="add-circle" 
                  size={24} 
                  color={calendarTheme.light ? "#007AFF" : "#fff"} 
                />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.taskList}
              contentContainerStyle={styles.taskListContent}
              showsVerticalScrollIndicator={false}
            >
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task, index) => (
                  <Animatable.View
                    key={task.id}
                    animation="fadeInUp"
                    delay={index * 50}
                    style={styles.taskCardWrapper}
                  >
                    <TaskCard
                      title={task.title}
                      description={task.description}
                      priority={task.priority}
                      completed={task.completed}
                      onPress={() => handleTaskPress(task.id)}
                    />
                  </Animatable.View>
                ))
              ) : (
                <View style={styles.emptyStateWrapper}>
                  <Animatable.View 
                    style={[styles.emptyState, !calendarTheme.light && styles.darkEmptyState]}
                    animation="fadeIn"
                  >
                    <Ionicons 
                      name="calendar-outline" 
                      size={48} 
                      color={calendarTheme.light ? "#ccc" : "#666"} 
                    />
                    <Text style={[styles.noTasks, !calendarTheme.light && styles.darkText]}>
                      No tasks for this date
                    </Text>
                    <TouchableOpacity 
                      style={styles.createButton}
                      onPress={addTaskForDate}
                    >
                      <Text style={styles.createButtonText}>Create Task</Text>
                    </TouchableOpacity>
                  </Animatable.View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainScroll: {
    flex: 1,
  },
  mainScrollContent: {
    flexGrow: 1,
  },
  headerContainer: {
    backgroundColor: '#fff',
    paddingTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#1c1c1e',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
  },
  calendarContainer: {
    padding: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
    height: 380, // Fixed height for smooth animation
  },
  hideCalendar: {
    height: 0,
    padding: 0,
    opacity: 0,
  },
  calendar: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  compactCalendar: {
    height: 300,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 30, // Add padding at bottom for better scrolling
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
  },
  lightContent: {
    backgroundColor: '#f8f8f8',
  },
  darkContent: {
    backgroundColor: '#1c1c1e',
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  taskContainer: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  dateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1c1c1e',
  },
  darkText: {
    color: '#fff',
  },
  taskCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
  },
  darkButton: {
    backgroundColor: '#2c2c2e',
  },
  taskList: {
    flex: 1,
  },
  taskListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  taskCardWrapper: {
    marginBottom: 12,
  },
  emptyStateWrapper: {
    flex: 1,
    minHeight: 300,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 16,
  },
  darkEmptyState: {
    backgroundColor: '#2c2c2e',
  },
  noTasks: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});