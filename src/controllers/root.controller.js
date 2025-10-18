import { check, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import * as courseService from '../modules/course/services/Course.service.js';
import * as contactService from '../modules/public/services/Contact.service.js';
import {sendContactNotification} from '../utils/email.js';

// Derive the equivalent of __dirname
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();


const page_logo = process.env.PAGELOGO

const index_view = async (req, res) => {
    try {
        const courses = await courseService.findAll({ limit: 3, offset: 0 });
        res.render('index', {
            pageTitle: "Home",
            courses: courses.courses,
            pageLogo: page_logo
        });
    } catch (err) {
        res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err.message });
    }
};

const about_view = async (req, res) => {
    try {
        res.render('about', {
            pageTitle: "About",
            pageLogo: page_logo
        });
    } catch (error) {
        res.render('./errors/500', {message: "Internal Serval Error"});
    }
}

const contact_view = async (req, res) => {
    try {
        res.render('contact', {
            pageTitle: "Contact",
            pageLogo: page_logo
        });
    } catch (error) {
        res.render('./errors/500', {message: "Internal Serval Error"});
    }
}

const create_contact_form = async (req, res) => {
    try {
        //handle form submission
        const contact_form = await contactService.create(req.body);
        //send notification email to admin
        await sendContactNotification({
            userName: `${contact_form.first_name} ${contact_form.last_name}`,
            userEmail: contact_form.email,
            message: contact_form.message
        });

        res.status(201).json({message: "Contact form submitted successfully", contact_form, redirectTo : '/contact'});
    } catch (error) {
        res.status(500).json({message: "Internal Serval Error"});
    }
}


export {index_view, about_view, contact_view, create_contact_form}