import {useAuth} from '../hooks/useAuth'

export function Library(){
  const {user} = useAuth()

  return(
    <div className="library-page">
      <h1>Моя библыотэка</h1>
      <p>добр бобр, {user?.email}!</p>
    </div>
  )
}