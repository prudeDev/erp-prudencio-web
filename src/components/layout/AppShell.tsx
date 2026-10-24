import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { Sidebar } from './Sidebar';

export function AppShell() {
  const { pathname } = useLocation();
  const main = useRef<HTMLElement>(null);
  useEffect(() => { main.current?.scrollTo(0, 0); }, [pathname]);

  return (
    <div className="app-root">
      <div className="app-shell">
        <div className="app-side"><Sidebar /></div>
        <main ref={main} className={'app-main' + (pathname === '/' ? ' compacto' : '')}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
