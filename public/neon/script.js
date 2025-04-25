const app = Vue.createApp({
  setup() {
    document.body.removeAttribute('hidden')
  },
  data () {
    return {
      comments: []
    }
  },
  methods: {
    getClassName(comment) {
      if (comment.commentIndex % 2 === 0) {
        return 'comment even'
      }
      return 'comment odd'
    },
    getStyle(comment) {
      if (comment.data.colors) {
        const textColor = comment.data.colors.bodyTextColor
        const bgColor = comment.data.colors.bodyBackgroundColor
        const style = {
          '--lcv-background-color': bgColor,
          '--lcv-text-color': textColor,
          '--lcv-comment-shadow': 'none',
          '--lcv-neon-shadow': 'none',
          '--lcv-neon-box-shadow': 'none',
          '--lcv-box-shadow': `0 0 4px #fff,
          0 0 8px #fff,
          0 0 12px #fff,
          0 0 16px ${bgColor},
          0 0 20px ${bgColor},
          0 0 24px ${bgColor},
          0 0 28px ${bgColor},
          0 0 32px ${bgColor}`
        }
        return style
      }
    }
  },
  mounted () {
    let cache = new Map()
    commentIndex = 0
    OneSDK.setup({
      permissions: OneSDK.usePermission([OneSDK.PERM.COMMENT])
    })
    OneSDK.subscribe({
      action: 'comments',
      callback: (comments) => {
        const newCache = new Map()
        comments.forEach(comment => {
          const index = cache.get(comment.data.id)
          if (isNaN(index)) {
            comment.commentIndex = commentIndex
            newCache.set(comment.data.id, commentIndex)
            ++commentIndex
          } else {
            comment.commentIndex = index
            newCache.set(comment.data.id, index)
          }
        })
        cache = newCache
        this.comments = comments
      }
    })
    OneSDK.connect()
  },
})
app.component('one-marquee', window.OneMarquee())
OneSDK.ready().then(() => {
  app.mount("#container");
})
