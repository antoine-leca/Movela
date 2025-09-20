import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ListMovies from "./pages/ListMoviesByGenre";
import ListSeries from "./pages/ListSeriesByGenre";
import ContentDetails from "./pages/ContentDetails";
import ActorDetails from "./pages/ActorDetails";
import ListContentAll from "./pages/ListContentAll";
import SearchResults from "./pages/SearchResults";


function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies/list/by-genre" element={<ListMovies />} />
        <Route path="/tv/list/by-genre" element={<ListSeries />} />
        <Route path="/details/:type/:id" element={<ContentDetails />} />
        <Route path="/person/:id" element={<ActorDetails />} />
        <Route path="/:type/list" element={<ListContentAll />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;