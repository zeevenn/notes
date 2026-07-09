export default [
  {
    text: 'Fundamentals',
    collapsible: true,
    icon: 'basic',
    prefix: '/system-design/fundamentals/',
    children: [
      '',
      'scalability',
      'availability-vs-consistency',
      'load-balancing',
      'caching-strategies',
      'database-sharding'
    ]
  },
  {
    text: 'Case Studies',
    collapsible: true,
    icon: 'practice',
    prefix: '/system-design/cases/',
    children: [
      '',
      'design-url-shortener',
      'design-rate-limiter',
      'design-message-queue',
      'design-cache-system',
      'design-distributed-id',
      'design-search-system',
      'design-feed-system'
    ]
  }
]
