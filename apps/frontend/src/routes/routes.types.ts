import { LazyExoticComponent } from 'react';

export interface RouteConfig {
  path: string;
  component: LazyExoticComponent<() => JSX.Element>;
  protected?: boolean;
  title?: string;
}