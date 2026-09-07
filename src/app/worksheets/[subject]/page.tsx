import { notFound } from "next/navigation";

import { getSubject } from "@/features/subjects/registry";

export default async function SubjectTemplatesPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject } = await params;
  const subjectDefinition = getSubject(subject);

  if (!subjectDefinition) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold">{subjectDefinition.name}</h1>
      <p className="mt-3 text-muted-foreground">模板将在此处显示。</p>
    </main>
  );
}
