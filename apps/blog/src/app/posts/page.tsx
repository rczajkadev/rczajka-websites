import { redirect } from 'next/navigation';

export const dynamic = 'error';
export const revalidate = false;

export default function PostsPage() {
  redirect('/');
}
