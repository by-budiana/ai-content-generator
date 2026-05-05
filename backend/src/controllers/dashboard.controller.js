const prisma = require('../lib/prisma');

exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalGenerated = await prisma.content.count({
      where: { userId }
    });

    const totalFavorites = await prisma.content.count({
      where: { userId, isFavorite: true }
    });

    const typeStats = await prisma.content.groupBy({
      by: ['type'],
      where: { userId },
      _count: {
        id: true
      }
    });

    // Recent activity (last 5)
    const recentActivity = await prisma.content.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    res.json({
      totalGenerated,
      totalFavorites,
      typeStats,
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
