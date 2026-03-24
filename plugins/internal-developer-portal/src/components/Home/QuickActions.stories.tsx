import { MemoryRouter } from 'react-router-dom';
import { QuickActions } from './QuickActions';
import { quickActions } from '../../mockData';

export default {
  title: 'Internal Developer Portal/Home/QuickActions',
  component: QuickActions,
};

export const Default = () => {
  return (
    <MemoryRouter>
      <QuickActions actions={quickActions} />
    </MemoryRouter>
  );
};
