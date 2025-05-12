import express from 'express';
import {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
} from '../data/anoucement.controller.js';
import xss from 'xss';
import { isValidString } from '../utils/validation.utils.js';
import { isLoggedIn } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/roleCheck.middleware.js';

const router = express.Router();
const app = express();
//load add announcement page
//test xss
//testing done working fine
router.route('/add').get(isLoggedIn, checkRole('admin'), (req, res) => {
  res.render('addAnouncement', {
    title: 'Add Announcement',
  });
}).post(
    isLoggedIn,
    checkRole('admin'),
    async (req, res) => {
        let title = xss(req.body.title);
        let content = xss(req.body.content);
        try {
        // Validate input
        if (!title || !content) {
            req.session.toast = {
            type: 'error',
            message: 'Title and content are required',
            };
            return res.redirect('/announcements/add');
        }
        
        // Create a new announcement
        let newAnnouncement= await createAnnouncement(title, content);
        if (!newAnnouncement) {
            req.session.toast = {
            type: 'error',
            message: 'Error creating announcement',
            };
            return res.redirect('/announcements/add');
        }
        req.session.toast = {
            type: 'success',
            message: 'Announcement created successfully',
        };
        // Redirect to the announcements page
        return res.redirect('/announcements');
        } catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: error.message, 
        };
        res.redirect('/announcements/add');
        }
    }
    );
//load all announcement page
router.route('/').get(isLoggedIn, async (req, res) => {
  try {
    const announcements = await getAllAnnouncements();
    res.render('allAnouncements', {
      title: 'All Announcements',
      announcements,
    });
  } catch (error) {
    console.error(error);
    req.session.toast = {
      type: 'error',
      message: 'Failed to fetch announcements',
    };
    res.redirect('/users/userProfile'); 
  }
});

export default router;