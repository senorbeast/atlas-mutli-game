import dynamic from 'next/dynamic'
import GamePage from '@/components/dom/GamePage'
const Box = dynamic(() => import('@/components/canvas/Box'), {
  ssr: false,
})

const Page = (props) => {
  return (
    <>
      <div className='flex w-screen h-screen p-2'>
        <GamePage />
      </div>
    </>
  )
}

Page.r3f = (props) => (
  <>
    <Box route='/' />
  </>
)

export default Page

export async function getStaticProps() {
  return {
    props: {
      title: 'Lets Play',
    },
  }
}
