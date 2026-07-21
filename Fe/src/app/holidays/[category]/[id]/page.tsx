import { redirect } from 'next/navigation';

export default async function PackageDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  redirect(`/tour-packages/${resolvedParams.id}`);
}
