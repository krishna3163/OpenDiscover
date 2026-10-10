import React from 'react';
import { ProjectExplorer } from '../components/ProjectExplorer';
import { getProjectsByCategory } from '../lib/catalog';
import type { CategoryName } from '../types';

interface CategoryPageProps {
  title: string;
  description: string;
  filterCategory: CategoryName;
  icon?: string;
}

/**
 * Category listing page. All six category routes render this component with a
 * different `filterCategory` (see `CATEGORY_ROUTES` in `src/lib/routes.ts`).
 */
export const CategoryPage: React.FC<CategoryPageProps> = ({ title, description, filterCategory, icon }) => {
  const total = getProjectsByCategory(filterCategory).length;

  return (
    <div className="category-page">
      <header className="container page-head">
        <div>
          {icon && (
            <span className="page-icon" aria-hidden="true">
              {icon}
            </span>
          )}
          <h1>{title}</h1>
          <p className="page-subtitle">{description}</p>
          <p className="page-count">
            {total} curated {total === 1 ? 'project' : 'projects'} · official sources only
          </p>
        </div>
      </header>

      <ProjectExplorer category={filterCategory} pageSize={12} />
    </div>
  );
};

export default CategoryPage;
