import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
	collection,
	query,
	where,
	getDocs,
	doc,
	setDoc,
} from "firebase/firestore";

const MarkAttendance = () => {
	const [students, setStudents] = useState([]);
	const [group, setGroup] = useState("All students");
	const [isSubmitted, setIsSubmitted] = useState(false); // to check if attendance is submitted // make the button disabled after submitting
	const [loading, setLoading] = useState(false); // to show loading message while fetching students

	// Fetch students from Firestore based on selected group
	useEffect(() => {
		const fetchStudents = async () => {
			setLoading(true);
			try {
				const studentsRef = collection(db, "Students");
				let q;
				if (group === "All students") {
					q = query(studentsRef); // Fetch all students
				} else {
					q = query(studentsRef, where("group", "==", group)); // Fetch students by group
				}
				const querySnapshot = await getDocs(q);
				const studentsList = [];
				querySnapshot.forEach((doc) => {
					studentsList.push({
						id: doc.id,
						enrollment_no: doc.id,
						name: doc.data().name,
						status: "present", // default status
					});
				});
				setStudents(studentsList);
			} catch (error) {
				console.error("Error fetching students: ", error);
			} finally {
				setLoading(false);
			}
		};

		fetchStudents();
	}, [group]); // re-fetch students when group changes

	// Update status of a student based on radio button selection // present or absent
	const handleStatusChange = (index, status) => {
		const newStudents = [...students];
		newStudents[index].status = status;
		setStudents(newStudents);
	};

	const generateDateId = () => {
		const today = new Date();
		const day = String(today.getDate()).padStart(2, "0");
		const month = today
			.toLocaleString("default", { month: "long" })
			.toLowerCase(); // Get full month name
		const year = today.getFullYear();
		return { year, month, day };
	};

	const handleSubmit = async () => {
		const { year, month, day } = generateDateId();
		// const dateId = `${year}-${month}-${day}`;

		try {
			const yearDocRef = doc(db, "attendance", String(year));
			const monthCollectionRef = collection(yearDocRef, String(month));
			const dateDocRef = doc(monthCollectionRef, String(day));

			const attendanceData = {};
			students.forEach((student) => {
				attendanceData[student.enrollment_no] = {
					name: student.name,
					status: student.status,
				};
			});

			await setDoc(dateDocRef, attendanceData);

			setIsSubmitted(true);
			alert("Attendance submitted successfully!");
		} catch (error) {
			console.error("Error submitting attendance: ", error);
			alert("Error submitting attendance. Check console for details.");
		}
	};

	return (
		<div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
			<h2 className="text-2xl font-semibold mb-6 text-center">
				Mark Attendance
			</h2>
			<div className="mb-6">
				<label className="block text-gray-700 font-medium mb-2">
					Select Group
				</label>
				<select
					value={group}
					onChange={(e) => setGroup(e.target.value)}
					className="w-full p-3 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
					<option>All students</option>
					<option>Group 1</option>
					<option>Group 2</option>
				</select>
			</div>
			{loading ? (
				<p className="text-center text-gray-600">Loading students...</p>
			) : (
				<>
					<p className="mb-4 text-gray-500">
						{group === "All students"
							? null
							: `Note: If Group 1 or Group 2 is selected, the 'Save Attendance' button will only save the status of that group.`}
					</p>
					<ul className="space-y-4">
						{students.map((student, index) => (
							<li
								key={student.id}
								className="bg-gray-50 p-4 rounded-md shadow-sm">
								<div className="flex items-center justify-between">
									<span className="font-medium text-gray-800">
										{student.name}
									</span>
									<div className="flex space-x-4">
										<label className="flex items-center">
											<input
												type="radio"
												name={`status-${student.id}`}
												value="present"
												checked={
													student.status === "present"
												}
												onChange={() =>
													handleStatusChange(
														index,
														"present"
													)
												}
												className="mr-2"
											/>
											Present
										</label>
										<label className="flex items-center">
											<input
												type="radio"
												name={`status-${student.id}`}
												value="absent"
												checked={
													student.status === "absent"
												}
												onChange={() =>
													handleStatusChange(
														index,
														"absent"
													)
												}
												className="mr-2"
											/>
											Absent
										</label>
									</div>
								</div>
							</li>
						))}
					</ul>
					<button
						onClick={handleSubmit}
						disabled={isSubmitted}
						className={`w-full mt-6 p-3 text-white rounded-md ${
							isSubmitted
								? "bg-gray-400 cursor-not-allowed"
								: "bg-blue-500 hover:bg-blue-600"
						}`}>
						{isSubmitted ? "Attendance Saved" : "Save Attendance"}
					</button>

					{/* Success Message */}
					{isSubmitted && (
						<p className="mt-4 text-green-600 text-center">
							Attendance has been marked successfully.
						</p>
					)}
				</>
			)}
		</div>
	);
};

export default MarkAttendance;
