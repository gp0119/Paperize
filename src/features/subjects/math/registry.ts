import type { TemplateDefinition } from "../types";

export const mathTemplates: readonly TemplateDefinition[] = [
  { id: "number-practice", name: "数字练习", tags: ["幼小衔接", "0～9", "描红"] },
  { id: "break-ten", name: "破十法", tags: ["一年级", "20以内", "退位减法"] },
  { id: "make-ten", name: "凑十法", tags: ["一年级", "20以内", "进位加法"] },
  { id: "within-twenty", name: "20 以内加减法", tags: ["一年级", "20以内", "口算"] },
  { id: "within-ten", name: "10 以内加减法", tags: ["幼小衔接", "10以内", "启蒙"] },
];
