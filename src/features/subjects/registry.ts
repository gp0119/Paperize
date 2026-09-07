import { chineseTemplates } from "./chinese/registry";
import { englishTemplates } from "./english/registry";
import { mathTemplates } from "./math/registry";
import type { SubjectDefinition } from "./types";

export const subjects = [
  { id: "chinese", name: "语文", templates: chineseTemplates },
  { id: "math", name: "数学", templates: mathTemplates },
  { id: "english", name: "英语", templates: englishTemplates },
] as const satisfies readonly SubjectDefinition[];

export function getSubject(id: string) {
  return subjects.find((subject) => subject.id === id);
}
