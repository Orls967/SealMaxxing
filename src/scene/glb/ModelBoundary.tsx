import { Component, type ReactNode } from 'react';

// React only offers error boundaries as classes, hence the one class component in the app.
/** Falls back to the procedural body when a model file is missing or cannot be decoded. */
export class ModelBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  render(): ReactNode {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
