import { Quest } from '../../types';

interface ProgressTrailProps {
  quest: Quest;
}

export function ProgressTrail({ quest }: ProgressTrailProps) {
  if (quest.type !== 'summit' || !quest.waypoints) {
    return null;
  }

  const waypoints = quest.waypoints.sort((a, b) => a.order - b.order);
  const progress = quest.progress || 0;

  return (
    <div className="relative py-8">
      {/* Trail Line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-earth-200" />
      <div
        className="absolute left-4 top-0 w-0.5 bg-forest-600 transition-all duration-500"
        style={{ height: `${progress}%` }}
      />

      {/* Waypoints */}
      <div className="space-y-6">
        {waypoints.map((waypoint, index) => (
          <div key={waypoint.id} className="relative flex items-start">
            {/* Marker */}
            <div className="relative z-10">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  waypoint.completed
                    ? 'bg-forest-600 border-forest-600'
                    : 'bg-white border-earth-300'
                }`}
              >
                {waypoint.completed && (
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="ml-4 flex-1">
              <h4
                className={`font-medium ${
                  waypoint.completed ? 'text-forest-900' : 'text-earth-700'
                }`}
              >
                {waypoint.title}
              </h4>
              {waypoint.description && (
                <p className="text-sm text-earth-600 mt-1">
                  {waypoint.description}
                </p>
              )}
              {waypoint.completedAt && (
                <p className="text-xs text-forest-600 mt-1">
                  Completed {new Date(waypoint.completedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
