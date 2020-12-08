import React, { useState } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import ActionBar from './ActionBar';
import NodeManagerContainer from './NodeManager/containers/NodeManagerContainer';
import { ReactQueryDevtools } from 'react-query-devtools'
import './styles/main.css'
import SearchContainer from './Search/SearchContainer';

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
					<Route path="/nodes" element={<NodeManagerContainer setLoading={setLoading} />} />
					<Route path="/nodes/:nodeId" element={<NodeManagerContainer setLoading={setLoading} />} />
					<Route path="/nodes/search/:content" element={<SearchContainer setLoading={setLoading} /> } />
				</Routes>
			</BrowserRouter>

			<ReactQueryDevtools initialIsOpen={false} />
		</>
	);
}


export default App;
