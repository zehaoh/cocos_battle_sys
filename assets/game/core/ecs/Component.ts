export interface Component {
  readonly type: string;
}

export type ComponentCtor<T extends Component> = new (...args: any[]) => T;

export abstract class BaseComponent implements Component {
  public abstract readonly type: string;
}
