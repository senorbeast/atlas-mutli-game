import NavBar from './Navbar'
import Rooms from './Rooms'

const MainPage = () => {
  return (
    <>
      <div className='w-full h-full pointer-events-none standard-color'>
        <NavBar />
        <Rooms />
      </div>
    </>
  )
}

export default MainPage
