import { MemoryRouter } from 'react-router-dom';
import { Recommendations } from './Recommendations';
import { recommendations } from '../../mockData';

export default {
  title: 'Internal Developer Portal/Home/Recommendations',
  component: Recommendations,
};

export const Default = () => {
  return (
    <MemoryRouter>
      <Recommendations items={recommendations} query="" />
    </MemoryRouter>
  );
};
