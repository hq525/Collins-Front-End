import React from "react";
import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
// import EventPage from "./volunteer/event/EventPage";
// import AdminIndex from "./admin/Index";
// import AdminCreateEvent from "./admin/event/CreateEvent";
// import AdminViewEvent from "./admin/event/ViewEvent";
// import AdminViewEvents from "./admin/event/ViewEvents";
// import SingleEventPage from "./volunteer/event/SingleEventPage";
// import Login from "./auth/Login";
// import Register from "./auth/Register";
// import Password from "./auth/Password";
// import Profile from "./auth/Profile";
// import EventListPage from "./volunteer/event/EventListPage";
// import Dashboard from "./admin/report/Dashboard";
// import Users from "./admin/auth/Users";
// import PersonalEventListPage from "./volunteer/event/PersonalEventListPage";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {/* <Route path="/" component={EventPage} exact />
        <Route path="/admin/events/index" component={AdminIndex} exact />
        <Route path="/login" component={Login} exact />
        <Route path="/signUp" component={Register} exact />
        <Route path="/password" component={Password} exact />
        <Route path="/profile" component={Profile} exact />
        <Route path="/admin/report/dashboard" component={Dashboard} exact />
        <Route path="/admin/events" component={AdminViewEvent} exact />
        <Route path="/admin/events/all" component={AdminViewEvents} exact />
        <Route path="/admin/events/create" component={AdminCreateEvent} exact />
        <Route path="/volunteer/events" component={SingleEventPage} exact />
        <Route path="/volunteer/events/list" component={EventListPage} exact />
        <Route path="/admin/users/all" component={Users} exact />
        <Route
          path="/volunteer/events/manage"
          component={PersonalEventListPage}
          exact
        /> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
