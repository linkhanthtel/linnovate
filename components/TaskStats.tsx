import { View, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

type TaskStatsProps = {
  stats: {
    total: number;
    completed: number;
    high: number;
    medium: number;
    low: number;
  };
};

export default function TaskStats({ stats }: TaskStatsProps) {
  const completionRate = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <Animatable.View style={styles.container} animation="fadeIn" delay={200}>
      <View style={styles.row}>
        <StatCard
          title="Total Tasks"
          value={stats.total}
          color="#007AFF"
        />
        <StatCard
          title="Completed"
          value={`${completionRate}%`}
          color="#34C759"
        />
      </View>
      <View style={styles.row}>
        <StatCard
          title="High Priority"
          value={stats.high}
          color="#FF3B30"
          small
        />
        <StatCard
          title="Medium"
          value={stats.medium}
          color="#FF9500"
          small
        />
        <StatCard
          title="Low"
          value={stats.low}
          color="#34C759"
          small
        />
      </View>
    </Animatable.View>
  );
}

function StatCard({ title, value, color, small }: { 
  title: string; 
  value: number | string; 
  color: string;
  small?: boolean;
}) {
  return (
    <View style={[styles.card, small && styles.smallCard]}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={[styles.cardValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  smallCard: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});