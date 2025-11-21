export interface FinderFile {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number; // bytes
  modified?: string; // ISO date
  children?: FinderFile[]; // for folders
  ext?: string; // extension for files
  // Optional embedded content for preview (e.g., small text/markdown/json)
  content?: string;
  // For media previews (image/audio/video) a placeholder URI or data
  uri?: string;
  // Hint for renderer if needed
  mime?: string;

  /** Optional color tags for filtering (matches sidebar tag ids) */
  tags?: string[];
}
