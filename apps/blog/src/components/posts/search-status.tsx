type SearchStatusProps = {
  loading: boolean;
  isEmpty: boolean;
};

const baseClasses =
  'rounded-3xl border border-white/10 bg-neutral-900/50 p-8 text-sm text-neutral-400';

export const SearchStatus = ({ loading, isEmpty }: SearchStatusProps) => {
  if (loading) {
    return <div className={baseClasses}>Loading search index...</div>;
  }

  if (isEmpty) {
    return <div className={baseClasses}>No posts match the current filters.</div>;
  }

  return null;
};
