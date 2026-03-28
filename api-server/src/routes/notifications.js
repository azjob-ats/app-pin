const { Router } = require('express');
const { MOCK_NOTIFICATIONS } = require('../data/notifications');
const { success, failure, paginated } = require('../helpers/response');

const router = Router();

// GET /api/notifications
router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(40, Math.max(1, parseInt(req.query.pageSize) || 20));
  const onlyUnread = req.query.unread === 'true';

  const notifications = onlyUnread
    ? MOCK_NOTIFICATIONS.filter((n) => !n.isRead)
    : [...MOCK_NOTIFICATIONS];

  res.json(success(paginated(notifications, page, pageSize, notifications.length, { unread: onlyUnread })));
});

// PATCH /api/notifications/:id/read — mark single as read
router.patch('/:id/read', (req, res) => {
  const notification = MOCK_NOTIFICATIONS.find((n) => n.id === req.params.id);

  if (!notification) {
    return res.status(404).json(failure('Notification not found', 404, 'notifications/not-found', 'ApiResponse'));
  }

  notification.isRead = true;
  res.json(success(notification));
});

// POST /api/notifications/read-all — mark all as read
router.post('/read-all', (req, res) => {
  MOCK_NOTIFICATIONS.forEach((n) => { n.isRead = true; });
  res.json(success({ message: 'All notifications marked as read' }));
});

module.exports = router;
