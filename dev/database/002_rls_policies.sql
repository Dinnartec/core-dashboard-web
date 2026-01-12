-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE verticals ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_repos ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE solutions_metadata ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Helper function to check if user is admin
-- ============================================

CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.id = user_id AND r.name = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ROLES policies (read-only for authenticated)
-- ============================================

CREATE POLICY "Authenticated users can view roles"
  ON roles FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- VERTICALS policies (read-only for authenticated)
-- ============================================

CREATE POLICY "Authenticated users can view verticals"
  ON verticals FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- PROJECT_STATUSES policies (read-only for authenticated)
-- ============================================

CREATE POLICY "Authenticated users can view project statuses"
  ON project_statuses FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- USERS policies
-- ============================================

-- All authenticated users can view active users
CREATE POLICY "Authenticated users can view active users"
  ON users FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admins can insert new users
CREATE POLICY "Admins can insert users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

-- Admins can update any user
CREATE POLICY "Admins can update any user"
  ON users FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));

-- ============================================
-- PROJECTS policies
-- ============================================

-- All authenticated users can view active projects
CREATE POLICY "Authenticated users can view active projects"
  ON projects FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Admins can insert projects
CREATE POLICY "Admins can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

-- Members can insert projects
CREATE POLICY "Members can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = auth.uid() AND r.name IN ('admin', 'member')
    )
  );

-- Admins can update any project
CREATE POLICY "Admins can update any project"
  ON projects FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Team members can update assigned projects
CREATE POLICY "Team members can update assigned projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.project_id = projects.id
      AND team_members.user_id = auth.uid()
    )
  );

-- Only admins can delete (soft delete) projects
CREATE POLICY "Admins can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- ============================================
-- PROJECT_REPOS policies
-- ============================================

CREATE POLICY "Authenticated users can view repos"
  ON project_repos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_repos.project_id
      AND projects.is_active = true
    )
  );

CREATE POLICY "Admins and team members can manage repos"
  ON project_repos FOR ALL
  TO authenticated
  USING (
    is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.project_id = project_repos.project_id
      AND team_members.user_id = auth.uid()
    )
  );

-- ============================================
-- PROJECT_LINKS policies
-- ============================================

CREATE POLICY "Authenticated users can view links"
  ON project_links FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_links.project_id
      AND projects.is_active = true
    )
  );

CREATE POLICY "Admins and team members can manage links"
  ON project_links FOR ALL
  TO authenticated
  USING (
    is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.project_id = project_links.project_id
      AND team_members.user_id = auth.uid()
    )
  );

-- ============================================
-- TEAM_MEMBERS policies
-- ============================================

CREATE POLICY "Authenticated users can view team members"
  ON team_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage team members"
  ON team_members FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- ============================================
-- SOLUTIONS_METADATA policies
-- ============================================

CREATE POLICY "Authenticated users can view solutions metadata"
  ON solutions_metadata FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = solutions_metadata.project_id
      AND projects.is_active = true
    )
  );

CREATE POLICY "Admins and team members can manage solutions metadata"
  ON solutions_metadata FOR ALL
  TO authenticated
  USING (
    is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.project_id = solutions_metadata.project_id
      AND team_members.user_id = auth.uid()
    )
  );
