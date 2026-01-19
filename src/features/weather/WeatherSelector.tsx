import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { useDailyStore } from '../../stores/useDailyStore';
import type { Weather } from '../../types';
import { WEATHER_CONFIG } from '../../utils/constants';
import { Button } from '../../components/common/Button';
import { classNames } from '../../utils/helpers';

interface WeatherSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WeatherSelector({ isOpen, onClose }: WeatherSelectorProps) {
  const { currentWeather, setWeather } = useDailyStore();
  const [selectedWeather, setSelectedWeather] = useState<Weather>(currentWeather.current);
  const [energyLevel, setEnergyLevel] = useState(currentWeather.energyLevel);
  const [notes, setNotes] = useState(currentWeather.notes || '');

  const handleSave = () => {
    setWeather(selectedWeather, energyLevel, notes);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-6 border-b border-earth-200">
            <Dialog.Title className="text-lg font-semibold text-earth-900">
              Today's Weather
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-earth-500 hover:text-earth-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-3">
                How are you feeling today?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(Object.entries(WEATHER_CONFIG) as [Weather, typeof WEATHER_CONFIG[Weather]][]).map(
                  ([weather, config]) => (
                    <button
                      key={weather}
                      onClick={() => setSelectedWeather(weather)}
                      className={classNames(
                        'p-4 rounded-lg border-2 transition-all text-left',
                        selectedWeather === weather
                          ? 'border-forest-600 bg-forest-50'
                          : 'border-earth-200 hover:border-earth-300'
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{config.icon}</span>
                        <div>
                          <div className="font-medium text-earth-900">{config.label}</div>
                          <div className="text-xs text-earth-600">{config.description}</div>
                        </div>
                      </div>
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 mb-3">
                Energy Level: {energyLevel}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                className="w-full h-2 bg-earth-200 rounded-lg appearance-none cursor-pointer accent-forest-600"
              />
              <div className="flex justify-between text-xs text-earth-500 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent resize-none"
                placeholder="Any thoughts about today's capacity..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 p-6 border-t border-earth-200">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Weather</Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
