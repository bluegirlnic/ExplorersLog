import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useAppStore } from '../stores/useAppStore';
import { useQuestStore } from '../stores/useQuestStore';
import { useDiscoveryStore } from '../stores/useDiscoveryStore';
import { useDailyStore } from '../stores/useDailyStore';

export function Settings() {
  const { preferences, updatePreferences } = useAppStore();

  const handleExportData = () => {
    const data = {
      quests: useQuestStore.getState().quests,
      discoveries: useDiscoveryStore.getState().discoveries,
      dailyEntries: useDailyStore.getState().dailyEntries,
      preferences: useAppStore.getState().preferences,
      quotes: useAppStore.getState().quotes,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `explorer-log-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-forest-900 mb-2">
          Settings
        </h1>
        <p className="text-earth-600">Manage your preferences and data</p>
      </div>

      {/* Preferences */}
      <Card>
        <h2 className="text-lg font-semibold text-earth-900 mb-4">
          Preferences
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2">
              Week starts on
            </label>
            <select
              value={preferences.weekStartsOn}
              onChange={(e) =>
                updatePreferences({ weekStartsOn: Number(e.target.value) as 0 | 1 })
              }
              className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
            >
              <option value={0}>Sunday</option>
              <option value={1}>Monday</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2">
              Default view
            </label>
            <select
              value={preferences.defaultView}
              onChange={(e) =>
                updatePreferences({
                  defaultView: e.target.value as 'dashboard' | 'quests' | 'discoveries',
                })
              }
              className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
            >
              <option value="dashboard">Dashboard</option>
              <option value="quests">Quests</option>
              <option value="discoveries">Discoveries</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card>
        <h2 className="text-lg font-semibold text-earth-900 mb-4">
          Data Management
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-earth-700 mb-2">
              Export Your Data
            </h3>
            <p className="text-sm text-earth-600 mb-3">
              Download a complete backup of all your quests, discoveries, and entries
              as a JSON file.
            </p>
            <Button onClick={handleExportData}>Export Data</Button>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card>
        <h2 className="text-lg font-semibold text-earth-900 mb-4">About</h2>
        <div className="text-sm text-earth-700 space-y-2">
          <p>
            <strong>Explorer's Log</strong> is a personal goal tracking application
            that frames life goals as expeditions and discoveries.
          </p>
          <p className="text-earth-600">
            Version 1.0.0 - Built with React, TypeScript, and Tailwind CSS
          </p>
        </div>
      </Card>
    </div>
  );
}
