import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useDiscoveryStore } from '../stores/useDiscoveryStore';
import { useDailyStore } from '../stores/useDailyStore';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { CreateDiscoveryInput, DiscoveryType } from '../types';
import { formatRelativeTime } from '../utils/helpers';

export function Discoveries() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { discoveries, addDiscovery, searchDiscoveries } = useDiscoveryStore();
  const { addDiscoveryToToday } = useDailyStore();

  const displayedDiscoveries = searchQuery
    ? searchDiscoveries(searchQuery)
    : discoveries;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-forest-900 mb-2">
            Discovery Log
          </h1>
          <p className="text-earth-600">Insights, learnings, and observations</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-5 w-5 mr-2" />
          New Discovery
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-earth-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-0 focus:ring-0 text-earth-900"
            placeholder="Search discoveries..."
          />
        </div>
      </Card>

      {/* Discovery List */}
      {displayedDiscoveries.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-earth-600 mb-4">
              {searchQuery
                ? 'No discoveries match your search.'
                : 'No discoveries yet. Start capturing your insights!'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Discovery
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayedDiscoveries.map((discovery) => (
            <Card key={discovery.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2 py-1 bg-sky-100 text-sky-700 rounded capitalize">
                    {discovery.type}
                  </span>
                  <span className="text-xs text-earth-500">
                    {formatRelativeTime(discovery.timestamp)}
                  </span>
                </div>
              </div>

              <p className="text-earth-800 leading-relaxed mb-3">
                {discovery.content}
              </p>

              {discovery.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {discovery.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-earth-100 text-earth-600 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Create Discovery Dialog */}
      <CreateDiscoveryDialog
        isOpen={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={(discovery) => {
          const newDiscovery = addDiscovery(discovery);
          addDiscoveryToToday(newDiscovery.id);
          setCreateDialogOpen(false);
        }}
      />
    </div>
  );
}

interface CreateDiscoveryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (discovery: CreateDiscoveryInput) => void;
}

function CreateDiscoveryDialog({
  isOpen,
  onClose,
  onSubmit,
}: CreateDiscoveryDialogProps) {
  const [content, setContent] = useState('');
  const [type, setType] = useState<DiscoveryType>('insight');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const discovery: CreateDiscoveryInput = {
      content,
      type,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      relatedQuests: [],
    };

    onSubmit(discovery);
    setContent('');
    setType('insight');
    setTags('');
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-6 border-b border-earth-200">
            <Dialog.Title className="text-lg font-semibold text-earth-900">
              New Discovery
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-earth-500 hover:text-earth-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as DiscoveryType)}
                className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
              >
                <option value="insight">Insight</option>
                <option value="learning">Learning</option>
                <option value="connection">Connection</option>
                <option value="observation">Observation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">
                Discovery *
              </label>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent resize-none"
                placeholder="What did you discover?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                placeholder="growth, insight, pattern"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-earth-200">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Discovery</Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
