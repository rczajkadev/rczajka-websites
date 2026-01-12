import { Input } from '@/components/ui/input';

type SearchInputProps = {
  id?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
};

export const SearchInput = ({
  id = 'search',
  placeholder = 'Search... (tip: tag:design cat:product -tag:old)',
  value,
  onChange
}: SearchInputProps) => {
  return (
    <div className="relative">
      <Input
        id={id}
        className="pr-10"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="20" y1="20" x2="16.65" y2="16.65" />
      </svg>
    </div>
  );
};
