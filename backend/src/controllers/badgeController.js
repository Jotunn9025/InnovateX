exports.listBadges = (req, res) => {
  const badges = [
    { name: 'Frequent Player', description: 'Booked 10+ times', icon: '🏅' },
    { name: 'Champion', description: 'Won a tournament', icon: '🏆' },
    { name: 'Community Star', description: 'Active in community', icon: '🌟' },
    { name: 'Newbie', description: 'Just joined', icon: '🎉' },
  ];
  res.json({ badges });
}; 