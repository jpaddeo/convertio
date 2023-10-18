import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

import { Action } from '@/types';

function getFileExtension(fileName: string) {
  const regex = /(?:\.([^.]+))?$/; // Matches the last dot and everything after it
  const match = regex.exec(fileName);
  if (match && match[1]) {
    return match[1];
  }
  return ''; // No file extension found
}

function removeFileExtension(fileName: string) {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    return fileName.slice(0, lastDotIndex);
  }
  return fileName; // No file extension found
}

export default async function convert(
  ffmpeg: FFmpeg | null,
  action: Action
): Promise<any> {
  if (ffmpeg === null) return console.error('ffmpeg not loaded');
  const { file, to, fileName, fileType } = action;
  const input = getFileExtension(fileName);
  const output = `${removeFileExtension(fileName)}.${to}`;
  ffmpeg.writeFile(input, await fetchFile(file));

  // FFMEG COMMANDS
  let ffmpegCmd: any = [];
  // 3gp video
  if (to === '3gp')
    ffmpegCmd = [
      '-i',
      input,
      '-r',
      '20',
      '-s',
      '352x288',
      '-vb',
      '400k',
      '-acodec',
      'aac',
      '-strict',
      'experimental',
      '-ac',
      '1',
      '-ar',
      '8000',
      '-ab',
      '24k',
      output,
    ];
  else ffmpegCmd = ['-i', input, output];

  // execute cmd
  await ffmpeg.exec(ffmpegCmd);

  const data = (await ffmpeg.readFile(output)) as any;
  const blob = new Blob([data], { type: fileType.split('/')[0] });
  const url = URL.createObjectURL(blob);
  return { url, output };
}
