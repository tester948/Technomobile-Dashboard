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
  const [data, setData] = useState(technicianDataInit);
  const [toast, setToast] = useState("");

  const updateStatus = () => {
    const prevStatus = data.currentJob.status;
    const newStatus = document.getElementById("status-select").value;

    let { completionRate, jobsInQueue, customerSatisfaction } = data.performanceMetrics;

    if (newStatus === "Complete" && prevStatus !== "Complete") {
      jobsInQueue = Math.max(0, jobsInQueue - 1);
      completionRate = Math.min(100, completionRate + 20);
      customerSatisfaction = Math.min(5, Number((customerSatisfaction + 0.1).toFixed(1)));
      setToast("✅ Job marked complete! KPIs updated.");
      setTimeout(() => setToast(""), 2000);
    }

    setData({
      ...data,
      currentJob: { ...data.currentJob, status: newStatus },
      performanceMetrics: { ...data.performanceMetrics, completionRate, jobsInQueue, customerSatisfaction },
    });
  };

  return (
    <div className="p-8 space-y-8">
      {toast && <div className="bg-green-100 text-green-800 p-2 rounded">{toast}</div>}
      <h1 className="text-3xl font-bold text-gray-900">Hello, {data.name}!</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Current Job Status" value={data.currentJob.status} icon={Wrench} />
        <StatCard title="Customer Satisfaction" value={`${data.performanceMetrics.customerSatisfaction}/5`} icon={TrendingUp} />
        <StatCard title="Job Completion Rate" value={`${data.performanceMetrics.completionRate}%`} icon={CheckCircle} />
        <StatCard title="Jobs in Queue (Today)" value={data.performanceMetrics.jobsInQueue} icon={ClipboardList} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-blue-500" /> Current Job
          </h3>
          <p className="text-gray-900 font-medium text-xl">{data.currentJob.customer}</p>
          <p className="text-gray-600 mb-2">{data.currentJob.address}</p>
          <p className="text-gray-500 text-sm mb-4">{data.currentJob.description}</p>
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <span className="font-semibold">ETA:</span>
            <span>{data.currentJob.eta}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <ClipboardList className="mr-2 h-5 w-5 text-blue-500" /> Update Job Status
            </h3>
            <select id="status-select" defaultValue={data.currentJob.status} className="border rounded px-2 w-full mb-4">
              <option value="En route">En route</option>
              <option value="In Progress">In Progress</option>
              <option value="On hold">On hold</option>
              <option value="Complete">Complete</option>
            </select>
            <button onClick={updateStatus} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
