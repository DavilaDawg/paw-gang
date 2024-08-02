import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Modal,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import moment from 'moment-timezone';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';

const SERVER_URL = 'http://192.168.1.103:3000';

function ParkSchedule({ route }) {
  const { place_id, name, vicinity } = route.params;
  const [selectedDate, setSelectedDate] = useState(
    moment().tz('Europe/Madrid'),
  );
  const [events, setEvents] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [newEventDate, setNewEventDate] = useState('');
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isPrevDayDisabled, setIsPrevDayDisabled] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/events/park/${place_id}`);
        const data = response.data;
        const formattedEvents = data.reduce((acc, event) => {
          const dateKey = moment(event.date).tz('Europe/Madrid').format('YYYY-MM-DD');
          if (!acc[dateKey]) {
            acc[dateKey] = [];
          }
          acc[dateKey].push(event);
          return acc;
        }, {});
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [place_id]);

  useEffect(() => {
    const today = moment().tz('Europe/Madrid').startOf('day');
    setIsPrevDayDisabled(selectedDate.isSameOrBefore(today, 'day'));
  }, [selectedDate]);

  const handlePrevDay = () => {
    const newDate = selectedDate.clone().subtract(1, 'day');
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = selectedDate.clone().add(1, 'day');
    setSelectedDate(newDate);
  };

  const handleSaveEvent = async () => {
    const eventDate = moment.tz(
      `${selectedDate.format('YYYY-MM-DD')} ${newEventDate}`,
      'YYYY-MM-DD HH:mm',
      'Europe/Madrid'
    ).toISOString();

    const eventToAdd = {
      place_id,
      park_name: name,
      address: vicinity,
      date: eventDate,
      user: 'eugenio',
      dog_avatar:
        'https://i.ibb.co/86gL7yK/Whats-App-Image-2024-07-25-at-15-20-30-modified.png',
    };

    try {
      await axios.post(`${SERVER_URL}/events`, eventToAdd);

      const dateKey = selectedDate.format('YYYY-MM-DD');
      setEvents((prevEvents) => ({
        ...prevEvents,
        [dateKey]: [...(prevEvents[dateKey] || []), eventToAdd],
      }));

      setModalVisible(false);
      setNewEventDate('');
    } catch (error) {
      console.error('Error saving event:', error);
      Alert.alert('Error', 'An error occurred while saving the event.');
    }
  };

  const renderEvent = ({ item }) => (
    <View style={styles.event}>
      <Image source={{ uri: item.dog_avatar }} style={styles.dogAvatar} />
    </View>
  );

  const renderItem = ({ item }) => {
    const dayEvents = events[selectedDate.format('YYYY-MM-DD')] || [];
    const slotEvents = dayEvents.filter((event) =>
      moment(event.date).tz('Europe/Madrid').isSame(
        selectedDate.clone().hour(moment(item, 'HH:mm').hour()),
        'hour',
      ),
    );

    return (
      <View
        style={[styles.slot, slotEvents.length > 0 && styles.slotWithEvent]}
      >
        <Text style={styles.time}>{item}</Text>
        {slotEvents.length > 0 && (
          <FlatList
            horizontal
            data={slotEvents}
            renderItem={renderEvent}
            keyExtractor={(event) => `${event._id}-${event.date}-${event.user}`}
            style={styles.eventList}
          />
        )}
      </View>
    );
  };

  const hours = Array.from({ length: 24 }, (_, i) =>
    moment({ hour: i }).tz('Europe/Madrid').format('HH:00'),
  );

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirm = (time) => {
    const formattedTime = moment(time)
      .tz('Europe/Madrid')
      .minute(0)
      .format('HH:mm');
    setNewEventDate(formattedTime);
    hideTimePicker();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="Prev Day" onPress={handlePrevDay} disabled={isPrevDayDisabled} />
        <Text style={styles.date}>{selectedDate.format('dddd, D MMM')}</Text>
        <Button title="Next Day" onPress={handleNextDay} />
      </View>
      <FlatList
        data={hours}
        renderItem={renderItem}
        keyExtractor={(item) => item}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add visit 🐕</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Plan your visit 🐶</Text>
          <TouchableOpacity onPress={showTimePicker} style={styles.input}>
            <Text
              style={newEventDate ? styles.inputText : styles.placeholderText}
            >
              {newEventDate || 'Start Time (HH:00)'}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleConfirm}
            onCancel={hideTimePicker}
            minuteInterval={60}
          />
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
            <Button title="Save" onPress={handleSaveEvent} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    backgroundColor: '#008CBA',
    justifyContent: 'center',
    padding: 15,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
  },
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dogAvatar: {
    borderRadius: 40,
    height: 90,
    width: 90,
  },
  event: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    marginHorizontal: 0,
    padding: 10,
  },
  eventList: {
    flex: 1,
    paddingLeft: 0,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  inputText: {
    color: '#000',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
  placeId: {
    backgroundColor: '#ddd',
    fontSize: 16,
    padding: 10,
    textAlign: 'center',
  },
  placeholderText: {
    color: '#ccc',
    fontSize: 16,
  },
  slot: {
    alignItems: 'center',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 35,
  },
  slotWithEvent: {
    paddingVertical: 0,
  },
  time: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 60,
  },
});

export default ParkSchedule;
