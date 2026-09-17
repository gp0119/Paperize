import { notFound } from "next/navigation";
import { PenControlThumbnail } from "@/features/subjects/chinese/templates/pen-control/thumbnail";
import { StrokeOrderThumbnail } from "@/features/subjects/chinese/templates/stroke-order/thumbnail";

import { BlankTianZiGeThumbnail } from "@/features/subjects/chinese/templates/blank-tian-zi-ge/thumbnail";
import { BlankFourLineThumbnail } from "@/features/subjects/english/templates/blank-four-line/thumbnail";
import { getSubject } from "@/features/subjects/registry";
import { TemplateCard } from "@/features/subjects/template-card";
import { BreakTenThumbnail } from "@/features/subjects/math/templates/break-ten/thumbnail";
import { MakeTenThumbnail } from "@/features/subjects/math/templates/make-ten/thumbnail";
import { ArithmeticThumbnail } from "@/features/subjects/math/templates/arithmetic/thumbnail";
import { NumberPracticeThumbnail } from "@/features/subjects/math/templates/number-practice/thumbnail";

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
                subject === "chinese" && template.id === "pen-control" ? <PenControlThumbnail /> :
                subject === "chinese" && template.id === "stroke-order" ? <StrokeOrderThumbnail /> :
                subject === "chinese" && template.id === "blank-tian-zi-ge" ? <BlankTianZiGeThumbnail /> :
                subject === "english" && template.id === "blank-four-line" ? <BlankFourLineThumbnail /> :
                subject === "math" && template.id === "break-ten" ? <BreakTenThumbnail /> :
                subject === "math" && template.id === "make-ten" ? <MakeTenThumbnail /> :
                subject === "math" && template.id === "number-practice" ? <NumberPracticeThumbnail /> :
                subject === "math" && template.id === "within-twenty" ? <ArithmeticThumbnail maximum={20} /> :
                subject === "math" && template.id === "within-ten" ? <ArithmeticThumbnail maximum={10} /> : null
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
