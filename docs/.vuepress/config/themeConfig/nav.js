// nav
module.exports = [
  { text: '首页', link: '/' },
  {
    text: '技术',
    items: [
      // 说明：以下所有link的值只是在相应md文件定义的永久链接（不是什么特殊生成的编码）。另外，注意结尾是有斜杠的
      { text: '大数据', link: '/categories/?category=%E5%A4%A7%E6%95%B0%E6%8D%AE/' },
    ],
  },
  { text: '关于', link: '/about/' },
  { text: '收藏', link: '/bookmarks/' },
  {
    text: '索引',
    link: '/archives/',
    items: [
      { text: '分类', link: '/categories/' },
      { text: '标签', link: '/tags/' },
      { text: '归档', link: '/archives/' },
    ],
  },
]
