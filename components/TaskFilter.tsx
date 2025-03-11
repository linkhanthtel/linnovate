import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

type FilterOption = 'all' | 'today' | 'upcoming' | 'completed';

type TaskFilterProps = {
  selected: FilterOption;
  onSelect: (filter: FilterOption) => void;
};

export default function TaskFilter({ selected, onSelect }: TaskFilterProps) {
  const filters: FilterOption[] = ['all', 'today', 'upcoming', 'completed'];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[styles.filter, selected === filter && styles.selected]}
          onPress={() => onSelect(filter)}
        >
          <Text style={[styles.filterText, selected === filter && styles.selectedText]}>
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  filter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  selected: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedText: {
    color: '#fff',
  },
});