import React, { useState, useEffect } from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from "recharts";
import {
	LayoutDashboard,
	Wrench,
	Store,
	Calendar,
	CheckCircle,
	Package,
	HeartHandshake,
	ClipboardList,
	TrendingUp,
	MapPin,
	MessageCircle,
	Truck,
	AlertCircle,
} from "lucide-react";

// Define the available dashboards and their corresponding icons
const dashboards = [
	{ id: "operations", name: "Operations", icon: LayoutDashboard },
	{ id: "field", name: "Field Technician", icon: Wrench },
	{ id: "retail", name: "Retail Associate", icon: Store },
];

// Mock data for the different dashboards
const operationsData = {
	dailyTaskCompletion: 85,
	pendingJobs: 12,
	inventoryStatus: {
		inStock: 150,
		outOfStock: 5,
	},
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
		{
			id: "J-101",
			location: "123 Main St",
			technician: "Alice Johnson",
			status: "In Progress",
		},
		{
			id: "J-102",
			location: "456 Oak Ave",
			technician: "Bob Williams",
			status: "Pending",
		},
		{
			id: "J-103",
			location: "789 Pine Ln",
			technician: "Charlie Brown",
			status: "Complete",
		},
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
		completionRate: 95,
		averageTime: "45 min",
		customerSatisfaction: 4.8,
	},
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

// Helper components for the dashboard cards
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

