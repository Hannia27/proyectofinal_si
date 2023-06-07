const auxiliar = {};

auxiliar.estaAutenticado  = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'NO AUTORIZADO')
    res.redirect("/users/signin");
};

module.exports = auxiliar;
