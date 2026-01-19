import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useQuestStore } from '../../stores/useQuestStore';
import type {
  QuestType,
  Difficulty,
  FrameworkElement,
  CreateQuestInput,
  Waypoint,
} from '../../types';
import {
  QUEST_TYPE_CONFIG,
  DIFFICULTY_LABELS,
  FRAMEWORK_ELEMENTS_CONFIG,
} from '../../utils/constants';
import { Button } from '../../components/common/Button';
import { classNames } from '../../utils/helpers';

interface CreateQuestDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateQuestDialog({ isOpen, onClose }: CreateQuestDialogProps) {
  const { addQuest } = useQuestStore();

  const [type, setType] = useState<QuestType>('expedition');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(3);
  const [elements, setElements] = useState<FrameworkElement[]>([]);
  const [waypoints, setWaypoints] = useState<Omit<Waypoint, 'id'>[]>([]);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'custom'>('daily');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const questInput: CreateQuestInput = {
      type,
      title,
      description,
      difficulty,
      frameworkElements: elements,
      status: 'active',
    };

    // Add type-specific fields
    if (type === 'summit') {
      questInput.waypoints = waypoints.map((wp, index) => ({
        ...wp,
        id: crypto.randomUUID(),
        order: index,
      }));
      questInput.progress = 0;
    }

    if (type === 'expedition') {
      questInput.frequency = frequency;
      questInput.streak = 0;
    }

    addQuest(questInput);
    handleClose();
  };

  const handleClose = () => {
    setType('expedition');
    setTitle('');
    setDescription('');
    setDifficulty(3);
    setElements([]);
    setWaypoints([]);
    setFrequency('daily');
    onClose();
  };

  const toggleElement = (element: FrameworkElement) => {
    setElements((prev) =>
      prev.includes(element)
        ? prev.filter((e) => e !== element)
        : [...prev, element]
    );
  };

  const addWaypoint = () => {
    setWaypoints([
      ...waypoints,
      {
        title: '',
        description: '',
        completed: false,
        order: waypoints.length,
      },
    ]);
  };

  const updateWaypoint = (index: number, field: string, value: string) => {
    setWaypoints(
      waypoints.map((wp, i) => (i === index ? { ...wp, [field]: value } : wp))
    );
  };

  const removeWaypoint = (index: number) => {
    setWaypoints(waypoints.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-lg shadow-xl my-8">
          <div className="flex items-center justify-between p-6 border-b border-earth-200">
            <Dialog.Title className="text-lg font-semibold text-earth-900">
              Create New Quest
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="text-earth-500 hover:text-earth-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Quest Type */}
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-3">
                Quest Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(Object.entries(QUEST_TYPE_CONFIG) as [QuestType, typeof QUEST_TYPE_CONFIG[QuestType]][]).map(
                  ([questType, config]) => (
                    <button
                      key={questType}
                      type="button"
                      onClick={() => setType(questType)}
                      className={classNames(
                        'p-3 rounded-lg border-2 transition-all text-left',
                        type === questType
                          ? 'border-forest-600 bg-forest-50'
                          : 'border-earth-200 hover:border-earth-300'
                      )}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xl">{config.icon}</span>
                        <span className="font-medium text-earth-900 text-sm">
                          {config.label}
                        </span>
                      </div>
                      <p className="text-xs text-earth-600">{config.description}</p>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">
                Quest Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                placeholder="Give your quest a name..."
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent resize-none"
                placeholder="What is this quest about?"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-3">
                Difficulty: {DIFFICULTY_LABELS[difficulty]}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value) as Difficulty)}
                className="w-full h-2 bg-earth-200 rounded-lg appearance-none cursor-pointer accent-forest-600"
              />
              <div className="flex justify-between text-xs text-earth-500 mt-1">
                <span>Easy Trail</span>
                <span>Expert</span>
              </div>
            </div>

            {/* Framework Elements */}
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-3">
                Life Framework Elements
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {(Object.entries(FRAMEWORK_ELEMENTS_CONFIG) as [
                  FrameworkElement,
                  typeof FRAMEWORK_ELEMENTS_CONFIG[FrameworkElement]
                ][]).map(([element, config]) => (
                  <button
                    key={element}
                    type="button"
                    onClick={() => toggleElement(element)}
                    className={classNames(
                      'p-2 rounded-lg border text-left transition-all text-sm',
                      elements.includes(element)
                        ? 'border-forest-600 bg-forest-50'
                        : 'border-earth-200 hover:border-earth-300'
                    )}
                  >
                    <span className="mr-2">{config.icon}</span>
                    {config.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Waypoints (Summit only) */}
            {type === 'summit' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-earth-700">
                    Waypoints
                  </label>
                  <Button type="button" size="sm" onClick={addWaypoint}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Waypoint
                  </Button>
                </div>
                <div className="space-y-2">
                  {waypoints.map((wp, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={wp.title}
                          onChange={(e) =>
                            updateWaypoint(index, 'title', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-sm"
                          placeholder={`Waypoint ${index + 1} title`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeWaypoint(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {waypoints.length === 0 && (
                    <p className="text-sm text-earth-500 italic">
                      Add waypoints to track progress on this summit attempt
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Frequency (Expedition only) */}
            {type === 'expedition' && (
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">
                  Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) =>
                    setFrequency(e.target.value as 'daily' | 'weekly' | 'custom')
                  }
                  className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-earth-200">
              <Button type="button" variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">Create Quest</Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
