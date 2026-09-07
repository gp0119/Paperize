import { notFound } from "next/navigation";

import { TemplateWorkspace } from "@/features/builder/template-workspace";
import { getSubject } from "@/features/subjects/registry";

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ subject: string; templateId: string }>;
}) {
  const { subject, templateId } = await params;
  const subjectDefinition = getSubject(subject);
  const template = subjectDefinition?.templates.find(
    (candidate) => candidate.id === templateId,
  );

  if (!subjectDefinition || !template) {
    notFound();
  }

  return (
    <TemplateWorkspace
      title={`${subjectDefinition.name} · ${template.name}`}
      configuration={
        <p className="text-sm text-muted-foreground">模板配置将在此处显示。</p>
      }
      preview={
        <p className="text-sm text-muted-foreground">练习预览将在此处显示。</p>
      }
    />
  );
}
