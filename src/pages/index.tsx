import dynamic from 'next/dynamic'
import Navbar from '@/components/dom/Navbar'
import MainPage from '@/components/dom/MainPage/MainPage'

const Shader = dynamic(() => import('@/components/canvas/Shader/Shader'), {
  ssr: false,
})

// dom components goes here
const Page = (props) => {
  return (
    <>
      <MainPage />
    </>
  )
}

// canvas components goes here
// It will receive same props as Page component (from getStaticProps, etc.)
Page.r3f = (props) => <>{/* <Shader /> */}</>

export default Page

export async function getStaticProps() {
  return {
    props: {
      title: 'Index',
    },
  }
}
