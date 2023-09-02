import { useRouter } from 'next/navigation'

const SettingsBar = () => {
  const router = useRouter()
  console.log('Settings')
  return (
    <div>
      <button type='button' onClick={() => router.push("/")} className='button'>
        Go Back
      </button>
    </div>
  )
}

export default SettingsBar
