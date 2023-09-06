import Image from 'next/image'
import DarkToggle from './DarkToggle'
import { HomeIcon, InformationCircleIcon } from '@heroicons/react/24/solid'

const navLinks = [
  {
    name: 'Home',
    href: '/home',
    icon: <HomeIcon height={25} />,
  },
  {
    name: 'About',
    href: '/about',
    icon: <InformationCircleIcon height={25} />,
  },
]

const NavLink = ({ name, href, icon }) => {
  return (
    <li className='px-5 py-3 '>
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
    <div className='pt-4 pointer-events-auto'>
      <nav className='container flex flex-wrap items-center justify-around h-16 mx-auto rounded-full card standard-color standard-border'>
        {/* Logo */}
        <a href='' className='flex items-center gap-4'>
          <Image src='/img/logo.svg' height={30} width={30} className='flex h-6 mr-3 sm:h-9' alt='Atlas Logo' />
          <span className='flex text-xl font-semibold whitespace-nowrap standard-color'>Atlas</span>
        </a>

        {/* Links Container */}
        <div className='items-center justify-between hidden w-full md:flex md:w-auto md:order-1' id='navbar-cta'>
          <ul className='flex flex-col gap-2 md:flex-row md:text-sm md:font-medium md:border-0 md:bg-white standard-color'>
            {navLinks.map(({ name, href, icon }) => (
              <NavLink key={name} name={name} href={href} icon={icon} />
            ))}
          </ul>
        </div>
        {/* Get Started, Toggle Menu Container  */}
        <div className='flex items-center justify-center md:order-2 gap-5'>
          <DarkToggle />
          {/* Get Started Button */}
          <button type='button' className=' font-medium text-center button'>
            Get started
          </button>
        </div>
      </nav>
    </div>
  )
}

export default NavBar
