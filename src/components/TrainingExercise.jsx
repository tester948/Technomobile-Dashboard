import React, { useState } from "react";
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

// Dashboards list
const dashboards = [
	{ id: "operations", name: "Operations", icon: LayoutDashboard },
	{ id: "field", name: "Field Technician", icon: Wrench },
	{ id: "retail", name: "Retail Associate", icon: Store },
];

// Initial data
const operationsDataInit = {
	dailyTaskCompletion: 85,
	pendingJobs: 12,
	inventory: [
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

const technicianDataInit = {
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
	performanceMetrics: {
		completionRate: 95,
		averageTime: "45 min",
		customerSatisfaction: 4.8,
		jobsInQueue: 3, // New KPI
	},
};

const retailDataInit = {
	storeName: "Central Store",
	dailySales: 2500,
	selectedCategory: "Electronics",
	productInventory: [
		{ name: "Product A", value: 200, color: "#3b82f6" },
		{ name: "Product B", value: 150, color: "#f97316" },
		{ name: "Product C", value: 50, color: "#ef4444" },
	],
	customerFeedbackCount: 4,
	monthlySalesByCategory: [
		{ category: "Electronics", sales: 12000 },
		{ category: "Accessories", sales: 7500 },
		{ category: "Apparel", sales: 5000 },
		{ category: "Home Goods", sales: 3000 },
	],
};

// StatCard
const StatCard = ({ title, value, icon: Icon, editable, onChange }) => (
	<div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
		<div className="bg-blue-100 text-blue-600 p-3 rounded-full">
			<Icon className="w-6 h-6" />
		</div>
		<div>
			<p className="text-gray-500 text-sm font-medium">{title}</p>
			{editable ? (
				<input
					type="number"
					value={value}
					onChange={(e) => onChange(Number(e.target.value))}
					className="text-2xl font-bold text-gray-800 border rounded px-1 w-20"
				/>
			) : (
				<p className="text-2xl font-bold text-gray-800">{value}</p>
			)}
		</div>
	</div>
);

const ChartCard = ({ title, children }) => (
	<div className="bg-white p-6 rounded-xl shadow-md">
		<h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
		{children}
	</div>
);

// Operations Dashboard
const OperationsDashboard = () => {
	const [data, setData] = useState(operationsDataInit);

	const updateJobStatus = (jobId, newStatus) => {
		const updatedJobs = data.activeJobs.map((job) =>
			job.id === jobId ? { ...job, status: newStatus } : job
		);
		let { pendingJobs, dailyTaskCompletion } = data;
		if (newStatus === "Complete") {
			pendingJobs = pendingJobs - 1;
			dailyTaskCompletion += 1;
		}
		setData({ ...data, activeJobs: updatedJobs, pendingJobs, dailyTaskCompletion });
	};

	const updateInventoryQty = (itemName, qty) => {
		const updatedInventory = data.inventory.map((item) =>
			item.name === itemName ? { ...item, quantity: qty } : item
		);
		setData({ ...data, inventory: updatedInventory });
	};

	const totalStock = data.inventory.reduce((sum, item) => sum + item.quantity, 0);

	return (
		<div className="p-8 space-y-8">
			<h1 className="text-3xl font-bold text-gray-900">Operations Dashboard</h1>
			<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard title="Daily Task Completion" value={`${data.dailyTaskCompletion}%`} icon={CheckCircle} />
				<StatCard title="Pending Jobs" value={data.pendingJobs} icon={ClipboardList} />
				<StatCard title="In-Stock Items" value={totalStock} icon={Package} />
				<StatCard title="Out of Stock Items" value={data.inventory.filter(i => i.quantity === 0).length} icon={Truck} />
			</div>
			<div className="bg-white p-6 rounded-xl shadow-md">
				<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
					<AlertCircle className="mr-2 h-5 w-5 text-red-500" /> Inventory
				</h3>
				<ul className="divide-y divide-gray-200">
					{data.inventory.map((item) => (
						<li key={item.name} className="py-2 flex justify-between items-center">
							<p className="font-medium text-gray-900">{item.name}</p>
							<input
								type="number"
								value={item.quantity}
								onChange={(e) => updateInventoryQty(item.name, Number(e.target.value))}
								className="border rounded px-2 w-20"
							/>
						</li>
					))}
				</ul>
			</div>
			<div className="bg-white p-6 rounded-xl shadow-md">
				<h3 className="text-lg font-semibold text-gray-800 mb-4">Active Jobs</h3>
				<ul className="divide-y divide-gray-200">
					{data.activeJobs.map((job) => (
						<li key={job.id} className="py-4 flex justify-between">
							<div>
								<p className="font-medium">{job.id}</p>
								<p className="text-sm text-gray-500">{job.location}</p>
							</div>
							<select value={job.status} onChange={(e) => updateJobStatus(job.id, e.target.value)} className="border rounded px-2">
								<option>Pending</option>
								<option>In Progress</option>
								<option>Complete</option>
							</select>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

// Field Technician Dashboard
const FieldTechnicianDashboard = () => {
	const [data, setData] = useState(technicianDataInit);

	const updateStatus = (newStatus) => {
		let { completionRate, customerSatisfaction } = data.performanceMetrics;
		if (newStatus === "Complete") {
			completionRate += 1;
			customerSatisfaction += 0.1;
		}
		setData({
			...data,
			currentJob: { ...data.currentJob, status: newStatus },
			performanceMetrics: { ...data.performanceMetrics, completionRate, customerSatisfaction },
		});
	};

	const updateJobsInQueue = (val) => {
		setData({ ...data, performanceMetrics: { ...data.performanceMetrics, jobsInQueue: val } });
	};

	return (
		<div className="p-8 space-y-8">
			<h1 className="text-3xl font-bold">Hello, {data.name}!</h1>
			<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard title="Current Job Status" value={data.currentJob.status} icon={Wrench} />
				<StatCard title="Customer Satisfaction" value={data.performanceMetrics.customerSatisfaction.toFixed(1)} icon={HeartHandshake} />
				<StatCard title="Job Completion Rate" value={`${data.performanceMetrics.completionRate}%`} icon={CheckCircle} />
				<StatCard title="Jobs in Queue" value={data.performanceMetrics.jobsInQueue} icon={ClipboardList} editable onChange={updateJobsInQueue} />
			</div>
			<div className="bg-white p-6 rounded-xl">
				<h3 className="text-lg font-semibold mb-4">Update Job Status</h3>
				<select value={data.currentJob.status} onChange={(e) => updateStatus(e.target.value)} className="border rounded px-2">
					<option>En route</option>
					<option>In Progress</option>
					<option>Complete</option>
				</select>
			</div>
		</div>
	);
};

// Retail Dashboard
const RetailAssociateDashboard = () => {
	const [data, setData] = useState(retailDataInit);

	const updateDailySales = (val) => {
		const updatedCategories = data.monthlySalesByCategory.map((c) =>
			c.category === data.selectedCategory ? { ...c, sales: c.sales + (val - data.dailySales) } : c
		);
		setData({
			...data,
			dailySales: val,
			monthlySalesByCategory: updatedCategories,
			customerFeedbackCount: data.customerFeedbackCount + 1,
		});
	};

	return (
		<div className="p-8 space-y-8">
			<h1 className="text-3xl font-bold">Store Dashboard - {data.storeName}</h1>
			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				<div className="bg-white p-6 rounded-xl shadow-md flex flex-col">
					<p className="text-gray-500 text-sm">Daily Sales (Today)</p>
					<input type="number" value={data.dailySales} onChange={(e) => updateDailySales(Number(e.target.value))} className="border rounded px-2 mb-2" />
					<select value={data.selectedCategory} onChange={(e) => setData({ ...data, selectedCategory: e.target.value })} className="border rounded px-2">
						{data.monthlySalesByCategory.map((c) => (
							<option key={c.category}>{c.category}</option>
						))}
					</select>
				</div>
				<StatCard title="Customer Feedback" value={`${data.customerFeedbackCount} new`} icon={MessageCircle} />
			</div>
		</div>
	);
};

const App = () => {
	const [activeDashboard, setActiveDashboard] = useState("operations");

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

	return (
		<div className="min-h-screen bg-gray-100">
			<header className="bg-white shadow-sm sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
					<h1 className="text-xl font-bold">Dashboard Mockup</h1>
					<nav className="flex items-center space-x-2">
						{dashboards.map((d) => (
							<button key={d.id} onClick={() => setActiveDashboard(d.id)} className={`flex items-center px-4 py-2 rounded-full ${activeDashboard === d.id ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-200"}`}>
								<d.icon className="w-5 h-5 mr-2" />
								{d.name}
							</button>
						))}
					</nav>
				</div>
			</header>
			<main className="max-w-7xl mx-auto py-6">{renderDashboard()}</main>
		</div>
	);
};

export default App;
