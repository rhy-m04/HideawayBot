const MOD_ROLE_IDS = [
  '1511500082053120020',
  '1511500082753830992',
  '1511500080031469790',
  '1511500077137399928',
];

export function hasModPermission(member) {
  if (!member) return false;
  return member.roles.cache.some(role => MOD_ROLE_IDS.includes(role.id));
}
