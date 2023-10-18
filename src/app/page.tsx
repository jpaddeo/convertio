import DropZone from '@/components/dropzone';

export default function Home() {
  return (
    <section className='space-y-16 pb-8'>
      <div className='space-y-6'>
        <h1 className='text-4xl md:text-6xl font-medium text-center'>
          Free File Converter
        </h1>
        <p className='text-gray-400 text-md md:text-lg text-center md:px-24 xl:px-44 2xl:px-52'>
          Convert your files for free with JPAfio. Transform images, audio and
          video easy and fast. No restrictons, no limits.
        </p>
      </div>
      <DropZone />
    </section>
  );
}
