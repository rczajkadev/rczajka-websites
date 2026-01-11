import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-start justify-center gap-6">
      <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">404</p>
      <h1 className="text-4xl font-semibold text-white">This page went quiet.</h1>
      <p className="max-w-md text-sm text-neutral-300">
        The page you are looking for does not exist. Try the archive instead.
      </p>
      <Link href="/" className={buttonVariants({ size: 'lg' })}>
        Go home
      </Link>
    </div>
  );
}
