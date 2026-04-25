import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='text-center text-blue-300 flex justify-center items-center mt-40'>
        <h1>Counter: {count}</h1>
       
      </div>
    </>
  )
}

export default App
