import { BaseComponent, ComponentStyles } from "./component.model";

export interface Page {
  id: string;
  title: string;
  components: BaseComponent[];
  styles?: ComponentStyles;
  createdAt?: Date;
  updatedAt?: Date;
}