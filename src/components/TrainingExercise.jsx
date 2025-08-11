import React, { useState } from "react";
import { Card, CardContent, Typography, Grid, MenuItem, Select } from "@mui/material";

export default function TrainingExercise() {
  // ============================
  // FIELD TECHNICIAN STATE
  // ============================
  const [currentJobStatus, setCurrentJobStatus] = useState("En route");
  const [jobCompletionRate, setJobCompletionRate] = useState(85); // %
  const [customerSatisfaction, setCustomerSatisfaction] = useState(90); // %
  const [emergencyCalls, setEmergencyCalls] = useState(2); // New KPI

  const handleJobStatusChange = (status) => {
    setCurrentJobStatus(status);

    if (status === "Complete") {
      setJobCompletionRate((prev) => prev + 1); // fixed increment
      setCustomerSatisfaction((prev) => prev + 2); // fixed increment
    }
  };

  // ============================
  // RETAIL ASSOCIATE STATE
  // ============================
  const categories = ["Electronics", "Accessories", "Repairs", "Others"];
  const [dailySales, setDailySales] = useState(500);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [monthlySalesByCategory, setMonthlySalesByCategory] = useState({
    Electronics: 2000,
    Accessories: 1500,
    Repairs: 800,
    Others: 600,
  });
  const [customerFeedbackCount, setCustomerFeedbackCount] = useState(10);
  const [productInventory, setProductInventory] = useState({
    "Product A": 50,
  });

  const handleDailySalesChange = (value, category) => {
    const numericValue = Number(value);
    setDailySales(numericValue);

    setMonthlySalesByCategory((prev) => ({
      ...prev,
      [category]: prev[category] + numericValue,
    }));

    setCustomerFeedbackCount((prev) => prev + 1);
  };

  // ============================
  // OPERATIONS STATE
  // ============================
  const [jobs, setJobs] = useState({
    "J-102": "Pending",
  });
  const [pendingJobs, setPendingJobs] = useState(5);
  const [lowStockItems, setLowStockItems] = useState({
    "Network Cable (10ft)": 10,
    "Router": 5,
    "Fiber Splice Kit": 7,
    "Modem": 4,
    "Wi-Fi Extender": 6,
  });
  const [inStockItems, setInStockItems] = useState(
    Object.values(lowStockItems).reduce((a, b) => a + b, 0)
  );
  const [dailyTaskCompletion, setDailyTaskCompletion] = useState(8);

  const handleJobStatusUpdate = (jobId, status) => {
    setJobs((prev) => ({ ...prev, [jobId]: status }));

    if (status === "Complete") {
      setPendingJobs((prev) => prev - 1);
      setDailyTaskCompletion((prev) => prev + 1);
    }
  };

  const handleStockChange = (item, quantity) => {
    setLowStockItems((prev) => {
      const updated = { ...prev, [item]: quantity };
      setInStockItems(Object.values(updated).reduce((a, b) => a + b, 0));
      return updated;
    });
  };

  // ============================
  // CARD RENDER HELPER
  // ============================
  const renderCard = (title, value, onChange, type = "text", extra = null) => (
    <Card sx={{ backgroundColor: "#f5f5f5" }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        {type === "select" ? (
          <Select value={value} onChange={(e) => onChange(e.target.value)} fullWidth>
            {extra.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ width: "100%", padding: "6px", fontSize: "16px" }}
          />
        )}
      </CardContent>
    </Card>
  );

  return (
    <Grid container spacing={3}>
      {/* ================== FIELD TECHNICIAN ================== */}
      <Grid item xs={12}>
        <Typography variant="h5">Field Technician</Typography>
      </Grid>
      <Grid item xs={3}>
        {renderCard("Current Job Status", currentJobStatus, handleJobStatusChange, "select", [
          "En route",
          "In Progress",
          "Complete",
        ])}
      </Grid>
      <Grid item xs={3}>
        {renderCard("Job Completion Rate (%)", jobCompletionRate, setJobCompletionRate, "number")}
      </Grid>
      <Grid item xs={3}>
        {renderCard("Customer Satisfaction (%)", customerSatisfaction, setCustomerSatisfaction, "number")}
      </Grid>
      <Grid item xs={3}>
        {renderCard("Emergency Calls", emergencyCalls, setEmergencyCalls, "number")}
      </Grid>

      {/* ================== RETAIL ASSOCIATE ================== */}
      <Grid item xs={12}>
        <Typography variant="h5">Retail Associate</Typography>
      </Grid>
      <Grid item xs={3}>
        {renderCard("Product A Inventory", productInventory["Product A"], (val) =>
          setProductInventory((prev) => ({ ...prev, "Product A": Number(val) }))
        , "number")}
      </Grid>
      <Grid item xs={3}>
        {renderCard("Daily Sales", dailySales, (val) => handleDailySalesChange(val, selectedCategory), "number")}
      </Grid>
      <Grid item xs={3}>
        {renderCard("Category", selectedCategory, setSelectedCategory, "select", categories)}
      </Grid>
      <Grid item xs={3}>
        {renderCard("Customer Feedback Count", customerFeedbackCount, setCustomerFeedbackCount, "number")}
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">Monthly Sales by Category:</Typography>
        {categories.map((cat) => (
          <Typography key={cat}>
            {cat}: ${monthlySalesByCategory[cat]}
          </Typography>
        ))}
      </Grid>

      {/* ================== OPERATIONS ================== */}
      <Grid item xs={12}>
        <Typography variant="h5">Operations</Typography>
      </Grid>
      <Grid item xs={3}>
        {renderCard("Job J-102 Status", jobs["J-102"], (val) => handleJobStatusUpdate("J-102", val), "select", [
          "Pending",
          "In Progress",
          "Complete",
        ])}
      </Grid>
      <Grid item xs={3}>
        {renderCard("Pending Jobs", pendingJobs, setPendingJobs, "number")}
      </Grid>
      <Grid item xs={3}>
        {renderCard("Daily Task Completion", dailyTaskCompletion, setDailyTaskCompletion, "number")}
      </Grid>
      <Grid item xs={3}>
        {renderCard("In-Stock Items", inStockItems, setInStockItems, "number")}
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">Inventory:</Typography>
        {Object.keys(lowStockItems).map((item) => (
          <div key={item}>
            {item}:{" "}
            <input
              type="number"
              value={lowStockItems[item]}
              onChange={(e) => handleStockChange(item, Number(e.target.value))}
              style={{ width: "80px" }}
            />
          </div>
        ))}
      </Grid>
    </Grid>
  );
}
