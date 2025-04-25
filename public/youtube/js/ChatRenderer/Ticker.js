(function(root, factory) {
  root.chatRendererTicker = factory(
    root.chatRendererConstants,
    root.chatRendererImgShadow.default,
  )
}(this,
/**
 * @import * as constants from './constants'
 * @import * as ImgShadow from './ImgShadow'
 * @param {typeof constants} constants
 * @param {typeof ImgShadow.default} ImgShadow
 */
function(constants, ImgShadow) {
  const exports = {}

  exports.default = {
    template: `
  <yt-live-chat-ticker-renderer :hidden="showMessages.length === 0">
    <transition-group tag="div" :css="false" @enter="onTickerItemEnter" @leave="onTickerItemLeave"
      id="items" class="style-scope yt-live-chat-ticker-renderer"
    >
      <yt-live-chat-ticker-paid-message-item-renderer v-for="message in showMessages" :key="message.raw.id"
        tabindex="0" class="style-scope yt-live-chat-ticker-renderer" style="overflow: hidden;"
      >
        <div id="container" dir="ltr" class="style-scope yt-live-chat-ticker-paid-message-item-renderer" :style="{
          background: message.bgColor,
        }">
          <div id="content" class="style-scope yt-live-chat-ticker-paid-message-item-renderer" :style="{
            color: message.color
          }">
            <img-shadow id="author-photo" height="24" width="24" class="style-scope yt-live-chat-ticker-paid-message-item-renderer"
              :imgUrl="message.raw.avatarUrl"
            ></img-shadow>
            <span id="text" dir="ltr" class="style-scope yt-live-chat-ticker-paid-message-item-renderer">{{ message.text }}</span>
          </div>
        </div>
      </yt-live-chat-ticker-paid-message-item-renderer>
    </transition-group>
  </yt-live-chat-ticker-renderer>
    `,
    name: 'Ticker',
    components: {
      ImgShadow
    },
    props: {
      messages: Array,
      showGiftName: Boolean
    },
    data() {
      return {
        MESSAGE_TYPE_MEMBER: constants.MESSAGE_TYPE_MEMBER,

        curTime: new Date(),
        updateTimerId: window.setInterval(this.updateProgress, 1000),
      }
    },
    computed: {
      showMessages() {
        let res = []
        for (let message of this.messages) {
          if (!this.needToShow(message)) {
            continue
          }
          res.push({
            raw: message,
            bgColor: this.getBgColor(message),
            color: this.getColor(message),
            text: this.getText(message)
          })
        }
        return res
      },
    },
    beforeDestroy() {
      window.clearInterval(this.updateTimerId)
    },
    methods: {
      async onTickerItemEnter(el, done) {
        let width = el.clientWidth
        if (width === 0) {
          // CSS指定了不显示固定栏
          done()
          return
        }
        el.style.width = 0
        await this.$nextTick()
        el.style.width = `${width}px`
        window.setTimeout(done, 200)
      },
      onTickerItemLeave(el, done) {
        el.classList.add('sliding-down')
        window.setTimeout(() => {
          el.classList.add('collapsing')
          el.style.width = 0
          window.setTimeout(() => {
            el.classList.remove('sliding-down')
            el.classList.remove('collapsing')
            el.style.width = 'auto'
            done()
          }, 200)
        }, 200)
      },

      needToShow(message) {
        let pinTime = this.getPinTime(message)
        return (new Date() - message.addTime) / (60 * 1000) < pinTime
      },
      getBgColor(message) {
        let color1, color2
        if (message.type === constants.MESSAGE_TYPE_MEMBER) {
          color1 = 'rgba(15,157,88,1)'
          color2 = 'rgba(11,128,67,1)'
        } else {
          let config = constants.getPriceConfig(message.price)
          color1 = config.colors.contentBg
          color2 = config.colors.headerBg
        }
        let pinTime = this.getPinTime(message)
        let progress = (1 - ((this.curTime - message.addTime) / (60 * 1000) / pinTime)) * 100
        if (progress < 0) {
          progress = 0
        } else if (progress > 100) {
          progress = 100
        }
        return `linear-gradient(90deg, ${color1}, ${color1} ${progress}%, ${color2} ${progress}%, ${color2})`
      },
      getColor(message) {
        if (message.type === constants.MESSAGE_TYPE_MEMBER) {
          return 'rgb(255,255,255)'
        }
        return constants.getPriceConfig(message.price).colors.header
      },
      getText(message) {
        if (message.type === constants.MESSAGE_TYPE_MEMBER) {
          return '会员'
        }
        return `CN¥${constants.formatCurrency(message.price)}`
      },
      getPinTime(message) {
        if (message.type === constants.MESSAGE_TYPE_MEMBER) {
          return 2
        }
        return constants.getPriceConfig(message.price).pinTime
      },
      updateProgress() {
        // 更新进度
        this.curTime = new Date()

        // 删除过期的消息
        let filteredMessages = []
        let messagesChanged = false
        for (let message of this.messages) {
          let pinTime = this.getPinTime(message)
          if ((this.curTime - message.addTime) / (60 * 1000) >= pinTime) {
            messagesChanged = true
            continue
          }
          filteredMessages.push(message)
        }
        if (messagesChanged) {
          this.$emit('update:messages', filteredMessages)
        }
      },
    }
  }

  return exports
}))
