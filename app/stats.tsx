import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { BarChart, LineChart, PieChart, ProgressChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { taskStore } from '../store/taskStore';
import { useState, useEffect } from 'react';

export default function Stats() {
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    high: 0,
    medium: 0,
    low: 0
  });
  const [timeFrame, setTimeFrame] = useState('week');

  useEffect(() => {
    loadTaskStats();
  }, []);

  const loadTaskStats = async () => {
    const tasks = await taskStore.getTasks();
    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length
    };
    setTaskStats(stats);
  };

  const progressData = {
    labels: ['Tasks'], // optional
    data: [taskStats.completed / (taskStats.total || 1)]
  };

  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [3, 5, 2, 8, 4, 6, 1]
    }]
  };

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [{
      data: [20, 45, 28, 35],
      color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
      strokeWidth: 2
    }]
  };

  const pieData = [
    {
      name: 'High',
      population: taskStats.high,
      color: '#FF3B30',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Medium',
      population: taskStats.medium,
      color: '#FF9500',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Low',
      population: taskStats.low,
      color: '#34C759',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
        <Text style={styles.subtitle}>Task Performance Overview</Text>
      </View>

      <Animatable.View animation="fadeInUp" delay={200} style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{taskStats.total}</Text>
            <Text style={styles.summaryLabel}>Total Tasks</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{taskStats.completed}</Text>
            <Text style={styles.summaryLabel}>Completed</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {Math.round((taskStats.completed / (taskStats.total || 1)) * 100)}%
            </Text>
            <Text style={styles.summaryLabel}>Success Rate</Text>
          </View>
        </View>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={300} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="bar-chart" size={24} color="#007AFF" />
            <Text style={styles.cardTitle}>Task Progress</Text>
          </View>
          <View style={styles.timeFrameButtons}>
            <TouchableOpacity 
              style={[styles.timeButton, timeFrame === 'week' && styles.activeTimeButton]}
              onPress={() => setTimeFrame('week')}
            >
              <Text style={[styles.timeButtonText, timeFrame === 'week' && styles.activeTimeButtonText]}>Week</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.timeButton, timeFrame === 'month' && styles.activeTimeButton]}
              onPress={() => setTimeFrame('month')}
            >
              <Text style={[styles.timeButtonText, timeFrame === 'month' && styles.activeTimeButtonText]}>Month</Text>
            </TouchableOpacity>
          </View>
        </View>
        {timeFrame === 'week' ? (
          <BarChart
            yAxisLabel=""
            yAxisSuffix=""
            data={weeklyData}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: 16 },
              propsForBackgroundLines: {
                strokeDasharray: '',
                strokeWidth: 0.5,
              }
            }}
            style={styles.chart}
            showValuesOnTopOfBars
          />
        ) : (
          <LineChart
            data={monthlyData}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#007AFF'
              }
            }}
            style={styles.chart}
            bezier
          />
        )}
      </Animatable.View>

      <View style={styles.row}>
        <Animatable.View animation="fadeInLeft" delay={400} style={[styles.card, styles.halfCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="pie-chart" size={24} color="#007AFF" />
            <Text style={styles.cardTitle}>Priority</Text>
          </View>
          <PieChart
            data={pieData}
            width={Dimensions.get('window').width / 2 - 20}
            height={160}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        </Animatable.View>

        <Animatable.View animation="fadeInRight" delay={400} style={[styles.card, styles.halfCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="cellular" size={24} color="#007AFF" />
            <Text style={styles.cardTitle}>Completion</Text>
          </View>
          <ProgressChart
            data={progressData}
            width={Dimensions.get('window').width / 2 - 20}
            height={160}
            strokeWidth={16}
            radius={32}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            }}
            hideLegend={true}
            style={styles.chart}
          />
        </Animatable.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    color: '#1c1c1e',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  halfCard: {
    flex: 1,
    margin: 5,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeFrameButtons: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 2,
  },
  timeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeTimeButton: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  timeButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeTimeButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});