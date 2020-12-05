import React, { useState } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import ActionBar from './ActionBar';
import NodeManagerContainer from './NodeManager/containers/NodeManagerContainer';
import { ReactQueryDevtools } from 'react-query-devtools'
import './styles/main.css'
import ReactPlayerWrapper from './NodeDisplay/ReactPlayer'

function App() {

  const [loading, setLoading] = useState(false)
  
  return (
    <>
      <BrowserRouter>
        <ActionBar 
          actionMap={{}}
          loading={loading}
        />
        <Routes>
          <Route element={<Navigate to="nodes" />} />
          <Route path="/nodes" element={<div className="TrialMegaContainer">
                                        <div><NodeManagerContainer setLoading={setLoading} /></div>
                                        <div><ReactPlayerWrapper /></div>
										<div><NodeManagerContainer setLoading={setLoading} /></div>
                                        </div>}/>
          <Route path="/nodes/:nodeId" element={<NodeManagerContainer setLoading={setLoading} />}/>
          <Route path="/nodes/:nodeId/anchor/:anchorId" element={<NodeManagerContainer setLoading={setLoading} />}/>
        </Routes>
      </BrowserRouter>

      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
} 


export default App;
