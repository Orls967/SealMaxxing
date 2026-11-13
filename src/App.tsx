import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { UI } from '@/content/ui';
import { useHashView } from '@/store/useHashView';
import { AppShell } from '@/ui/AppShell';

const GaragePage = lazy(() => import('./pages/GaragePage'));
const DissectPage = lazy(() => import('./pages/DissectPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const DataPage = lazy(() => import('./pages/DataPage'));
const DuelPage = lazy(() => import('./pages/DuelPage'));
const GlossaryPage = lazy(() => import('./pages/GlossaryPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export function App() {
  useHashView();
  return (
    <AppShell>
      <Suspense fallback={<p className="p-6 text-muted">{UI.app.loading}</p>}>
        <Routes>
          <Route path="/" element={<GaragePage />} />
          <Route path="/bedah" element={<Navigate to="/bedah/seal" replace />} />
          <Route path="/bedah/:carId" element={<DissectPage />} />
          <Route path="/banding/:systemId?" element={<ComparePage />} />
          <Route path="/data" element={<DataPage />} />
          <Route path="/adu" element={<DuelPage />} />
          <Route path="/glosarium" element={<GlossaryPage />} />
          <Route path="/tentang" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}
