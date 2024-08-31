import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
	return (
		<nav className="bg-blue-500 p-4">
			<ul className="flex justify-center space-x-4">
				<li>
					<Link
						to="/mark-attendance"
						className="text-white hover:text-gray-200">
						Mark Attendance
					</Link>
				</li>
				<li>
					<Link
						to="/view-history"
						className="text-white hover:text-gray-200">
						View History
					</Link>
				</li>
				<li>
					<Link
						to="/upload-students"
						className="text-white hover:text-gray-200">
						Upload Student Details
					</Link>
				</li>
			</ul>
		</nav>
	);
};

export default Navbar;
