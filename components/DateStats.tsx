import { View, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

interface DateStatsProps {
  stats: {
    total: number;
    completed: number;
    high: number;
    medium: number;
    low: number;
  };
}

export default function DateStats({ stats }: DateStatsProps) {
  return (
    <Animatable.View style={styles.container} animation="fadeIn">
      <View style={styles.statRow}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Done</Text>
        </View>
      </View>
      <View style={styles.priorityStats}>
        <View style={[styles.priorityStat, styles.highPriority]}>
          <Text style={styles.priorityNumber}>{stats.high}</Text>
          <Text style={styles.priorityLabel}>High</Text>
        </View>
        <View style={[styles.priorityStat, styles.mediumPriority]}>
          <Text style={styles.priorityNumber}>{stats.medium}</Text>
          <Text style={styles.priorityLabel}>Med</Text>
        </View>
        <View style={[styles.priorityStat, styles.lowPriority]}>
          <Text style={styles.priorityNumber}>{stats.low}</Text>
          <Text style={styles.priorityLabel}>Low</Text>
        </View>
      </View>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  priorityStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityStat: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  highPriority: {
    backgroundColor: '#FFE5E5',
  },
  mediumPriority: {
    backgroundColor: '#FFF3E0',
  },
  lowPriority: {
    backgroundColor: '#E8F5E9',
  },
  priorityNumber: {
    fontSize: 18,
    fontWeight: '600',
  },
  priorityLabel: {
    fontSize: 12,
    color: '#666',
  },
});