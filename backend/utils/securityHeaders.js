// Security summary (student note): helmet sets headers like CSP, HSTS, and frame-guard
// to reduce XSS, clickjacking, and downgrade attacks.
const helmet = require('helmet');

function securityHeaders() {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    frameguard: { action: 'deny' },
    referrerPolicy: { policy: 'no-referrer' },
    permissionsPolicy: {
      features: {
        geolocation: [],
        camera: [],
        microphone: [],
        payment: [],
      },
    },
    dnsPrefetchControl: { allow: false },
    xssFilter: false,
    hidePoweredBy: true,
  });
}

module.exports = { securityHeaders };
