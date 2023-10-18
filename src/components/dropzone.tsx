'use client';

import { useCallback, useEffect, useState } from 'react';

import ReactDropzone from 'react-dropzone';

import { BsUpload } from 'react-icons/bs';
import { GoFileSymlinkFile } from 'react-icons/go';
import { BiError } from 'react-icons/bi';
import { MdDone, MdClose } from 'react-icons/md';
import { ImSpinner3 } from 'react-icons/im';
import { HiOutlineDownload } from 'react-icons/hi';

import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import useFFmpeg from '@/hooks/useFFmpeg';
import FilToIcon from '@/lib/filt-to-icon';

import { Action } from '@/types';
import { convert, humanizeBytes } from '@/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const ACCEPTED_FILES = {
  'image/*': [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.bmp',
    '.webp',
    '.ico',
    '.tif',
    '.tiff',
    '.raw',
    '.tga',
  ],
  'audio/*': [],
  'video/*': [],
};

const EXTENSIONS = {
  image: [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'bmp',
    'webp',
    'ico',
    'tif',
    'tiff',
    'svg',
    'raw',
    'tga',
  ],
  video: [
    'mp4',
    'm4v',
    'mp4v',
    '3gp',
    '3g2',
    'avi',
    'mov',
    'wmv',
    'mkv',
    'flv',
    'ogv',
    'webm',
    'h264',
    '264',
    'hevc',
    '265',
  ],
  audio: ['mp3', 'wav', 'ogg', 'aac', 'wma', 'flac', 'm4a'],
};

