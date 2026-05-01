(function(root, factory) {
  root.chatRendererImgShadow = factory()
}(this, function() {
  const exports = {}

  const DEFAULT_AVATAR_URL = '//static.hdslb.com/images/member/noface.gif'

  exports.default = {
    template: `
  <yt-img-shadow class="no-transition" :height="height" :width="width" style="background-color: transparent;" loaded>
    <img id="img" class="style-scope yt-img-shadow" alt="" :height="height" :width="width" :src="showImgUrl" @error="onLoadError">
  </yt-img-shadow>
    `,
    name: 'ImgShadow',
    props: {
      imgUrl: String,
      height: String,
      width: String
    },
    data() {
      return {
        showImgUrl: this.imgUrl
      }
    },
    watch: {
      imgUrl(val) {
        this.showImgUrl = val
      }
    },
    methods: {
      onLoadError() {
        if (this.showImgUrl !== DEFAULT_AVATAR_URL) {
          this.showImgUrl = DEFAULT_AVATAR_URL
        }
      }
    }
  }

  return exports
}))
