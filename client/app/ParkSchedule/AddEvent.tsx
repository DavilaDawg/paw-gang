import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Button, Modal } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment-timezone';

interface AddEventModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  newEventDate: string;
  setNewEventDate: (date: string) => void;
  handleSaveEvent: () => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  modalVisible,
  setModalVisible,
  newEventDate,
  setNewEventDate,
  handleSaveEvent
}) => {
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const showTimePicker = () => setTimePickerVisibility(true);
  const hideTimePicker = () => setTimePickerVisibility(false);

  const handleConfirm = (time: Date) => {
    const formattedTime = moment(time)
      .tz('Europe/Madrid')
      .minute(0)
      .format('HH:mm');
    setNewEventDate(formattedTime);
    hideTimePicker();
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 justify-center p-5">
        <Text className="text-2xl mb-5">Plan your visit 🐶</Text>
        <TouchableOpacity
          onPress={showTimePicker}
          className="h-10 justify-center border border-gray-300 mb-5 px-2.5"
        >
          <Text
            className={
              newEventDate ? 'text-base text-black' : 'text-base text-gray-400'
            }
          >
            {newEventDate || 'Start Time (HH:00)'}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleConfirm}
          onCancel={hideTimePicker}
          minuteInterval={30}
        />
        <View className="flex-row justify-between">
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
          <Button title="Save" onPress={handleSaveEvent} />
        </View>
      </View>
    </Modal>
  );
};

export default AddEventModal;
