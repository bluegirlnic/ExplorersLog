import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useQuestStore } from '../stores/useQuestStore';
import { useDailyStore } from '../stores/useDailyStore';
import { QuestCard } from '../components/quest/QuestCard';
import { CreateQuestDialog } from '../features/quests/CreateQuestDialog';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import type { QuestType, QuestStatus } from '../types';
import { QUEST_TYPE_CONFIG } from '../utils/constants';
import { classNames } from '../utils/helpers';

export function Quests() {
  const [createQuestOpen, setCreateQuestOpen] = useState(false);
  const [filterType, setFilterType] = useState<QuestType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<QuestStatus | 'all'>('active');

  const { quests, logExpeditionCompletion } = useQuestStore();
  const { addQuestToToday } = useDailyStore();

  const filteredQuests = quests.filter((quest) => {
    if (filterType !== 'all' && quest.type !== filterType) return false;
    if (filterStatus !== 'all' && quest.status !== filterStatus) return false;
    return true;
  });

  const handleCompleteExpedition = (questId: string) => {
    logExpeditionCompletion(questId);
    addQuestToToday(questId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-forest-900 mb-2">
            Quests
          </h1>
          <p className="text-earth-600">Manage your expeditions and goals</p>
        </div>
        <Button onClick={() => setCreateQuestOpen(true)}>
          <Plus className="h-5 w-5 mr-2" />
          New Quest
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2">
              Quest Type
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={classNames(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  filterType === 'all'
                    ? 'bg-forest-600 text-white'
                    : 'bg-earth-100 text-earth-700 hover:bg-earth-200'
                )}
              >
                All Types
              </button>
              {(Object.entries(QUEST_TYPE_CONFIG) as [QuestType, typeof QUEST_TYPE_CONFIG[QuestType]][]).map(
                ([type, config]) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={classNames(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                      filterType === type
                        ? 'bg-forest-600 text-white'
                        : 'bg-earth-100 text-earth-700 hover:bg-earth-200'
                    )}
                  >
                    {config.icon} {config.label}
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {(['all', 'active', 'on-ice', 'completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={classNames(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize',
                    filterStatus === status
                      ? 'bg-forest-600 text-white'
                      : 'bg-earth-100 text-earth-700 hover:bg-earth-200'
                  )}
                >
                  {status === 'all' ? 'All' : status.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Quest List */}
      {filteredQuests.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-earth-600 mb-4">No quests match your filters.</p>
            <Button onClick={() => setCreateQuestOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Quest
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onComplete={
                quest.type === 'expedition'
                  ? () => handleCompleteExpedition(quest.id)
                  : undefined
              }
            />
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <CreateQuestDialog
        isOpen={createQuestOpen}
        onClose={() => setCreateQuestOpen(false)}
      />
    </div>
  );
}
