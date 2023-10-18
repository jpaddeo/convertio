export type Action = {
  file: any;
  fileName: string;
  fileSize: number;
  fileType: string;
  from: string;
  to: string | null;
  isConverting?: boolean;
  isConverted?: boolean;
  isError?: boolean;
  url?: any;
  output?: any;
};
