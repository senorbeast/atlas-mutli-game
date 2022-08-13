// custom pages/500.js !! Do not remove please or it will break build
import Link from 'next/link'

export default function Error() {
  return (
    <>
      <div className='flex flex-col items-center justify-center w-full h-full gap-10 standard-color'>
        <h1 className='flex font-mono text-5xl font-bold'>
          500: Internal Server Error
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
      title: 'Sorry! 500',
    },
  }
}
