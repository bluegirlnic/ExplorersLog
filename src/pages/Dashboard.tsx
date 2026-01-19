import { useState } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { useQuestStore } from '../stores/useQuestStore';
import { useDailyStore } from '../stores/useDailyStore';
import { useDiscoveryStore } from '../stores/useDiscoveryStore';
import { useAppStore } from '../stores/useAppStore';
import { WeatherDisplay } from '../features/weather/WeatherDisplay';
import { WeatherSelector } from '../features/weather/WeatherSelector';
import { QuestCard } from '../components/quest/QuestCard';
import { CreateQuestDialog } from '../features/quests/CreateQuestDialog';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export function Dashboard() {
  const [weatherDialogOpen, setWeatherDialogOpen] = useState(false);
  const [createQuestOpen, setCreateQuestOpen] = useState(false);

  const { getActiveQuests, logExpeditionCompletion } = useQuestStore();
  const { addQuestToToday } = useDailyStore();
  const { getRecentDiscoveries } = useDiscoveryStore();
  const { getRandomQuote } = useAppStore();

  const activeQuests = getActiveQuests();
  const recentDiscoveries = getRecentDiscoveries(5);
  const quote = getRandomQuote();

  const handleCompleteExpedition = (questId: string) => {
    logExpeditionCompletion(questId);
    addQuestToToday(questId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-forest-900 mb-2">
          Explorer's Log
        </h1>
        <p className="text-earth-600">Track your expeditions and discoveries</p>
      </div>

      {/* Weather */}
      <WeatherDisplay onEdit={() => setWeatherDialogOpen(true)} />

      {/* Quote */}
      {quote && (
        <Card className="bg-gradient-to-br from-forest-50 to-sky-50 border-forest-200">
          <blockquote className="text-earth-800 italic leading-relaxed">
            "{quote.text}"
          </blockquote>
          {quote.author && (
            <p className="mt-2 text-sm text-earth-600">— {quote.author}</p>
          )}
        </Card>
      )}

      {/* Active Quests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-earth-900">Active Quests</h2>
          <Button size="sm" onClick={() => setCreateQuestOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            New Quest
          </Button>
        </div>

        {activeQuests.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-earth-600 mb-4">
                No active quests yet. Start your first expedition!
              </p>
              <Button onClick={() => setCreateQuestOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Quest
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {activeQuests.slice(0, 6).map((quest) => (
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
      </div>

      {/* Recent Discoveries */}
      {recentDiscoveries.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-earth-900">
              Recent Discoveries
            </h2>
            <Button size="sm" variant="ghost" onClick={() => {}}>
              <BookOpen className="h-4 w-4 mr-1" />
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {recentDiscoveries.map((discovery) => (
              <Card key={discovery.id} padding="sm">
                <p className="text-sm text-earth-800">{discovery.content}</p>
                <div className="mt-2 flex items-center space-x-2">
                  {discovery.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-earth-100 text-earth-600 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Dialogs */}
      <WeatherSelector
        isOpen={weatherDialogOpen}
        onClose={() => setWeatherDialogOpen(false)}
      />
      <CreateQuestDialog
        isOpen={createQuestOpen}
        onClose={() => setCreateQuestOpen(false)}
      />
    </div>
  );
}
