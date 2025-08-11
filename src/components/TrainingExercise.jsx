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
  Handshake,
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

// Initial/mock data
const operationsDataInit = {
  dailyTaskCompletion: 85, // percent
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
  schedule: [
    { time: "09:00 AM", task: "Travel to Job J-104" },
    { time: "10:30 AM", task: "On-site repair for Job J-104" },
    { time: "02:00 PM", task: "Follow up with customer from Job J-098" },
  ],
  performanceMetrics: {
    completionRate: 20, // start at 20% (will increase +20% per completed job up to 100)
    averageTime: "45 min",
    customerSatisfaction: 4.8,
    jobsInQueue: 4, // Jobs in Queue (Today) — non-editable start value
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

// Re-usable stat card (keeps your original look)
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
          className="text-2xl font-bold text-gray-800 border rounded px-1 w-24"
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

/* -------------------------
   Operations Dashboard
   ------------------------- */
const OperationsDashboard = () => {
  const [data, setData] = useState(operationsDataInit);

  // Update job status — adjusts pendingJobs and dailyTaskCompletion automatically
  const updateJobStatus = (jobId, newStatus) => {
    const job = data.activeJobs.find((j) => j.id === jobId);
    const prevStatus = job ? job.status : null;

    const updatedJobs = data.activeJobs.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j));

    let newPending = data.pendingJobs;
    let newCompletion = data.dailyTaskCompletion;

    // If marking to Complete and it wasn't Complete before -> adjust KPIs
    if (newStatus === "Complete" && prevStatus !== "Complete") {
      if (newPending > 0) newPending = newPending - 1;
      // increment completion by 1 percentage point (cap at 100)
      newCompletion = Math.min(Math.round(newCompletion) + 1, 100);
    }

    setData({ ...data, activeJobs: updatedJobs, pendingJobs: newPending, dailyTaskCompletion: newCompletion });
  };

  const updateInventoryQty = (itemName, qty) => {
    const updatedInventory = data.inventory.map((it) => (it.name === itemName ? { ...it, quantity: qty } : it));
    setData({ ...data, inventory: updatedInventory });
  };

  const totalStock = data.inventory.reduce((sum, it) => sum + Number(it.quantity || 0), 0);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Operations Dashboard</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Daily Task Completion" value={`${data.dailyTaskCompletion}%`} icon={CheckCircle} />
        <StatCard title="Pending Jobs" value={data.pendingJobs} icon={ClipboardList} />
        <StatCard title="In-Stock Items" value={totalStock} icon={Package} />
        <StatCard title="Out of Stock Items" value={data.inventory.filter((i) => i.quantity === 0).length} icon={Truck} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Task Completion Rate (Weekly)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.taskCompletionRate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#3b82f6" name="Completed Tasks (%)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

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
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Jobs</h3>
        <ul className="divide-y divide-gray-200">
          {data.activeJobs.map((job) => (
            <li key={job.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-2 sm:mb-0">
                <p className="font-medium text-gray-900">{job.id}</p>
                <p className="text-sm text-gray-500">{job.location}</p>
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor={`status-select-${job.id}`} className="sr-only">
                  Choose a status
                </label>
                <select
                  id={`status-select-${job.id}`}
                  value={job.status}
                  onChange={(e) => updateJobStatus(job.id, e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-1"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
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

/* -------------------------
   Field Technician Dashboard
   ------------------------- */
const FieldTechnicianDashboard = () => {
    const [currentJob, setCurrentJob] = useState(technicianData.currentJob);
    const [newStatus, setNewStatus] = useState(currentJob.status);
    const [completionRate, setCompletionRate] = useState(technicianData.performanceMetrics.completionRate);
    const [jobsInQueue, setJobsInQueue] = useState(4); // initial value for today’s jobs
    const [customerSatisfaction, setCustomerSatisfaction] = useState(technicianData.performanceMetrics.customerSatisfaction);
    const [showToast, setShowToast] = useState(false);

    const handleStatusUpdate = () => {
        setCurrentJob({ ...currentJob, status: newStatus });

        // If job is marked complete, update KPIs
        if (newStatus === "Complete") {
            setJobsInQueue(prev => Math.max(prev - 1, 0)); // reduce jobs in queue
            setCompletionRate(prev => Math.min(prev + 20, 100)); // increase rate, max 100%
            setCustomerSatisfaction(prev => Math.min((parseFloat(prev) + 0.1).toFixed(1), 5)); // small boost
        }

        // Show toast confirmation
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">
                Hello, {technicianData.name}!
            </h1>

            {/* KPI Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard
                    title="Current Job Status"
                    value={currentJob.status}
                    icon={Wrench}
                />
                <StatCard
                    title="Customer Satisfaction"
                    value={`${customerSatisfaction}/5`}
                    icon={Smile} // replaced HeartHandshake with Smile
                />
                <StatCard
                    title="Average Job Time"
                    value={technicianData.performanceMetrics.averageTime}
                    icon={Calendar}
                />
                <StatCard
                    title="Job Completion Rate"
                    value={`${completionRate}%`}
                    icon={CheckCircle}
                />
                <StatCard
                    title="Jobs in Queue (Today)"
                    value={jobsInQueue}
                    icon={ClipboardList}
                />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Current Job Info */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <MapPin className="mr-2 h-5 w-5 text-blue-500" /> Current Job
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

                {/* Update Job Status */}
                <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <ClipboardList className="mr-2 h-5 w-5 text-blue-500" /> Update Job Status
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

            {/* My Schedule */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <ClipboardList className="mr-2 h-5 w-5 text-blue-500" /> My Schedule
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

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
                    Status updated successfully!
                </div>
            )}
        </div>
    );
};

/* -------------------------
   Retail Associate Dashboard
   ------------------------- */
const RetailAssociateDashboard = () => {
  const [data, setData] = useState(retailDataInit);

  // Update daily sales and adjust the selected monthly category by the delta
  const updateDailySales = (val) => {
    const prev = Number(data.dailySales || 0);
    const delta = Number(val) - prev;

    const updatedCategories = data.monthlySalesByCategory.map((c) =>
      c.category === data.selectedCategory ? { ...c, sales: c.sales + delta } : c
    );

    setData({
      ...data,
      dailySales: Number(val),
      monthlySalesByCategory: updatedCategories,
      customerFeedbackCount: data.customerFeedbackCount + 1, // each sale increments feedback counter (as requested)
    });
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Store Dashboard - {data.storeName}</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-500 text-sm">Daily Sales (Today)</p>
          <input
            type="number"
            value={data.dailySales}
            onChange={(e) => updateDailySales(Number(e.target.value))}
            className="border rounded px-2 mb-2 w-full"
          />
          <select
            value={data.selectedCategory}
            onChange={(e) => setData({ ...data, selectedCategory: e.target.value })}
            className="border rounded px-2 w-full"
          >
            {data.monthlySalesByCategory.map((c) => (
              <option key={c.category} value={c.category}>
                {c.category}
              </option>
            ))}
          </select>
        </div>

        <StatCard title="Upcoming Tasks" value="3" icon={ClipboardList} />
        <StatCard title="Customer Feedback" value={`${data.customerFeedbackCount} new`} icon={MessageCircle} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Daily Sales (Last 5 Days)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: "Mon", sales: 1500 },
                { name: "Tue", sales: 1800 },
                { name: "Wed", sales: 1650 },
                { name: "Thu", sales: 2100 },
                { name: "Fri", sales: 2500 },
              ]}
            >
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
            <BarChart layout="vertical" data={data.monthlySalesByCategory}>
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
    </div>
  );
};

/* -------------------------
   Root App
   ------------------------- */
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
    <div className="min-h-screen bg-gray-100 font-sans antialiased text-gray-800">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Dashboard Mockup</h1>
            <nav className="flex items-center space-x-2">
              {dashboards.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setActiveDashboard(d.id)}
                  className={`flex items-center px-4 py-2 rounded-full font-medium text-sm transition-colors duration-200 ${
                    activeDashboard === d.id ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-200"
                  }`}
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



