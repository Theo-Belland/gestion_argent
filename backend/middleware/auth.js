const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Ajouter les informations de l'utilisateur à la requête
    req.user = decoded;
    req.userId = decoded.userId || decoded.id;

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = auth;