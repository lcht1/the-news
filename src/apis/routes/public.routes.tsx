import { Route, Routes } from "react-router-dom";

import { Category } from "../../pages/Category";
import { Home } from "../../pages/Home";
import { Search } from "../../pages/Search";

export const PublicRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:uri/:category" element={<Category />} />
            <Route path="/search" element={<Search />} />
        </Routes>
    );
};