// Dashboard Components for each role
const OperationsDashboard = () => {
	// Using useState to manage the active jobs list so it can be updated
	const [jobs, setJobs] = useState(operationsData.activeJobs);

	// Function to handle the status update for a specific job
	const handleStatusUpdate = (jobId, newStatus) => {
		setJobs(
			jobs.map((job) =>
				job.id === jobId ? { ...job, status: newStatus } : job
			)
		);
		// In a real application, this is where you would make an API call to a backend
		console.log(`Job ${jobId} status updated to: ${newStatus}`);
	};

	return (
		<div className="p-8 space-y-8">
			<h1 className="text-3xl font-bold text-gray-900">
				Operations Dashboard
			</h1>
			<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard
					title="Daily Task Completion"
					value={`${operationsData.dailyTaskCompletion}%`}
					icon={CheckCircle}
				/>
				<StatCard
					title="Pending Job"
					value={jobs.filter((j) => j.status === "Pending").length}
					icon={ClipboardList}
				/>
				<StatCard
					title="In-Stock Items"
					value={operationsData.inventoryStatus.inStock}
					icon={Package}
				/>
				<StatCard
					title="Out of Stock Items"
					value={operationsData.inventoryStatus.outOfStock}
					icon={Truck}
				/>
			</div>

			<div className="grid lg:grid-cols-2 gap-6">
				<ChartCard title="Task Completion Rate (Weekly)">
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={operationsData.taskCompletionRate}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Bar
								dataKey="completed"
								fill="#3b82f6"
								name="Completed Tasks (%)"
							/>
						</BarChart>
					</ResponsiveContainer>
				</ChartCard>

				<div className="bg-white p-6 rounded-xl shadow-md">
					<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
						<AlertCircle className="mr-2 h-5 w-5 text-red-500" />{" "}
						Top 5 Low Stock Items
					</h3>
					<ul className="divide-y divide-gray-200">
						{operationsData.lowStockItems.map((item) => (
							<li
								key={item.name}
								className="py-2 flex justify-between items-center"
							>
								<p className="font-medium text-gray-900">
									{item.name}
								</p>
								<span className="text-sm text-red-600 font-semibold">
									{item.quantity} left
								</span>
							</li>
						))}
					</ul>
				</div>
			</div>
			<div className="bg-white p-6 rounded-xl shadow-md">
				<h3 className="text-lg font-semibold text-gray-800 mb-4">
					Active Jobs
				</h3>
				<ul className="divide-y divide-gray-200">
					{jobs.map((job) => (
						<li
							key={job.id}
							className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center"
						>
							<div className="mb-2 sm:mb-0">
								<p className="font-medium text-gray-900">
									{job.id}
								</p>
								<p className="text-sm text-gray-500">
									{job.location}
								</p>
							</div>
							<div className="flex items-center space-x-2">
								<label
									htmlFor={`status-select-${job.id}`}
									className="sr-only"
								>
									Choose a status
								</label>
								<select
									id={`status-select-${job.id}`}
									value={job.status}
									onChange={(e) =>
										handleStatusUpdate(
											job.id,
											e.target.value
										)
									}
									className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-1"
								>
									<option value="Pending">Pending</option>
									<option value="In Progress">
										In Progress
									</option>
									<option value="Complete">Complete</option>
								</select>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

const FieldTechnicianDashboard = () => {
	// Using useState to manage the current job data so it can be updated
	const [currentJob, setCurrentJob] = useState(technicianData.currentJob);
	const [newStatus, setNewStatus] = useState(currentJob.status);

	// Function to handle the status update
	const handleStatusUpdate = () => {
		setCurrentJob({ ...currentJob, status: newStatus });
		// In a real application, this is where you would make an API call to a backend
		console.log(`Job ${currentJob.id} status updated to: ${newStatus}`);
	};

	return (
		<div className="p-8 space-y-8">
			<h1 className="text-3xl font-bold text-gray-900">
				Hello, {technicianData.name}!
			</h1>
			<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard
					title="Current Job Status"
					value={currentJob.status}
					icon={Wrench}
				/>
				<StatCard
					title="Customer Satisfaction"
					value={`${technicianData.performanceMetrics.customerSatisfaction}/5`}
					icon={HeartHandshake}
				/>
				<StatCard
					title="Average Job Time"
					value={technicianData.performanceMetrics.averageTime}
					icon={Calendar}
				/>
				<StatCard
					title="Job Completion Rate"
					value={`${technicianData.performanceMetrics.completionRate}%`}
					icon={CheckCircle}
				/>
			</div>

			<div className="grid lg:grid-cols-2 gap-6">
				<div className="bg-white p-6 rounded-xl shadow-md">
					<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
						<MapPin className="mr-2 h-5 w-5 text-blue-500" />{" "}
						Current Job
					</h3>
					<p className="text-gray-900 font-medium text-xl">
						{currentJob.customer}
					</p>
					<p className="text-gray-600 mb-2">{currentJob.address}</p>
					<p className="text-gray-500 text-sm mb-4">
						{currentJob.description}
					</p>
					<div className="flex items-center space-x-2 text-sm text-gray-700">
						<span className="font-semibold">ETA:</span>
						<span>{currentJob.eta}</span>
					</div>
				</div>

				{/* New component for updating job status */}
				<div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between">
					<div>
						<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
							<ClipboardList className="mr-2 h-5 w-5 text-blue-500" />{" "}
							Update Job Status
						</h3>
						<p className="text-gray-500 text-sm mb-4">
							Update the status for Job ID: {currentJob.id}
						</p>
						<div className="flex items-center space-x-4">
							<label htmlFor="status-select" className="sr-only">
								Choose a status
							</label>
							<select
								id="status-select"
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
			<div className="grid lg:grid-cols-2 gap-6">
				<div className="bg-white p-6 rounded-xl shadow-md">
					<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
						<ClipboardList className="mr-2 h-5 w-5 text-blue-500" />{" "}
						My Schedule
					</h3>
					<ul className="space-y-2">
						{technicianData.schedule.map((task, index) => (
							<li key={index} className="flex items-start">
								<span className="text-gray-500 mr-4 mt-1">
									{task.time}
								</span>
								<p className="text-gray-900 font-medium">
									{task.task}
								</p>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

const RetailAssociateDashboard = () => (
	<div className="p-8 space-y-8">
		<h1 className="text-3xl font-bold text-gray-900">
			Store Dashboard - {retailData.storeName}
		</h1>
		<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
			<StatCard
				title="Daily Sales (Today)"
				value="+$2,500"
				icon={TrendingUp}
			/>
			<StatCard title="Upcoming Tasks" value="3" icon={ClipboardList} />
			<StatCard
				title="Customer Feedback"
				value="4 new"
				icon={MessageCircle}
			/>
		</div>

		<div className="grid lg:grid-cols-2 gap-6">
			<ChartCard title="Daily Sales (Last 5 Days)">
				<ResponsiveContainer width="100%" height={300}>
					<BarChart data={retailData.dailySales}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" />
						<YAxis />
						<Tooltip />
						<Legend />
						<Bar dataKey="sales" fill="#10b981" name="Sales ($)" />
					</BarChart>
				</ResponsiveContainer>
			</ChartCard>

			<ChartCard title="Monthly Sales by Category (Last 30 Days)">
				<ResponsiveContainer width="100%" height={300}>
					<BarChart
						layout="vertical"
						data={retailData.monthlySalesByCategory}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis type="number" />
						<YAxis dataKey="category" type="category" />
						<Tooltip />
						<Legend />
						<Bar dataKey="sales" fill="#8884d8" name="Sales ($)" />
					</BarChart>
				</ResponsiveContainer>
			</ChartCard>
		</div>
		<div className="grid lg:grid-cols-2 gap-6">
			<ChartCard title="Product Inventory Distribution">
				<ResponsiveContainer width="100%" height={300}>
					<PieChart>
						<Pie
							data={retailData.productInventory}
							cx="50%"
							cy="50%"
							innerRadius={60}
							outerRadius={90}
							fill="#8884d8"
							paddingAngle={5}
							dataKey="value"
						>
							{retailData.productInventory.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={entry.color}
								/>
							))}
						</Pie>
						<Tooltip />
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</ChartCard>
		</div>
	</div>
);

const App = () => {
	const [activeDashboard, setActiveDashboard] = useState("operations");
	const [isAuthReady, setIsAuthReady] = useState(true); // Assuming authentication is ready for this mock-up

	const renderDashboard = () => {
		switch (activeDashboard) {
			case "operations":
				return <OperationsDashboard />;
			case "field":
				return <FieldTechnicianDashboard />;
			case "retail":
				return <RetailAssociateDashboard />;
			default:
				return <OperationsDashboard />;
		}
	};

	if (!isAuthReady) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-lg text-gray-500">Loading...</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 font-sans antialiased text-gray-800">
			<header className="bg-white shadow-sm sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<h1 className="text-xl font-bold text-gray-900">
							Technomobile Dashboard
						</h1>
						<nav className="flex items-center space-x-2">
							{dashboards.map((d) => (
								<button
									key={d.id}
									onClick={() => setActiveDashboard(d.id)}
									className={`flex items-center px-4 py-2 rounded-full font-medium text-sm transition-colors duration-200
                              ${
									activeDashboard === d.id
										? "bg-blue-600 text-white shadow-md"
										: "text-gray-600 hover:bg-gray-200"
								}`}
								>
									<d.icon className="w-5 h-5 mr-2" />
									<span className="hidden sm:inline">
										{d.name}
									</span>
								</button>
							))}
						</nav>
					</div>
				</div>
			</header>
			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				{renderDashboard()}
			</main>
		</div>
	);
};

export default App;


