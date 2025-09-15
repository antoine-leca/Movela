import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ListMovies from "./pages/ListMoviesByGenre";
import ListSeries from "./pages/ListSeriesByGenre";
import ContentDetails from "./pages/ContentDetails";
import ActorDetails from "./pages/ActorDetails";
import ListContentAll from "./pages/ListContentAll";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies/list/by-genre" element={<ListMovies />} />
        <Route path="/tv/list/by-genre" element={<ListSeries />} />
        <Route path="/:type/list" element={<ListContentAll />} />
        <Route path="/details/:type/:id" element={<ContentDetails />} />
        <Route path="/person/:id" element={<ActorDetails />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;