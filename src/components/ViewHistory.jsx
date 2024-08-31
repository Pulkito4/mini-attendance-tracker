import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const ViewHistory = () => {
	const [password, setPassword] = useState("");
	const [authenticated, setAuthenticated] = useState(false);
	const [selectedMonth, setSelectedMonth] = useState("January");
	const [selectedGroup, setSelectedGroup] = useState("All Students");
	const [months] = useState([
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	]); // read oonly field // months array stored in the state
	const [groups, setGroups] = useState([]);
	const [dates, setDates] = useState([]);
	const [attendanceData, setAttendanceData] = useState([]);
	const [students, setStudents] = useState([]);

	useEffect(() => {
		/** this similar manner of fetching the students data could have been used on the mark attendance component where we have actually queried the db again and again upon each change in group value selection */
		const fetchStudents = async () => {
			try {
				const studentsCollectionRef = collection(db, "Students");
				const querySnapshot = await getDocs(studentsCollectionRef);
				const studentsList = [];
				const groupSet = new Set(["All Students"]);

				querySnapshot.forEach((doc) => {
					const studentData = doc.data();
					studentsList.push({
						enrollmentNo: doc.id,
						name: studentData.name,
						group: studentData.group,
					});
					groupSet.add(studentData.group);
				});

				setStudents(studentsList);
				setGroups([...groupSet]);
			} catch (error) {
				console.error("Error fetching students: ", error);
			}
		};

		fetchStudents();
	}, []);

	useEffect(() => {
		const fetchAttendance = async () => {
			try {
				const year = new Date().getFullYear();
				const monthCollectionRef = collection(
					db,
					"attendance",
					String(year),
					selectedMonth.toLowerCase()
				);
				const querySnapshot = await getDocs(monthCollectionRef);
				const datesList = [];
				querySnapshot.forEach((doc) => {
					datesList.push({
						id: doc.id,
						data: doc.data(),
					});
				});
				setDates(datesList);

				const filteredStudents =
					selectedGroup === "All Students"
						? students
						: students.filter(
								(student) => student.group === selectedGroup
						  );

				const attendanceList = filteredStudents.map((student) => {
					const attendanceRecord = {
						enrollmentNo: student.enrollmentNo,
						name: student.name,
					};

					datesList.forEach((dateDoc) => {
						const status = dateDoc.data[student.enrollmentNo]
							? dateDoc.data[student.enrollmentNo].status
							: "-";
						attendanceRecord[dateDoc.id] = status;
					});

					return attendanceRecord;
				});

				setAttendanceData(attendanceList);
			} catch (error) {
				console.error("Error fetching attendance: ", error);
			}
		};

		fetchAttendance();
	}, [selectedMonth, selectedGroup, students]);

	const handleMonthChange = (e) => {
		setSelectedMonth(e.target.value);
	};

	const handleGroupChange = (e) => {
		setSelectedGroup(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleLogin = () => {
		if (password === "faculty123") {
			setAuthenticated(true);
		} else {
			alert("Incorrect password");
		}
	};

	return (
		<div className="p-4 bg-gray-100 min-h-screen">
			{!authenticated ? (
				<div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
					<h2 className="text-xl font-semibold mb-4">
						Enter Password to View Attendance History
					</h2>
					<input
						type="password"
						value={password}
						onChange={handlePasswordChange}
						className="mb-4 p-2 border rounded w-full"
						placeholder="Password"
					/>
					<button
						onClick={handleLogin}
						className="bg-blue-500 text-white p-2 rounded w-full">
						Login
					</button>
				</div>
			) : (
				<div className="bg-white p-6 rounded-lg shadow-lg">
					<h2 className="text-xl font-semibold mb-4">
						Attendance History
					</h2>
					<div className="mb-4 flex gap-4">
						<select
							value={selectedMonth}
							onChange={handleMonthChange}
							className="p-2 border rounded">
							{months.map((month) => (
								<option key={month} value={month}>
									{month}
								</option>
							))}
						</select>
						<select
							value={selectedGroup}
							onChange={handleGroupChange}
							className="p-2 border rounded">
							{groups.map((group) => (
								<option key={group} value={group}>
									{group}
								</option>
							))}
						</select>
					</div>
					<div className="overflow-x-auto">
						<table className="min-w-full bg-white border border-gray-300 divide-y divide-gray-300">
							<thead className="bg-gray-200">
								<tr>
									<th className="border px-4 py-2 text-center">
										Enrollment No
									</th>
									<th className="border px-4 py-2 text-center">
										Name
									</th>
									{dates.map((date) => (
										<th
											key={date.id}
											className="border px-4 py-2 text-center">
											{date.id}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{attendanceData.map((student) => (
									<tr key={student.enrollmentNo}>
										<td className="border px-4 py-2">
											{student.enrollmentNo}
										</td>
										<td className="border px-4 py-2">
											{student.name}
										</td>
										{dates.map((date) => (
											<td
												key={date.id}
												className="border px-4 py-2 text-center">
												{student[date.id] || "-"}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
};

export default ViewHistory;
