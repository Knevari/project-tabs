export interface Project {
  title: string;
  groupId: number;
  tabIds: number[];
}

export default class ProjectsService {
  static async getProjects() {
    const projects = (await chrome.storage.sync.get(["projects"])) as
      | Project[]
      | undefined;
    console.log({ projects });
    return Array.isArray(projects) ? projects : [];
  }

  static async addProject(project: Project) {
    const oldProjects = await this.getProjects();
    const newProjects = [...oldProjects, project];
    return chrome.storage.local.set({
      projects: newProjects,
    });
  }
}
