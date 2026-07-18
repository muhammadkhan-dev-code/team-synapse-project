import { Star, Check, X } from 'lucide-react';

function AvatarPlaceholder({ name, size = 'md' }) {
  const initials = name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '?';
  const sizeClasses = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm' };
  const colors = ['bg-blue-500', 'bg-violet-500', 'bg-teal-500', 'bg-indigo-500'];
  const colorIdx = (name?.charCodeAt(0) || 0) % colors.length;
  return (
    <div className={`${sizeClasses[size]} ${colors[colorIdx]} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}>
      {initials}
    </div>
  );
}

export default function ParticipantRow({ participant, onAccept, onDecline, loading }) {
  const { user, status } = participant;
  const isPending = status === 'pending';
  const isAccepted = status === 'accepted';

  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
      <div className="flex items-center gap-3">
        <AvatarPlaceholder name={user?.name} />
        <div>
          <p className="font-semibold text-[#0A1F44] text-sm">{user?.name}</p>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{user?.rating?.toFixed(1)}</span>
            <span className="mx-1">·</span>
            <span>{user?.totalRides} Rides</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isPending && (
          <>
            <button
              id={`decline-${user?.id}`}
              onClick={() => onDecline?.(user?.id)}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-100 hover:border-slate-400 transition-all disabled:opacity-50"
            >
              <X className="w-3.5 h-3.5" /> Decline
            </button>
            <button
              id={`accept-${user?.id}`}
              onClick={() => onAccept?.(user?.id)}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-[#0A1F44] hover:bg-[#0d2a5c] text-white rounded-lg transition-all shadow disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" /> Accept
            </button>
          </>
        )}
        {isAccepted && (
          <span className="px-4 py-2 text-sm font-semibold text-[#2563EB] bg-blue-50 border border-blue-100 rounded-lg">
            ✓ Accepted
          </span>
        )}
      </div>
    </div>
  );
}
