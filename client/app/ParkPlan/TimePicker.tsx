import React from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface TimePickerModalProps {
  isVisible: boolean;
  onConfirm: (time: Date) => void;
  onCancel: () => void;
}

const TimePickerModal: React.FC<TimePickerModalProps> = ({
  isVisible,
  onConfirm,
  onCancel
}) => (
  <DateTimePickerModal
    isVisible={isVisible}
    mode="time"
    onConfirm={onConfirm}
    onCancel={onCancel}
    minuteInterval={30}
  />
);

export default TimePickerModal;
