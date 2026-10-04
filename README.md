# CampusFlow

College event and crowd management website (HTML, CSS, Bootstrap, JavaScript, AngularJS, PHP, MySQL).

## Front end only
Open the folder in VS Code and run `index.html` with the Live Server extension
(or just double click it). Internet is needed for the Bootstrap, AngularJS and font links.
Events come from `js/events.js` for now.

## With PHP and MySQL
1. Start Apache and MySQL in XAMPP.
2. Copy this folder into `htdocs`.
3. In phpMyAdmin, import `database/database.sql`.
4. Check the database settings in `php/config.php`.
5. Open `http://localhost/CampusFlow/index.html`.
6. The organizer login needs an account in the `admins` table. The steps to
   create one are written at the end of `database/database.sql`.
