import React from 'react';
import { View, Text, Button } from 'react-native';
import { Moment } from 'moment-timezone';

interface DateSelectorProps {
  selectedDate: Moment;
  handlePrevDay: () => void;
  handleNextDay: () => void;
  isPrevDayDisabled: boolean;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  handlePrevDay,
  handleNextDay,
  isPrevDayDisabled
}) => (
  <View className="flex-row justify-between items-center bg-gray-100 border-b border-gray-300 p-2.5">
    <Button
      title="Prev Day"
      onPress={handlePrevDay}
      disabled={isPrevDayDisabled}
    />
    <Text className="text-lg font-bold">
      {selectedDate.format('dddd, D MMM')}
    </Text>
    <Button title="Next Day" onPress={handleNextDay} />
  </View>
);

export default DateSelector;
