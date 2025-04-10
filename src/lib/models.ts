interface PrivateStep {
  value: string;
  state: "current" | "hidden" | "past";
  typeOut?: boolean;
  tag: string;
}

export interface Step extends PrivateStep {
  output?: PrivateStep;
}
