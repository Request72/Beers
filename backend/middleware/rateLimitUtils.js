function ipKeyGenerator(req) {
  const ip = req.ip || req.connection?.remoteAddress || '';
  if (ip.includes(':')) {
    const parts = ip.split(':');
    return parts[parts.length - 1] || ip;
  }
  return ip;
}

module.exports = { ipKeyGenerator };
