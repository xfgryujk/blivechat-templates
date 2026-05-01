(function(root, factory) {
  root.chatRendererPaidMessage = factory(
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
  <yt-live-chat-paid-message-renderer class="style-scope yt-live-chat-item-list-renderer" allow-animations
    :show-only-header="!content" :style="{
      '--yt-live-chat-paid-message-primary-color': color.contentBg,
      '--yt-live-chat-paid-message-secondary-color': color.headerBg,
      '--yt-live-chat-paid-message-header-color': color.header,
      '--yt-live-chat-paid-message-author-name-color': color.authorName,
      '--yt-live-chat-paid-message-timestamp-color': color.time,
      '--yt-live-chat-paid-message-color': color.content
    }"
    :blc-price-level="priceConfig.priceLevel"
  >
    <div id="card" class="style-scope yt-live-chat-paid-message-renderer">
      <div id="header" class="style-scope yt-live-chat-paid-message-renderer">
        <img-shadow id="author-photo" height="40" width="40" class="style-scope yt-live-chat-paid-message-renderer"
          :imgUrl="avatarUrl"
        ></img-shadow>
        <div id="header-content" class="style-scope yt-live-chat-paid-message-renderer">
          <div id="header-content-primary-column" class="style-scope yt-live-chat-paid-message-renderer">
            <div id="author-name" class="style-scope yt-live-chat-paid-message-renderer">{{ authorName }}</div>
            <div id="purchase-amount" class="style-scope yt-live-chat-paid-message-renderer">{{ showPriceText }}</div>
          </div>
          <span id="timestamp" class="style-scope yt-live-chat-paid-message-renderer">{{ timeText }}</span>
        </div>
      </div>
      <div id="content" class="style-scope yt-live-chat-paid-message-renderer">
        <div id="message" dir="auto" class="style-scope yt-live-chat-paid-message-renderer">{{ content }}</div>
      </div>
    </div>
  </yt-live-chat-paid-message-renderer>
    `,
    name: 'PaidMessage',
    components: {
      ImgShadow
    },
    props: {
      avatarUrl: String,
      authorName: String,
      price: Number, // 价格，人民币
      priceText: String,
      time: Date,
      content: String
    },
    computed: {
      priceConfig() {
        return constants.getPriceConfig(this.price)
      },
      color() {
        return this.priceConfig.colors
      },
      showPriceText() {
        return this.priceText || `CN¥${constants.formatCurrency(this.price)}`
      },
      timeText() {
        return constants.getTimeTextHourMin(this.time)
      }
    }
  }

  return exports
}))
