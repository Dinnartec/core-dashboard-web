-- ============================================
-- Seed Data
-- ============================================

-- Roles
INSERT INTO roles (name, description) VALUES
  ('admin', 'Full access to all features'),
  ('member', 'Can view and edit assigned projects'),
  ('viewer', 'Read-only access');

-- Verticals
INSERT INTO verticals (slug, name, description, display_order) VALUES
  ('core', 'Core', 'Internal infrastructure and shared resources', 1),
  ('solutions', 'Dinnartec Solutions', 'Client services and consulting', 2),
  ('factory', 'Dinnartec Factory', 'Proprietary products', 3),
  ('labs', 'Dinnartec Labs', 'Research and development', 4);

-- Project Statuses
INSERT INTO project_statuses (slug, name, color, display_order) VALUES
  ('planning', 'Planning', '#6B7280', 1),
  ('in_progress', 'In Progress', '#3B82F6', 2),
  ('paused', 'Paused', '#F59E0B', 3),
  ('launched', 'Launched', '#10B981', 4),
  ('archived', 'Archived', '#9CA3AF', 5);
