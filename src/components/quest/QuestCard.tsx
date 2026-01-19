import type { Quest } from '../../types';
import { Card } from '../common/Card';
import { QUEST_TYPE_CONFIG, DIFFICULTY_LABELS } from '../../utils/constants';
import { CheckCircle2, Circle, Clock, Mountain } from 'lucide-react';
import { classNames } from '../../utils/helpers';

interface QuestCardProps {
  quest: Quest;
  onClick?: () => void;
  onComplete?: () => void;
  compact?: boolean;
}

export function QuestCard({ quest, onClick, onComplete, compact = false }: QuestCardProps) {
  const typeConfig = QUEST_TYPE_CONFIG[quest.type];

  const renderProgress = () => {
    if (quest.type === 'summit' && quest.waypoints) {
      const completed = quest.waypoints.filter((wp) => wp.completed).length;
      const total = quest.waypoints.length;
      return (
        <div className="flex items-center space-x-2 text-sm">
          <Mountain className="h-4 w-4 text-forest-600" />
          <span className="text-earth-600">
            {completed}/{total} waypoints
          </span>
          <div className="flex-1 bg-earth-200 rounded-full h-2 max-w-[100px]">
            <div
              className="bg-forest-600 h-2 rounded-full transition-all"
              style={{ width: `${(completed / total) * 100}%` }}
            />
          </div>
        </div>
      );
    }

    if (quest.type === 'expedition' && quest.streak) {
      return (
        <div className="flex items-center space-x-2 text-sm text-earth-600">
          <span className="font-medium text-forest-700">{quest.streak} day streak</span>
        </div>
      );
    }

    return null;
  };

  return (
    <Card
      hover
      onClick={onClick}
      className={classNames(
        'cursor-pointer',
        quest.status === 'on-ice' && 'opacity-60',
        quest.status === 'completed' && 'bg-forest-50'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">{typeConfig.icon}</span>
            <span className="text-xs px-2 py-1 rounded bg-earth-100 text-earth-700">
              {typeConfig.label}
            </span>
            <span className="text-xs text-earth-500">
              {DIFFICULTY_LABELS[quest.difficulty]}
            </span>
          </div>

          <h3 className="font-semibold text-earth-900 mb-1">{quest.title}</h3>

          {!compact && quest.description && (
            <p className="text-sm text-earth-600 mb-3 line-clamp-2">{quest.description}</p>
          )}

          {renderProgress()}

          {quest.status === 'on-ice' && (
            <div className="mt-2 flex items-center space-x-1 text-sm text-earth-500">
              <Clock className="h-4 w-4" />
              <span>On ice</span>
              {quest.onIceReason && <span>· {quest.onIceReason}</span>}
            </div>
          )}
        </div>

        {onComplete && quest.type === 'expedition' && quest.status === 'active' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onComplete();
            }}
            className="ml-4 text-earth-400 hover:text-forest-600 transition-colors"
          >
            <Circle className="h-6 w-6" />
          </button>
        )}

        {quest.status === 'completed' && (
          <CheckCircle2 className="ml-4 h-6 w-6 text-forest-600 flex-shrink-0" />
        )}
      </div>
    </Card>
  );
}
