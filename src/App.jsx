import React from "react";
import {  BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import MarkAttendance from "./components/MarkAttendance";
import ViewHistory from "./components/ViewHistory";
import UploadStudents from "./components/UploadStudents";

const App = () => {
	return (
		<Router>
			<Navbar />
			<Routes>
				<Route path="/" element={<MarkAttendance />} />
				<Route path="/mark-attendance" element={<MarkAttendance />} />
				<Route path="/view-history" element={<ViewHistory />} />
				<Route path="/upload-students" element={<UploadStudents />} />
			</Routes>
		</Router>
	);
};

export default App;
