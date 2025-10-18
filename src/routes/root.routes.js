import { Router } from "express";
import { 
    index_view,
    about_view,
    contact_view,
    create_contact_form
} from "../controllers/root.controller.js";
import { dashboard_view } from "../controllers/admin.controller.js";

const router = Router();

// Home Route
router.get('/', index_view);
router.get('/about', about_view);
router.get('/contact', contact_view);
router.post('/contact', create_contact_form);


router.get('/admin', (req, res) => {
    res.status(301).redirect('/admin/dashboard');
});
router.get('/admin/dashboard', dashboard_view);


export default router;