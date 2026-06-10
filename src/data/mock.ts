import type { Funcionalidad, Beneficio } from "@/types";

export const funcionalidades: Funcionalidad[] = [
  { id: "1", icon: "Shield" },
  { id: "2", icon: "DollarSign" },
  { id: "3", icon: "MessageSquare" },
  { id: "4", icon: "BarChart2" },
  { id: "5", icon: "CalendarDays" },
  { id: "6", icon: "Users" },
];

export const beneficios: Beneficio[] = [
  { id: "1", icon: "Zap",         destacado: false },
  { id: "2", icon: "Eye",         destacado: false },
  { id: "3", icon: "Bell",        destacado: false },
  { id: "4", icon: "BarChart2",   destacado: false },
  { id: "5", icon: "CheckCheck",  destacado: false },
  { id: "6", icon: "LayoutGrid",  destacado: true },
];
