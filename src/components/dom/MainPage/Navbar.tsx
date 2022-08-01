import Image from 'next/image'
import { BeakerIcon } from '@heroicons/react/solid'

const navLinks = [
  {
    name: 'Home',
    href: '/',
    icon: <BeakerIcon height={25} />,
  },
  {
    name: 'About',
    href: '/',
    icon: <BeakerIcon height={25} />,
  },
]

const NavLink = ({ name, href, icon }) => {
  return (
    <li className='px-5 py-3'>
      <a
        href={href}
        className='flex items-center justify-between text-base rounded gap-2 standard-color md:bg-transparent'
      >
        {icon}
        {name}
      </a>
    </li>
  )
}

const NavBar = () => {
  return (
    <div className='pt-4'>
      <nav className='container flex flex-wrap items-center justify-around h-16 mx-auto rounded-full card standard-color standard-border'>
        {/* Logo */}
        <a href='' className='flex items-center gap-4'>
          <Image
            src='/img/logo.svg'
            height={30}
            width={30}
            className='flex h-6 mr-3 sm:h-9'
            alt='Atlas Logo'
          />
          <span className='flex text-xl font-semibold whitespace-nowrap standard-color'>
            Atlas
          </span>
        </a>
        {/* Get Started, Toggle Menu Container  */}
        <div className='flex md:order-2'>
          {/* Get Started Button */}
          <button type='button' className=' font-medium text-center button'>
            Get started
          </button>
          {/* Toggle Menu */}
          <button
            data-collapse-toggle='navbar-cta'
            type='button'
            className='inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden'
            aria-controls='navbar-cta'
            aria-expanded='false'
          >
            <span className='sr-only'>Open main menu</span>
            <svg
              className='w-6 h-6'
              aria-hidden='true'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                clipRule='evenodd'
              ></path>
            </svg>
          </button>
        </div>
        {/* Links Container */}
        <div
          className='items-center justify-between hidden w-full md:flex md:w-auto md:order-1'
          id='navbar-cta'
        >
          <ul className='flex flex-col gap-2 md:flex-row md:text-sm md:font-medium md:border-0 md:bg-white standard-color'>
            {navLinks.map(({ name, href, icon }) => (
              <NavLink key={name} name={name} href={href} icon={icon} />
            ))}
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default NavBar
