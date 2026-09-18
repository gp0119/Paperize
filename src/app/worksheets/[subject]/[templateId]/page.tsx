import { notFound } from "next/navigation";
import { PenControlTemplate } from "@/features/subjects/chinese/templates/pen-control/template";
import { StrokeOrderTemplate } from "@/features/subjects/chinese/templates/stroke-order/template";

import { BlankTianZiGeTemplate } from "@/features/subjects/chinese/templates/blank-tian-zi-ge/template";
import { BlankFourLineTemplate } from "@/features/subjects/english/templates/blank-four-line/template";
import { BreakTenTemplate } from "@/features/subjects/math/templates/break-ten/template";
import { MakeTenTemplate } from "@/features/subjects/math/templates/make-ten/template";
import { ArithmeticTemplate } from "@/features/subjects/math/templates/arithmetic/template";
import { NumberPracticeTemplate } from "@/features/subjects/math/templates/number-practice/template";
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

  if (subject === "chinese" && template.id === "pen-control") {
    return <PenControlTemplate />;
  }

  if (subject === "chinese" && template.id === "stroke-order") {
    return <StrokeOrderTemplate />;
  }

  if (subject === "english" && template.id === "blank-four-line") {
    return <BlankFourLineTemplate />;
  }

  if (subject === "math" && template.id === "break-ten") {
    return <BreakTenTemplate />;
  }

  if (subject === "math" && template.id === "make-ten") {
    return <MakeTenTemplate />;
  }

  if (subject === "math" && template.id === "within-ten") {
    return <ArithmeticTemplate key={template.id} maximum={10} />;
  }

  if (subject === "math" && template.id === "number-practice") {
    return <NumberPracticeTemplate />;
  }

  if (subject === "math" && template.id === "within-twenty") {
    return <ArithmeticTemplate key={template.id} maximum={20} />;
  }

  notFound();
}
