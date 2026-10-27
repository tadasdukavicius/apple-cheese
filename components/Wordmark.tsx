import { SITE_NAME } from '../lib/site';

function AppleMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 8.2c-1.5-1.3-4.6-1.5-6 1.2-1.6 3 .2 8.6 2.9 10.1 1 .5 2 .1 3.1-.5 1.1.6 2.1 1 3.1.5 2.7-1.5 4.5-7.1 2.9-10.1-1.4-2.7-4.5-2.5-6-1.2z" />
      <path d="M12 8.2c0-1.7.7-3.1 2-4" />
      <path d="M12.4 5.6c.9-1.3 2.5-1.7 3.9-1.2-.3 1.4-1.9 2.4-3.9 1.2z" />
    </svg>
  );
}

export default function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 whitespace-nowrap text-ink ${className}`}>
      <AppleMark className="h-6 w-6 text-brand" />
      <span className="font-display text-[15px] font-semibold uppercase tracking-[0.16em] md:text-base">
        {SITE_NAME}
      </span>
    </span>
  );
}
