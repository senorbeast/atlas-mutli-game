import useStore from '@/helpers/store'

const SettingsBar = () => {
  const setRoute = useStore((state) => state.setRoute)
  console.log('Settings')
  return (
    <div>
      <button type='button' onClick={() => setRoute('/')} className='button'>
        Go Back
      </button>
    </div>
  )
}

export default SettingsBar
