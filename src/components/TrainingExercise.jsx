// FULL UPDATED TrainingExercise.jsx
import React, { useState } from "react";
import {
	BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
	PieChart, Pie, Cell
} from "recharts";
import {
	LayoutDashboard, Wrench, Store, Calendar, CheckCircle, Package, HeartHandshake,
	ClipboardList, TrendingUp, MapPin, MessageCircle, Truck, AlertCircle
} from "lucide-react";

// Toast component
const Toast = ({ message, onClose }) => (
	<div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-md">
		{message}
		<button onClick={onClose} className="ml-3 text-sm underline">Close</button>
	</div>
);

const dashboards = [
	{ id: "operations", name: "Operations", icon: LayoutDashboard },
	{ id: "field", name: "Field Technician", icon: Wrench },
	{ id: "retail", name: "Retail Associate", icon: Store },
];

// Mock Data
const operationsData = {
	dailyTaskCompletion: 85,
	pendingJobs: 12,
	inventoryStatus: { inStock: 150, outOfStock: 5 },
	lowStockItems: [
		{ name: "Spare Part X", quantity: 3 },
		{ name: "Network Cable (10ft)", quantity: 5 },
		{ name: "Screws (Pack of 100)", quantity: 8 },
		{ name: "Fuse Set", quantity: 12 },
		{ name: "Battery Pack B", quantity: 15 },
	],
	taskCompletionRate: [
		{ name: "Mon", completed: 75 },
		{ name: "Tue", completed: 82 },
		{ name: "Wed", completed: 88 },
		{ name: "Thu", completed: 90 },
		{ name: "Fri", completed: 85 },
	],
	activeJobs: [
		{ id: "J-101", location: "123 Main St", technician: "Alice Johnson", status: "In Progress" },
		{ id: "J-102", location: "456 Oak Ave", technician: "Bob Williams", status: "Pending" },
		{ id: "J-103", location: "789 Pine Ln", technician: "Charlie Brown", status: "Complete" },
	],
};

const technicianData = {
	name: "Jane Doe",
	id: "T-001",
	currentJob: {
		id: "J-104",
		customer: "Tech Solutions Inc.",
		address: "1010 Corporate Blvd, San Francisco, CA",
		description: "Repair faulty network switch.",
		status: "En route",
		eta: "10:30 AM",
	},
	schedule: [
		{ time: "09:00 AM", task: "Travel to Job J-104" },
		{ time: "10:30 AM", task: "On-site repair for Job J-104" },
		{ time: "02:00 PM", task: "Follow up with customer from Job J-098" },
	],
	performanceMetrics: {
		completionRate: 0,
		averageTime: "45 min",
		customerSatisfaction: 4.8,
	},
	jobsToday: [
		{ id: "J-104", status: "En route" },
		{ id: "J-105", status: "Pending" },
		{ id: "J-106", status: "Pending" },
		{ id: "J-107", status: "Pending" },
	],
};

const retailData = {
	storeName: "Central Store",
	dailySales: [
		{ name: "Mon", sales: 1500 },
		{ name: "Tue", sales: 1800 },
		{ name: "Wed", sales: 1650 },
		{ name: "Thu", sales: 2100 },
		{ name: "Fri", sales: 2500 },
	],
	productInventory: [
		{ name: "Product A", value: 200, color: "#3b82f6" },
		{ name: "Product B", value: 150, color: "#f97316" },
		{ name: "Product C", value: 50, color: "#ef4444" },
	],
	customerFeedback: [
		"Friendly and helpful staff!",
		"Store was clean and well-organized.",
		"Had trouble finding a specific item.",
	],
	monthlySalesByCategory: [
		{ category: "Electronics", sales: 12000 },
		{ category: "Accessories", sales: 7500 },
		{ category: "Apparel", sales: 5000 },
		{ category: "Home Goods", sales: 3000 },
	],
};

// Components
const StatCard = ({ title, value, icon: Icon }) => (
	<div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
		<div className="bg-blue-100 text-blue-600 p-3 rounded-full">
			<Icon className="w-6 h-6" />
		</div>
		<div>
			<p className="text-gray-500 text-sm font-medium">{title}</p>
			<p className="text-2xl font-bold text-gray-800">{value}</p>
		</div>
	</div>
);

const ChartCard = ({ title, children }) => (
	<div className="bg-white p-6 rounded-xl shadow-md">
		<h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
		{children}
	</div>
);

