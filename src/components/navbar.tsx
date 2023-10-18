import { CgMenu } from 'react-icons/cg';
import { BsGithub } from 'react-icons/bs';
import Link from 'next/link';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from './ui/sheet';

type NavbarProps = {};

export default function Navbar({}: NavbarProps) {
  return (
    <nav className='w-full backdrop-blur-md bg-white bg-opacity-30 z-50 fixed h-24 flex justify-between items-center py-10 px-4 md:px-8 lg:px-12 xl:px-14'>
      <Link href='/'>
        <p className='text-2xl text-gray-500'>
          JPA<span className='font-bold text-black'>fio</span>
        </p>
      </Link>
      <section className='gap-1 md:gap-2 lg:gap-4 hidden md:flex'>
        <Link href='/'>
          <Button variant='ghost' className='font-semibold text-md'>
            Home
          </Button>
        </Link>
        <Link href='/about'>
          <Button variant='ghost' className='font-semibold text-md'>
            About
          </Button>
        </Link>
        <Link href='/privacy-policy'>
          <Button variant='ghost' className='font-semibold text-md'>
            Privacy Policy
          </Button>
        </Link>
      </section>
      <Link href='https://github.com/jpaddeo/file-converter.git'>
        <Button variant='default' size='lg' className='hidden md:flex'>
          <BsGithub className='inline-block text-xl' />
        </Button>
      </Link>

      <Sheet>
        <SheetTrigger className='block md:hidden p-3'>
          <CgMenu className='text-2xl' />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetDescription>
              <section className='w-full space-y-3'>
                <Link href='/'>
                  <Button
                    variant='link'
                    className='font-semibold text-md w-full'
                  >
                    Home
                  </Button>
                </Link>
                <Link href='/about'>
                  <Button
                    variant='link'
                    className='font-semibold text-md w-full'
                  >
                    About
                  </Button>
                </Link>
                <Link href='/privacy-policy'>
                  <Button
                    variant='link'
                    className='font-semibold text-md w-full'
                  >
                    Privacy Policy
                  </Button>
                </Link>
                <Link href='/privacy-policy'>
                  <Button
                    variant='link'
                    className='font-semibold text-md w-full flex items-center justify-center gap-2'
                  >
                    Github
                  </Button>
                </Link>
              </section>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
