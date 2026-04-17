require("dotenv").config();
require("./cron/courseCleanupCron");
const express = require("express");
const cors = require("cors");
const app = express();
const teacherRoutes = require("./routes/teacherRoutes");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const faqsRoute = require("./routes/faqsRoutes");
const contactInfoRoutes = require("./routes/contactInfoRoutes");
const newsRoutes = require("./routes/newsRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const videoRoutes = require("./routes/videoRoutes");
const contactFormRoutes = require("./routes/contactFormRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const registrationsRoutes = require("./routes/registrationsRoutes");
const bankInfoRoutes = require("./routes/bankInfoRoutes");
const certificateRoutes = require("./routes/certificateRoutes");




app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/faqs", faqsRoute);
app.use("/api/contact-info", contactInfoRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api", videoRoutes);
app.use("/api", contactFormRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/registrations", registrationsRoutes);
app.use("/api/bank-info", bankInfoRoutes);
app.use("/api/certificates", certificateRoutes);









const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});