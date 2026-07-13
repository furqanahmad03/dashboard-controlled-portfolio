import { ReactElement } from "react";

export interface TechnologyItem {
  name: string;
  icon: ReactElement;
  color: string;
}

export interface TechnologyCategory {
  icon: ReactElement;
  category: string;
  color: string;
  items: TechnologyItem[];
}