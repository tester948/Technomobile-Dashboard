import React, { useState } from "react";

export default function TrainingExercise() {
  // ---------------------- FIELD TECHNICIAN ----------------------
  const [currentJobStatus, setCurrentJobStatus] = useState("En route");
  const [jobCompletionRate, setJobCompletionRate] = useState(85);
  const [customerSatisfaction, setCustomerSatisfaction] = useState(90);
  const [urgentJobs, setUrgentJobs] = useState(3); // New KPI

  const handleJobStatusChange = (status) => {
    setCurrentJobStatus(status);

    if (status === "Complete") {
      setJobCompletionRate((prev) => prev + 1); // Auto increase by 1%
      setCustomerSatisfaction((prev) => prev + 1); // Auto increase by 1%
      setUrgentJobs((prev) => prev - 1); // Auto decrease urgent jobs
    }
  };

  // ---------------------- RETAIL ASSOCIATE ----------------------
  const [productInventory, setProductInventory] = useState(100);
  const [dailySales, setDailySales] = useState(0);
  const [customerFeedback, setCustomerFeedback] = useState(15);
  const [monthlySalesByCategory, setMonthlySalesByCategory] = useState({
    Electronics: 5000,
    Clothing: 3000,
    Accessories: 1500,
    Home: 2000,
  });
  const [selectedCategory, setSelectedCategory] = useState("Electronics");

  const handleDailySalesUpdate = (value) => {
    const numericValue = parseFloat(value) || 0;
    setDailySales(numericValue);

    setMonthlySalesByCategory((prev) => ({
      ...prev,
      [selectedCategory]: prev[selectedCategory] + numericValue,
    }));

    setCustomerFeedback((prev) => prev + 1); // Auto increase with each sale
  };

  // ---------------------- OPERATIONS ----------------------
  const [jobs, setJobs] = useState({
    "J-102": "Pending",
  });
  const [pendingJobs, setPendingJobs] = useState(10);
  const [lowStockItems, setLowStockItems] = useState({
    "Network Cable (10ft)": 20,
    "Router": 15,
    "Modem": 10,
    "Fiber Cable": 25,
    "Switch": 12,
  });
  const [inStockItems, setInStockItems] = useState(
    Object.values(lowStockItems).reduce((a, b) => a + b, 0)
  );
  const [dailyTaskCompletion, setDailyTaskCompletion] = useState(5);

  const handleJobUpdate = (jobId, status) => {
    setJobs((prev) => ({
      ...prev,
      [jobId]: status,
    }));

    if (status === "Complete") {
      setPendingJobs((prev) => prev - 1); // Auto decrease pending jobs
      setDailyTaskCompletion((prev) => prev + 1); // Auto increase completed tasks
    }
  };

  const handleStockChange = (item, quantity) => {
    setLowStockItems((prev) => {
      const updated = { ...prev, [item]: quantity };
      setInStockItems(Object.values(updated).reduce((a, b) => a + b, 0));
      return updated;
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Training Dashboard</h1>

      {/* FIELD TECHNICIAN */}
      <section>
        <h2>Field Technician</h2>
        <p>
          Current Job Status:
          <select
            value={currentJobStatus}
            onChange={(e) => handleJobStatusChange(e.target.value)}
          >
            <option>En route</option>
            <option>In Progress</option>
            <option>Complete</option>
          </select>
        </p>
        <p>Job Completion Rate: {jobCompletionRate}%</p>
        <p>Customer Satisfaction: {customerSatisfaction}%</p>
        <p>
          Urgent Jobs:{" "}
          <input
            type="number"
            value={urgentJobs}
            onChange={(e) => setUrgentJobs(parseInt(e.target.value) || 0)}
          />
        </p>
      </section>

      {/* RETAIL ASSOCIATE */}
      <section>
        <h2>Retail Associate</h2>
        <p>
          Product Inventory:{" "}
          <input
            type="number"
            value={productInventory}
            onChange={(e) => setProductInventory(parseInt(e.target.value) || 0)}
          />
        </p>
        <p>
          Daily Sales:{" "}
          <input
            type="number"
            value={dailySales}
            onChange={(e) => handleDailySalesUpdate(e.target.value)}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {Object.keys(monthlySalesByCategory).map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </p>
        <p>Customer Feedback: {customerFeedback}</p>
        <h4>Monthly Sales by Category:</h4>
        <ul>
          {Object.entries(monthlySalesByCategory).map(([cat, value]) => (
            <li key={cat}>
              {cat}: ${value}
            </li>
          ))}
        </ul>
      </section>

      {/* OPERATIONS */}
      <section>
        <h2>Operations</h2>
        <p>
          Job J-102 Status:{" "}
          <select
            value={jobs["J-102"]}
            onChange={(e) => handleJobUpdate("J-102", e.target.value)}
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Complete</option>
          </select>
        </p>
        <p>Pending Jobs: {pendingJobs}</p>
        <p>Daily Task Completion: {dailyTaskCompletion}</p>
        <h4>Inventory Stock:</h4>
        <ul>
          {Object.entries(lowStockItems).map(([item, qty]) => (
            <li key={item}>
              {item}:{" "}
              <input
                type="number"
                value={qty}
                onChange={(e) =>
                  handleStockChange(item, parseInt(e.target.value) || 0)
                }
              />
            </li>
          ))}
        </ul>
        <p>In-Stock Items: {inStockItems}</p>
      </section>
    </div>
  );
}
