import React, { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import Papa from "papaparse";

const UploadStudents = () => {
	const [file, setFile] = useState(null);

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	const handleUpload = () => {
		if (file) {
			Papa.parse(file, {
				header: true, // First row is header // header names are the fields that get stored in the database // all being stored as strings
				complete: async (results) => {
					const students = results.data;
					for (const student of students) {
						const { enrollment_no, name, group } = student;
						try {
							// Using enrollment number as document ID
							await setDoc(doc(db, "Students", enrollment_no), {
								name,
								group,
							});
						} catch (e) {
							console.error("Error adding document: ", e);
						}
					}
					alert("Students uploaded successfully");
				},
			});
		}
	};

	return (
		<div className="p-6 bg-gray-100 min-h-screen">
			<div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
				<h2 className="text-2xl font-semibold mb-6 text-center">
					Upload Student Details
				</h2>
				<input
					type="file"
					onChange={handleFileChange}
					className="mb-4 p-2 border border-gray-300 rounded w-full"
					accept=".csv"
				/>
				<button
					onClick={handleUpload}
					className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700">
					Upload
				</button>
			</div>
		</div>
	);
};

export default UploadStudents;
