import Link from 'next/link'

// custom pages/404.jsx !! Do not remove please or it will break build
export default function Error() {
  return (
    <>
      <div className='flex flex-col items-center justify-center w-full h-full gap-10 standard-color'>
        <h1 className='flex font-mono text-5xl font-bold'>
          404: Page Not Found
        </h1>
        <Link href='/'>
          <button type='button' className='button'>
            Lets go Home
          </button>
        </Link>
      </div>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      title: 'Sorry! 404',
    },
  }
}
