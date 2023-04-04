import React from 'react';
import { Route, Routes } from 'react-router-dom'
import Header from './layout/header'
import Nav from './layout/nav';

const MainStep = React.lazy(() => import("./components/step/MainStep"));
const MainCanvas = React.lazy(() => import("./components/canvas/MainCanvas"));

function App() {
  //console.log(import.meta.env.BASE_URL + "public/assets/images.pixelated.png");
  return (
    <>
    <Nav></Nav>
    <Routes>
      <Route path='/' element={<h1>BONJOUR</h1>}></Route>

      <Route path='/pixel'>
        <Route path='upload' element={
          <React.Suspense fallback={<><h2>Loading...</h2></>}>
            <Header></Header>
              <MainStep></MainStep>
          </React.Suspense>
        }></Route>

        <Route path='canvas' element={
          <React.Suspense fallback={<><h2>Loading...</h2></>}>
            <MainCanvas></MainCanvas>
          </React.Suspense>
        }></Route>
      </Route>


    </Routes>
    </>
  )
}

export default App
