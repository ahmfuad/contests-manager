let passport = require('passport');

module.exports = function (app) {
    app.get('/auth/vkontakte', passport.authenticate('vkontakte'));

    app.get('/auth/vkontakte/callback',
        passport.authenticate('vkontakte', {
            successRedirect: '/',
            failureRedirect: '/login'
        })
    );

    app.get('/user', (req, res) => {
        res.json(req.user);
    });

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
};