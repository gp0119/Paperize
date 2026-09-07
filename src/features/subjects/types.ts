export const subjectIds = ["chinese", "math", "english"] as const;

export type SubjectId = (typeof subjectIds)[number];

export type TemplateDefinition = {
  id: string;
  name: string;
};

export type SubjectDefinition = {
  id: SubjectId;
  name: string;
  templates: readonly TemplateDefinition[];
};
