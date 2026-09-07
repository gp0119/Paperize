import { notFound } from "next/navigation";
import { StrokeOrderTemplate } from "@/features/subjects/chinese/templates/stroke-order/template";

import { BlankTianZiGeTemplate } from "@/features/subjects/chinese/templates/blank-tian-zi-ge/template";
import { WithinTenTemplate } from "@/features/subjects/math/templates/within-ten/template";
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

  if (subject === "chinese" && template.id === "blank-tian-zi-ge") {
    return <BlankTianZiGeTemplate />;
  }

  if (subject === "chinese" && template.id === "stroke-order") {
    return <StrokeOrderTemplate />;
  }

  if (subject === "math" && template.id === "within-ten") {
    return <WithinTenTemplate />;
  }

  notFound();
}
