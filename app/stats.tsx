import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

export default function Stats() {
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
      population: 8,
      color: '#FF3B30',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Medium',
      population: 12,
      color: '#FF9500',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Low',
      population: 5,
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

      <Animatable.View animation="fadeInUp" delay={300} style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="bar-chart" size={24} color="#007AFF" />
          <Text style={styles.cardTitle}>Weekly Progress</Text>
        </View>
        <BarChart
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
            style: {
              borderRadius: 16
            },
            propsForBackgroundLines: {
              strokeDasharray: '',
              strokeWidth: 0.5,
            }
          }}
          style={styles.chart}
          showValuesOnTopOfBars
        />
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={400} style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="trending-up" size={24} color="#007AFF" />
          <Text style={styles.cardTitle}>Monthly Trend</Text>
        </View>
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
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={500} style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="pie-chart" size={24} color="#007AFF" />
          <Text style={styles.cardTitle}>Task Distribution</Text>
        </View>
        <PieChart
          data={pieData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
        />
      </Animatable.View>
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
});