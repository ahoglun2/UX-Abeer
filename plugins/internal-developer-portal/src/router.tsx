import { Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from './components/Home/HomePage';
import { ApiHubPage } from './pages/ApiHubPage';
import { CatalogTemplatePage } from './pages/CatalogTemplatePage';
import { DocsHubPage } from './pages/DocsHubPage';
import { PlaylistsPage } from './pages/PlaylistsPage';
import { TechRadarPage } from './pages/TechRadarPage';
import { ToolBoxPage } from './pages/ToolBoxPage';

export const DevPortalRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalog" element={<CatalogTemplatePage />} />
      <Route path="/apis" element={<ApiHubPage />} />
      <Route path="/docs" element={<DocsHubPage />} />
      <Route path="/toolbox" element={<ToolBoxPage />} />
      <Route path="/playlists" element={<PlaylistsPage />} />
      <Route path="/radar" element={<TechRadarPage />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
};
