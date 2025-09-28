export interface ROM {
  id: string;
  name: string;
  platform: string;
  region: string;
  language: string;
  size: string;
  description: string;
  download_url: string;
  image_url: string;
}

export interface Platform {
  id: string;
  name: string;
  short_name: string;
}

export interface DownloadProgress {
  status: 'starting' | 'downloading' | 'completed' | 'error';
  progress: number;
  total_size: number;
  downloaded_size: number;
  filename: string;
  final_path?: string;
  error?: string;
}

export interface LocalROM {
  name: string;
  platform: string;
  path: string;
  size: number;
  modified: number;
}

export interface Settings {
  auto_organize: boolean;
  auto_launch: boolean;
  preferred_emulator: string;
  download_concurrent_limit: number;
  regions: string[];
  languages: string[];
}

export interface EmulatorStatus {
  [key: string]: boolean;
}