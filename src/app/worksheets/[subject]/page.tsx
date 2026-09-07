import { notFound } from "next/navigation";
import Link from "next/link";

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
      {subjectDefinition.templates.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {subjectDefinition.templates.map((template) => (
            <Link
              key={template.id}
              href={`/worksheets/${subject}/${template.id}`}
              className="rounded-xl border p-6 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <h2 className="text-lg font-medium">{template.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">配置题目，生成 A4 练习纸 →</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-muted-foreground">模板将在此处显示。</p>
      )}
    </main>
  );
}
