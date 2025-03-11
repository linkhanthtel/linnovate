import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

interface FilterBarProps {
  priorityFilter: 'all' | 'high' | 'medium' | 'low';
  statusFilter: 'all' | 'completed' | 'pending';
  onPriorityChange: (priority: 'all' | 'high' | 'medium' | 'low') => void;
  onStatusChange: (status: 'all' | 'completed' | 'pending') => void;
}

export default function FilterBar({
  priorityFilter,
  statusFilter,
  onPriorityChange,
  onStatusChange
}: FilterBarProps) {
  const priorities = [
    { value: 'all', label: 'All', icon: 'apps' },
    { value: 'high', label: 'High', icon: 'alert-circle', color: '#FF3B30' },
    { value: 'medium', label: 'Medium', icon: 'alert', color: '#FF9500' },
    { value: 'low', label: 'Low', icon: 'information-circle', color: '#34C759' }
  ];

  const statuses = [
    { value: 'all', label: 'All', icon: 'list' },
    { value: 'pending', label: 'Pending', icon: 'time' },
    { value: 'completed', label: 'Done', icon: 'checkmark-circle' }
  ];

  return (
    <Animatable.View animation="fadeIn" duration={500} style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Priority:</Text>
          <View style={styles.filterButtons}>
            {priorities.map(({ value, label, icon, color }) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.filterButton,
                  priorityFilter === value && styles.activeFilter,
                  color && priorityFilter === value && { backgroundColor: color }
                ]}
                onPress={() => onPriorityChange(value as any)}
              >
                <Ionicons 
                  name={icon as any} 
                  size={16} 
                  color={priorityFilter === value ? '#fff' : '#666'} 
                />
                <Text style={[
                  styles.filterText,
                  priorityFilter === value && styles.activeFilterText
                ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Status:</Text>
          <View style={styles.filterButtons}>
            {statuses.map(({ value, label, icon }) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.filterButton,
                  statusFilter === value && styles.activeFilter,
                  statusFilter === value && value === 'completed' && styles.completedFilter
                ]}
                onPress={() => onStatusChange(value as any)}
              >
                <Ionicons 
                  name={icon as any} 
                  size={16} 
                  color={statusFilter === value ? '#fff' : '#666'} 
                />
                <Text style={[
                  styles.filterText,
                  statusFilter === value && styles.activeFilterText
                ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  scrollView: {
    paddingHorizontal: 15,
  },
  filterSection: {
    marginRight: 20,
  },
  filterLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  activeFilter: {
    backgroundColor: '#007AFF',
  },
  activeFilterText: {
    color: '#fff',
  },
  completedFilter: {
    backgroundColor: '#34C759',
  },
});