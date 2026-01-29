const User = require('../models/User');
const { encryptValue, decryptValue } = require('../utils/encryption');
const { logAudit } = require('../utils/audit');

function formatProfile(user) {
  return {
    email: user.email,
    role: user.role,
    name: user.profile?.name || '',
    avatarUrl: user.profile?.avatarUrl || '',
    bio: user.profile?.bio || '',
    phone: decryptValue(user.profile?.phoneEncrypted),
    address: decryptValue(user.profile?.addressEncrypted),
  };
}

async function getMyProfile(req, res) {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json({ profile: formatProfile(user) });
}

async function updateMyProfile(req, res) {
  const { name, avatarUrl, bio, phone, address } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.profile = user.profile || {};
  if (name !== undefined) user.profile.name = name;
  if (avatarUrl !== undefined) user.profile.avatarUrl = avatarUrl;
  if (bio !== undefined) user.profile.bio = bio;
  if (phone !== undefined) user.profile.phoneEncrypted = encryptValue(phone);
  if (address !== undefined) user.profile.addressEncrypted = encryptValue(address);

  await user.save();

  await logAudit({
    req,
    userId: user._id,
    role: user.role,
    action: 'PROFILE_UPDATED',
    success: true,
  });

  return res.json({ profile: formatProfile(user) });
}

module.exports = { getMyProfile, updateMyProfile };
