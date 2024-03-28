// Installed Packages
import { app, server } from "./socket.js"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config();

// App routes 
import AuthRoute from "./routes/auth.js";
import UserRoute from "./routes/user.js";
import PasswordRoute from "./routes/password.js";
import OrdersRoute from "./routes/orders.js";
import AnalyticsRoute from "./routes/analytics.js";
import SettingsRoute from "./routes/settings.js";

// Initializations and variable naming
app.use(cors({
    origin: [ 'http://localhost:3000', 'https://kisheen.vercel.app', 'https://kisheen.com' ],
    method: 'GET, POST, PUT, PATCH, DELETE',
    credentials: true,
}));

// App routing
app.use("/auth", AuthRoute);
app.use("/password", PasswordRoute);
app.use("/user", UserRoute);
app.use("/orders", OrdersRoute);
app.use("/analytics", AnalyticsRoute);
app.use("/settings", SettingsRoute);

//Running the app
server.listen(process.env.PORT, () => {
    console.log(`app running on port ${process.env.PORT}`)
});