import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js"
import SequelizeStore from "connect-session-sequelize";
import FileUpload from "express-fileupload";
// route admin 
import UserRoute from "./routes/admin/UserRoute";
import CategoryRoute from "./routes/admin/CategoryRoute";
import SubCategoryRoute from "./routes/admin/SubCategoryRoute";
import ManagerRoute from "./routes/admin/ManagerRoute";
import ProductRoute from "./routes/admin/ProductRoute";
import AuthRoute from "./routes/admin/AuthRoute";
import SellerRoute from './routes/admin/SellerRoute';

// route user
import AuthUserRoute from "./routes/user/AuthUserRoute";

//genera route
import NotifyRoute from './routes/NotifyRoute';

dotenv.config();
const app = express();

// keep state login when restart server, save session to db
const sessionStore = SequelizeStore(session.Store)
const store = new sessionStore({
   db: db
});

app.use(session({
   secret: process.env.SESS_SECRET,
   resave: false,
   saveUninitialized: true,
   store: store, // config sessionStore
   cookie: {
      secure: 'auto',
   }
}));

// allow access from port 3000
app.use(cors({
   credentials: true,
   origin: 'http://localhost:3000'
}));

app.use(express.json());
app.use(FileUpload()); //upload file
app.use(express.static("public"));// show image url

// admin route
app.use('/admin', UserRoute);
app.use('/admin', ManagerRoute);
app.use('/admin', CategoryRoute);
app.use('/admin', SubCategoryRoute);
app.use('/admin', ProductRoute);
app.use('/admin', AuthRoute);
app.use('/admin', SellerRoute);

// user route
app.use(AuthUserRoute);

//genera route
app.use(NotifyRoute);

//store.sync(); // create session db

app.listen(process.env.APP_PORT, () => {
   console.log(`Server up and running ... http://localhost:${process.env.APP_PORT}`);
})

