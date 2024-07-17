import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Navbar from './components/Navbar'
function App() {

  return (
    <>
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path ="/" />

    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