export default function DropZone() {
  const [isHovered, setIsHovered] = useState(false);
  const [files, setFiles] = useState<Array<any>>([]);
  const [actions, setActions] = useState<Array<Action>>([]);
  const [defaultValues, setDefaultValues] = useState<string>('video');
  const [selected, setSelected] = useState<string>('...');

  const [isDone, setIsDone] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const { ffmpegRef, isLoaded } = useFFmpeg();

  const handleDragHover = () => {
    setIsHovered(true);
  };
  const handleDragLeave = () => {
    setIsHovered(false);
  };

  const handleDrop = (data: Array<any>) => {
    handleDragLeave();
    setFiles(data);
    const tempActions: Action[] = [];
    data.forEach((file) => {
      tempActions.push({
        file,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        from: file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2),
        to: null,
        isConverted: false,
        isConverting: false,
        isError: false,
      });
    });
    setActions(tempActions);
  };

  const handleOnDropRejectedOrError = () => {
    handleDragLeave();
    toast({
      variant: 'destructive',
      title: 'Error uploading your file(s)',
      description:
        'Allowed file types: audio, video and images. Please try again.',
      duration: 4000,
    });
  };

  const updateAction = useCallback(
    (fileName: string, to: string) => {
      setActions(
        actions.map((action: Action) => {
          if (action.fileName === fileName) {
            return {
              ...action,
              to,
            };
          }
          return action;
        })
      );
    },
    [actions]
  );

  const deleteAction = useCallback(
    (action: Action) => {
      setActions(actions.filter((elt) => elt.fileName !== action.fileName));
      setFiles(files.filter((f) => f.name !== action.fileName));
    },
    [actions, files]
  );

  const downloadAction = useCallback((action: Action) => {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = action.url;
    a.download = action.output;

    document.body.appendChild(a);
    a.click();

    URL.revokeObjectURL(action.url);
    document.body.removeChild(a);
  }, []);

  const convertAction = useCallback(async () => {
    let tempActions = actions.map((ac) => ({ ...ac, isConverting: true }));
    setActions(tempActions);
    setIsConverting(true);
    for (let action of tempActions) {
      try {
        const { url, output } = await convert(ffmpegRef.current, action);
        tempActions = tempActions.map((ac) =>
          ac === action
            ? { ...ac, isConverting: false, isConverted: true, url, output }
            : ac
        );
      } catch (err) {
        tempActions = tempActions.map((ac) =>
          ac === action
            ? { ...ac, isConverting: false, isConverted: false, isError: true }
            : ac
        );
      }
      setActions(tempActions);
    }
    setIsDone(true);
    setIsConverting(false);
  }, [actions, ffmpegRef]);

  const downloadAllAction = useCallback(() => {
    for (let action of actions) {
      !action.isError && downloadAction(action);
    }
  }, [actions, downloadAction]);

  const resetAction = useCallback(() => {
    setIsDone(false);
    setActions([]);
    setFiles([]);
    setIsReady(false);
    setIsConverting(false);
  }, []);

  const checkIsReady = useCallback(() => {
    setIsReady(actions.every((action) => action.to !== null));
  }, [actions]);

  useEffect(() => {
    if (!actions.length) {
      setIsDone(false);
      setFiles([]);
      setIsReady(false);
      setIsConverting(false);
    } else {
      checkIsReady();
    }
  }, [actions, checkIsReady]);

  if (actions.length > 0) {
    return (
      <div className='space-y-6'>
        {actions.map((action: Action, idx: number) => (
          <div
            key={`${idx}${action.fileName}`}
            className='w-full py-4 space-y-2 lg:py-0 relative cursor-pointer rounded-xl border h-fit lg:h-20 px-4 lg:px-10 flex flex-wrap lg:flex-nowrap items-center justify-between'
          >
            {!isLoaded && (
              <Skeleton className='h-full w-full -ml-10 cursor-progress absolute rounded-xl' />
            )}
            <div className='flex gap-4 items-center'>
              <span className='text-2xl text-orange-600'>
                {FilToIcon(action.fileType)}
              </span>
              <div className='flex items-center gap-1 w-96'>
                <span className='text-md font-medium overflow-x-hidden'>
                  {action.fileName}
                </span>
                <span className='text-gray-400 text-sm'>
                  ({humanizeBytes(action.fileSize)})
                </span>
              </div>
            </div>

            {action.isError ? (
              <Badge variant='destructive' className='flex gap-2'>
                <span>Error converting File</span>
                <BiError />
              </Badge>
            ) : action.isConverted ? (
              <Badge variant='default' className='flex gap-2 bg-green-400'>
                <span>Done</span>
                <MdDone />
              </Badge>
            ) : action.isConverting ? (
              <Badge>
                <span>Converting</span>
                <span className='animate-spin'>
                  <ImSpinner3 />
                </span>
              </Badge>
            ) : (
              <div className='text-slate-400 text-md flex items-center gap-4'>
                <span>Convert to</span>
                <Select
                  onValueChange={(value: string) => {
                    if (EXTENSIONS.audio.includes(value))
                      setDefaultValues('audio');
                    else if (EXTENSIONS.video.includes(value))
                      setDefaultValues('video');
                    setSelected(value);
                    updateAction(action.fileName, value);
                  }}
                  value={selected}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='...' />
                  </SelectTrigger>
                  <SelectContent className='h-fit'>
                    {action.fileType.includes('image') && (
                      <div className='grid grid-cols-2 gap-2 w-fit'>
                        {EXTENSIONS.image.map((elt, i) => (
                          <div key={i} className='col-span-1 text-center'>
                            <SelectItem value={elt} className='mx-auto'>
                              {elt}
                            </SelectItem>
                          </div>
                        ))}
                      </div>
                    )}
                    {action.fileType.includes('video') && (
                      <Tabs defaultValue={defaultValues} className='w-full'>
                        <TabsList className='w-full'>
                          <TabsTrigger value='video' className='w-full'>
                            Video
                          </TabsTrigger>
                          <TabsTrigger value='audio' className='w-full'>
                            Audio
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value='video'>
                          <div className='grid grid-cols-3 gap-2 w-fit'>
                            {EXTENSIONS.video.map((elt, i) => (
                              <div key={i} className='col-span-1 text-center'>
                                <SelectItem value={elt} className='mx-auto'>
                                  {elt}
                                </SelectItem>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                        <TabsContent value='audio'>
                          <div className='grid grid-cols-3 gap-2 w-fit'>
                            {EXTENSIONS.audio.map((elt, i) => (
                              <div key={i} className='col-span-1 text-center'>
                                <SelectItem value={elt} className='mx-auto'>
                                  {elt}
                                </SelectItem>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    )}
                    {action.fileType.includes('audio') && (
                      <div className='grid grid-cols-2 gap-2 w-fit'>
                        {EXTENSIONS.audio.map((elt, i) => (
                          <div key={i} className='col-span-1 text-center'>
                            <SelectItem value={elt} className='mx-auto'>
                              {elt}
                            </SelectItem>
                          </div>
                        ))}
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
            {action.isConverted ? (
              <Button variant='outline' onClick={() => downloadAction(action)}>
                Download
              </Button>
            ) : (
              <span
                onClick={() => deleteAction(action)}
                className='cursor-pointer hover:bg-gray-50 rounded-full h-10 w-10 flex items-center justify-center text-2xl text-gray-400'
              >
                <MdClose />
              </span>
            )}
          </div>
        ))}
        <div className='flex w-full justify-end'>
          {isDone ? (
            <div className='space-y-4 w-fit'>
              <Button
                size='lg'
                className='rounded-xl font-semibold relative py-4 text-md flex gap-2 items-center w-full'
                onClick={downloadAllAction}
              >
                {actions.length > 1 ? 'Download All' : 'Download'}
                <HiOutlineDownload />
              </Button>
              <Button
                size='lg'
                onClick={resetAction}
                variant='outline'
                className='rounded-xl'
              >
                Convert Another File(s)
              </Button>
            </div>
          ) : (
            <Button
              size='lg'
              disabled={!isReady || isConverting}
              className='rounded-xl font-semibold relative py-4 text-md flex items-center w-44'
              onClick={convertAction}
            >
              {isConverting ? (
                <span className='animate-spin text-lg'>
                  <ImSpinner3 />
                </span>
              ) : (
                <span>Convert Now</span>
              )}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <ReactDropzone
      accept={ACCEPTED_FILES}
      onDrop={handleDrop}
      onDragEnter={handleDragHover}
      onDragLeave={handleDragLeave}
      onDropRejected={handleOnDropRejectedOrError}
      onError={handleOnDropRejectedOrError}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          className={`bg-slate-50 h-72 lg:h-80 xl:h-96 rounded-3xl shadow-md border-2 border-dashed cursor-pointer flex items-center justify-center ${
            isHovered && 'border-slate-900'
          }`}
        >
          {!isLoaded ? (
            <h3 className='text-center font-medium text-2xl text-slate-500 animate-pulse'>
              Loading...
            </h3>
          ) : (
            <>
              <input {...getInputProps()} />
              <div
                className={`space-y-4 ${
                  isHovered ? 'text-slate-900' : 'text-slate-500'
                }`}
              >
                {isHovered ? (
                  <>
                    <div className='justify-center flex text-6xl'>
                      <GoFileSymlinkFile />
                    </div>
                    <h3 className='text-center font-medium text-2xl'>
                      Yes, right here
                    </h3>
                  </>
                ) : (
                  <>
                    <div className='justify-center flex text-6xl'>
                      <BsUpload />
                    </div>
                    <h3 className='text-center font-medium text-2xl'>
                      Click or drop your files here
                    </h3>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </ReactDropzone>
  );
}
