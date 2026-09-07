import { notFound } from "next/navigation";

import { BlankTianZiGeThumbnail } from "@/features/subjects/chinese/templates/blank-tian-zi-ge/thumbnail";
import { getSubject } from "@/features/subjects/registry";
import { TemplateCard } from "@/features/subjects/template-card";
import { WithinTenThumbnail } from "@/features/subjects/math/templates/within-ten/thumbnail";

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
        <div className="mt-6 grid items-start gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {subjectDefinition.templates.map((template) => (
            <TemplateCard
              key={template.id}
              subject={subjectDefinition.id}
              template={template}
              preview={
                subject === "chinese" && template.id === "blank-tian-zi-ge" ? <BlankTianZiGeThumbnail /> :
                subject === "math" && template.id === "within-ten" ? <WithinTenThumbnail /> : null
              }
            />
          ))}
        </div>
      ) : (
        <p className="mt-3 text-muted-foreground">模板将在此处显示。</p>
      )}
    </main>
  );
}
