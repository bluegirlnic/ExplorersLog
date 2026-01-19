import { useDailyStore } from '../../stores/useDailyStore';
import { WEATHER_CONFIG } from '../../utils/constants';
import { Card } from '../../components/common/Card';

interface WeatherDisplayProps {
  onEdit: () => void;
}

export function WeatherDisplay({ onEdit }: WeatherDisplayProps) {
  const { currentWeather } = useDailyStore();
  const config = WEATHER_CONFIG[currentWeather.current];

  return (
    <Card
      hover
      onClick={onEdit}
      className="cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-4xl">{config.icon}</span>
          <div>
            <div className="font-medium text-earth-900">{config.label}</div>
            <div className="text-sm text-earth-600">
              Energy: {currentWeather.energyLevel}/10
            </div>
          </div>
        </div>
        <div className="text-xs text-earth-500">Tap to update</div>
      </div>
      {currentWeather.notes && (
        <p className="mt-3 text-sm text-earth-700 italic border-t border-earth-100 pt-3">
          {currentWeather.notes}
        </p>
      )}
    </Card>
  );
}
