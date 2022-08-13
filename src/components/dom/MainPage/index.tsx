import NavBar from './Navbar'
import Rooms from './Rooms'

const MainPage = () => {
  return (
    <>
      <div className='w-full h-full bg-black'>
        <NavBar />
        <Rooms />
      </div>
    </>
  )
}

export default MainPage
