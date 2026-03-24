import { MemoryRouter } from 'react-router-dom';
import { Recent } from './Recent';
import { pinnedItems, recentItems } from '../../mockData';

export default {
  title: 'Internal Developer Portal/Home/Recent',
  component: Recent,
};

export const Default = () => {
  return (
    <MemoryRouter>
      <Recent recent={recentItems} pinned={pinnedItems} />
    </MemoryRouter>
  );
};