// =================== FIELD TECHNICIAN DASHBOARD ===================
const FieldTechnicianDashboard = () => {
	const [currentJob, setCurrentJob] = useState(technicianData.currentJob);
	const [jobsToday, setJobsToday] = useState(technicianData.jobsToday);
	const [metrics, setMetrics] = useState(technicianData.performanceMetrics);
	const [toast, setToast] = useState(null);
	const [newStatus, setNewStatus] = useState(currentJob.status);

	const jobsInQueue = jobsToday.filter(j => j.status !== "Complete").length;

	const handleStatusUpdate = () => {
		if (newStatus === "Complete" && currentJob.status !== "Complete") {
			setMetrics(prev => ({
				...prev,
				completionRate: Math.min(prev.completionRate + 20, 100),
				customerSatisfaction: Math.min(prev.customerSatisfaction + 0.1, 5)
			}));
			setJobsToday(prev => prev.map(j => j.id === currentJob.id ? { ...j, status: "Complete" } : j));
			setToast("Job marked complete!");
		}
		setCurrentJob({ ...currentJob, status: newStatus });
	};

	return (
		<div className="p-8 space-y-8">
			<h1 className="text-3xl font-bold text-gray-900">Hello, {technicianData.name}!</h1>

			<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard title="Current Job Status" value={currentJob.status} icon={Wrench} />
				<StatCard title="Jobs in Queue (Today)" value={jobsInQueue} icon={ClipboardList} />
				<StatCard title="Customer Satisfaction" value={`${metrics.customerSatisfaction.toFixed(1)}/5`} icon={HeartHandshake} />
				<StatCard title="Job Completion Rate" value={`${metrics.completionRate}%`} icon={CheckCircle} />
			</div>

			<div className="grid lg:grid-cols-2 gap-6">
				{/* Current Job */}
				<div className="bg-white p-6 rounded-xl shadow-md">
					<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
						<MapPin className="mr-2 h-5 w-5 text-blue-500" /> Current Job
					</h3>
					<p className="text-gray-900 font-medium text-xl">{currentJob.customer}</p>
					<p className="text-gray-600 mb-2">{currentJob.address}</p>
					<p className="text-gray-500 text-sm mb-4">{currentJob.description}</p>
					<div className="flex items-center space-x-2 text-sm text-gray-700">
						<span className="font-semibold">ETA:</span>
						<span>{currentJob.eta}</span>
					</div>
				</div>

				{/* Update Job Status */}
				<div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between">
					<div>
						<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
							<ClipboardList className="mr-2 h-5 w-5 text-blue-500" /> Update Job Status
						</h3>
						<p className="text-gray-500 text-sm mb-4">Update the status for Job ID: {currentJob.id}</p>
						<div className="flex items-center space-x-4">
							<select
								value={newStatus}
								onChange={(e) => setNewStatus(e.target.value)}
								className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
							>
								<option value="En route">En route</option>
								<option value="In Progress">In Progress</option>
								<option value="On hold">On hold</option>
								<option value="Complete">Complete</option>
							</select>
							<button
								onClick={handleStatusUpdate}
								className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
							>
								Update
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* My Schedule */}
			<div className="grid lg:grid-cols-2 gap-6">
				<div className="bg-white p-6 rounded-xl shadow-md">
					<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
						<ClipboardList className="mr-2 h-5 w-5 text-blue-500" /> My Schedule
					</h3>
					<ul className="space-y-2">
						{technicianData.schedule.map((task, index) => (
							<li key={index} className="flex items-start">
								<span className="text-gray-500 mr-4 mt-1">{task.time}</span>
								<p className="text-gray-900 font-medium">{task.task}</p>
							</li>
						))}
					</ul>
				</div>
			</div>

			{/* Toast */}
			{toast && <Toast message={toast} onClose={() => setToast(null)} />}
		</div>
	);
};

// =================== OTHER DASHBOARDS (unchanged from original) ===================
// Keep OperationsDashboard and RetailAssociateDashboard from your original code here

const App = () => {
	const [activeDashboard, setActiveDashboard] = useState("field");
	const [isAuthReady] = useState(true);

	const renderDashboard = () => {
		switch (activeDashboard) {
			case "operations": return <div>Operations Dashboard</div>; // Placeholder
			case "field": return <FieldTechnicianDashboard />;
			case "retail": return <div>Retail Dashboard</div>; // Placeholder
			default: return <div>Operations Dashboard</div>;
		}
	};

	if (!isAuthReady) return <div className="flex items-center justify-center min-h-screen"><p>Loading...</p></div>;

	return (
		<div className="min-h-screen bg-gray-100">
			<header className="bg-white shadow-sm sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<h1 className="text-xl font-bold text-gray-900">Dashboard Mockup</h1>
						<nav className="flex items-center space-x-2">
							{dashboards.map(d => (
								<button
									key={d.id}
									onClick={() => setActiveDashboard(d.id)}
									className={`flex items-center px-4 py-2 rounded-full font-medium text-sm transition-colors duration-200 ${activeDashboard === d.id ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-200"}`}
								>
									<d.icon className="w-5 h-5 mr-2" />
									<span className="hidden sm:inline">{d.name}</span>
								</button>
							))}
						</nav>
					</div>
				</div>
			</header>
			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{renderDashboard()}</main>
		</div>
	);
};

export default App;
