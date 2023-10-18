import { useEffect, useRef, useState } from 'react';

import { FFmpeg } from '@ffmpeg/ffmpeg';

import { loadFfmpeg } from '@/utils';

export default function useFFmpeg() {
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const init = async () => {
    const ffmpegRes: FFmpeg = await loadFfmpeg();
    ffmpegRef.current = ffmpegRes;
    setIsLoaded(true);
  };

  useEffect(() => {
    init();
  }, []);

  return { isLoaded, ffmpegRef };
}
