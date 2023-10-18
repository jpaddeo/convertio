import { BsImage, BsFileText, BsFileEarmark } from 'react-icons/bs';
import { LuFileAudio, LuFileVideo } from 'react-icons/lu';

export default function FilToIcon(filteType: string) {
  if (filteType.includes('video')) return <LuFileVideo />;
  if (filteType.includes('audio')) return <LuFileAudio />;
  if (filteType.includes('text')) return <BsFileText />;
  if (filteType.includes('image')) return <BsImage />;
  else return <BsFileEarmark />;
}
