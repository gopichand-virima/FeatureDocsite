/**
 * ProgramProjectManagement Module - Version 6.1 Static MDX Imports
 * 
 * Static imports for actual MDX content (Strategy 1 - Highest Priority)
 * This ensures ProgramProjectManagement content loads instantly from bundled assets
 * 
 * Auto-generated: 2025-12-04T11:24:42.051Z
 * Total files: 5
 */

import aboutProgProjMngmnt6161 from '../../content/6_1/prog_proj_mngmnt_6_1/about_prog_proj_mngmnt_6_1.mdx?raw';
import programDashboard6161 from '../../content/6_1/prog_proj_mngmnt_6_1/program_dashboard_6_1.mdx?raw';
import programs6161 from '../../content/6_1/prog_proj_mngmnt_6_1/programs_6_1.mdx?raw';
import projectDashboard6161 from '../../content/6_1/prog_proj_mngmnt_6_1/project_dashboard_6_1.mdx?raw';
import projects6161 from '../../content/6_1/prog_proj_mngmnt_6_1/projects_6_1.mdx?raw';

/**
 * ProgramProjectManagement MDX Content Map
 * Maps file paths to actual MDX content (static imports)
 * This is used by contentLoader Strategy 1 for instant loading
 */
export const programprojectmanagementMDXContent: Record<string, string> = {
  '/content/6_1/prog_proj_mngmnt_6_1/about_prog_proj_mngmnt_6_1.mdx': aboutProgProjMngmnt6161,
  '/content/6_1/prog_proj_mngmnt_6_1/program_dashboard_6_1.mdx': programDashboard6161,
  '/content/6_1/prog_proj_mngmnt_6_1/programs_6_1.mdx': programs6161,
  '/content/6_1/prog_proj_mngmnt_6_1/project_dashboard_6_1.mdx': projectDashboard6161,
  '/content/6_1/prog_proj_mngmnt_6_1/projects_6_1.mdx': projects6161,
};

console.log(`✅ [ProgramProjectManagement MDX Content] Loaded ${Object.keys(programprojectmanagementMDXContent).length} static MDX files`);
