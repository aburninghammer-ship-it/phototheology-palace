import React, { useEffect, useRef, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { usePreservePageState } from "@/contexts/PageStateContext";

interface PagePersistenceWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper component that automatically preserves page state.
 * Wrap your page content with this to get automatic scroll position persistence.
 *
 * For form/input state persistence, use usePersistedState hook in your components.
 */
export const PagePersistenceWrapper: React.FC<PagePersistenceWrapperProps> = ({ children }) => {
  // This automatically handles scroll position preservation
  usePreservePageState();

  return <>{children}</>;
};

/**
 * Higher-order component that adds page persistence to any component.
 * Use this to wrap lazy-loaded page components.
 */
export function withPagePersistence<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> {
  const WithPersistence: React.FC<P> = (props) => {
    usePreservePageState();
    return <WrappedComponent {...props} />;
  };

  WithPersistence.displayName = `withPagePersistence(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return WithPersistence;
}

export default PagePersistenceWrapper;
