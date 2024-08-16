import { Route, Routes } from "react-router-dom";

import { Home } from "../../pages/Home";
import { Category } from "../../pages/Category";

export const PublicRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:uri/:category" element={<Category />} />
        </Routes>
    );
};
