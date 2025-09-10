export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  subject?: string;
  batch?: string;
}

export interface StudyMaterialsStore {
  materials: StudyMaterial[];
}