import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { loadSiteContent } from '@/cms/defaults';
import { persistSiteContent } from '@/cms/api';
import { createId } from '@/cms/images';
import type { Project } from '@/types/project';
import type { SiteContent } from '@/types/cms';

interface ContentContextValue {
  content: SiteContent;
  projects: Project[];
  saving: boolean;
  lastMessage: string;
  updateContent: (partial: Partial<SiteContent>) => Promise<void>;
  setProjects: (projects: Project[]) => Promise<void>;
  saveProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getProjectById: (id: string) => Project | undefined;
  getProjectBySlug: (slug: string) => Project | undefined;
  getFeaturedProjects: (limit?: number) => Project[];
  getRelatedProjects: (slug: string, limit?: number) => Project[];
  resetToDefaults: () => Promise<void>;
  replaceAll: (content: SiteContent) => Promise<void>;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() => loadSiteContent());
  const [saving, setSaving] = useState(false);
  const [lastMessage, setLastMessage] = useState('');

  const persist = useCallback(async (next: SiteContent) => {
    setSaving(true);
    setLastMessage('');
    try {
      const result = await persistSiteContent(next);
      setContent(result.content);
      setLastMessage(
        result.message ||
          (result.git?.committed
            ? 'Saved and committed to GitHub'
            : 'Saved to data/ JSON files'),
      );
    } catch (error) {
      // Keep optimistic local state so the admin can keep working,
      // but surface that the write failed.
      setContent(next);
      const message =
        error instanceof Error ? error.message : 'Failed to save content';
      setLastMessage(message);
      throw error;
    } finally {
      setSaving(false);
    }
  }, []);

  const updateContent = useCallback(
    async (partial: Partial<SiteContent>) => {
      await persist({ ...content, ...partial });
    },
    [content, persist],
  );

  const setProjects = useCallback(
    async (projects: Project[]) => {
      await persist({ ...content, projects });
    },
    [content, persist],
  );

  const saveProject = useCallback(
    async (project: Project) => {
      const exists = content.projects.some((p) => p.id === project.id);
      const projects = exists
        ? content.projects.map((p) => (p.id === project.id ? project : p))
        : [...content.projects, { ...project, id: project.id || createId() }];
      await persist({ ...content, projects });
    },
    [content, persist],
  );

  const deleteProject = useCallback(
    async (id: string) => {
      await persist({
        ...content,
        projects: content.projects.filter((p) => p.id !== id),
      });
    },
    [content, persist],
  );

  const getProjectById = useCallback(
    (id: string) => content.projects.find((p) => p.id === id),
    [content.projects],
  );

  const getProjectBySlug = useCallback(
    (slug: string) => content.projects.find((p) => p.slug === slug),
    [content.projects],
  );

  const getFeaturedProjects = useCallback(
    (limit = 3) => content.projects.slice(0, limit),
    [content.projects],
  );

  const getRelatedProjects = useCallback(
    (slug: string, limit = 2) =>
      content.projects.filter((p) => p.slug !== slug).slice(0, limit),
    [content.projects],
  );

  const resetToDefaults = useCallback(async () => {
    await persist(loadSiteContent());
  }, [persist]);

  const replaceAll = useCallback(
    async (next: SiteContent) => {
      await persist(next);
    },
    [persist],
  );

  const value = useMemo(
    () => ({
      content,
      projects: content.projects,
      saving,
      lastMessage,
      updateContent,
      setProjects,
      saveProject,
      deleteProject,
      getProjectById,
      getProjectBySlug,
      getFeaturedProjects,
      getRelatedProjects,
      resetToDefaults,
      replaceAll,
    }),
    [
      content,
      saving,
      lastMessage,
      updateContent,
      setProjects,
      saveProject,
      deleteProject,
      getProjectById,
      getProjectBySlug,
      getFeaturedProjects,
      getRelatedProjects,
      resetToDefaults,
      replaceAll,
    ],
  );

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error('useContent must be used within ContentProvider');
  }
  return ctx;
}
