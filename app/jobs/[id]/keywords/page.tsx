import { redirect } from 'next/navigation';
export default function KeywordsRedirect({ params }: { params: { id: string } }) {
  redirect(`/jobs/${params.id}/questions`);
}
