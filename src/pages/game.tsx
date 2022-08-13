import dynamic from 'next/dynamic'
import GamePage from '@/components/dom/GamePage'
const Box = dynamic(() => import('@/components/canvas/Box'), {
  ssr: false,
})

const Page = (props) => {
  return (
    <>
      <GamePage />
    </>
  )
}

Page.r3f = (props) => <>{/* <Box route='/' /> */}</>

export default Page

export async function getStaticProps() {
  return {
    props: {
      title: 'Box',
    },
  }
}
