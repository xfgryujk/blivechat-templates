(function(root, factory) {
  root.chatRendererTextMessage = factory(
    root.chatRendererConstants,
    root.chatRendererImgShadow.default,
    root.chatRendererAuthorChip.default,
  )
}(this,
/**
 * @import * as constants from './constants'
 * @import * as ImgShadow from './ImgShadow'
 * @import * as AuthorChip from './AuthorChip'
 * @param {typeof constants} constants
 * @param {typeof ImgShadow.default} ImgShadow
 * @param {typeof AuthorChip.default} AuthorChip
 */
function(constants, ImgShadow, AuthorChip) {
  const exports = {}

  // HSL
  const REPEATED_MARK_COLOR_START = [210, 100.0, 62.5]
  const REPEATED_MARK_COLOR_END = [360, 87.3, 69.2]

  exports.default = {
    template: `
  <yt-live-chat-text-message-renderer :author-type="authorTypeText" :blc-guard-level="privilegeType">
    <img-shadow id="author-photo" height="24" width="24" class="style-scope yt-live-chat-text-message-renderer"
      :imgUrl="avatarUrl"
    ></img-shadow>
    <div id="content" class="style-scope yt-live-chat-text-message-renderer">
      <span id="timestamp" class="style-scope yt-live-chat-text-message-renderer">{{ timeText }}</span>
      <author-chip class="style-scope yt-live-chat-text-message-renderer"
        :isInMemberMessage="false" :authorName="authorName" :authorType="authorType" :privilegeType="privilegeType"
      ></author-chip>
      <span id="message" class="style-scope yt-live-chat-text-message-renderer">
        <template v-for="(content, index) in contentParts">
          <span :key="index" v-if="content.type === CONTENT_PART_TYPE_TEXT">{{ content.text }}</span>
          <!-- 如果CSS设置的尺寸比属性设置的尺寸还大，在图片加载完后布局会变化，可能导致滚动卡住，没什么好的解决方法 -->
          <img :key="index" v-else-if="content.type === CONTENT_PART_TYPE_IMAGE"
            class="emoji yt-formatted-string style-scope yt-live-chat-text-message-renderer"
            :src="content.url" :alt="content.text" :shared-tooltip-text="content.text" :id="\`emoji-\${content.text}\`"
            :width="content.width" :height="content.height"
            :class="{ 'blc-large-emoji': content.height >= 100 }"
          >
        </template>
        <el-badge :value="repeated" :max="99" v-if="repeated > 1" class="style-scope yt-live-chat-text-message-renderer"
          :style="{ '--repeated-mark-color': repeatedMarkColor }"
        ></el-badge>
      </span>
    </div>
  </yt-live-chat-text-message-renderer>
    `,
    name: 'TextMessage',
    components: {
      ImgShadow,
      AuthorChip
    },
    props: {
      avatarUrl: String,
      time: Date,
      authorName: String,
      authorType: Number,
      contentParts: Array,
      privilegeType: Number,
      repeated: Number
    },
    data() {
      return {
        CONTENT_PART_TYPE_TEXT: constants.CONTENT_PART_TYPE_TEXT,
        CONTENT_PART_TYPE_IMAGE: constants.CONTENT_PART_TYPE_IMAGE
      }
    },
    computed: {
      timeText() {
        return constants.getTimeTextHourMin(this.time)
      },
      authorTypeText() {
        return constants.AUTHOR_TYPE_TO_TEXT[this.authorType]
      },
      repeatedMarkColor() {
        let color
        if (this.repeated <= 2) {
          color = REPEATED_MARK_COLOR_START
        } else if (this.repeated >= 10) {
          color = REPEATED_MARK_COLOR_END
        } else {
          color = [0, 0, 0]
          let t = (this.repeated - 2) / (10 - 2)
          for (let i = 0; i < 3; i++) {
            color[i] = REPEATED_MARK_COLOR_START[i] + ((REPEATED_MARK_COLOR_END[i] - REPEATED_MARK_COLOR_START[i]) * t)
          }
        }
        return `hsl(${color[0]}, ${color[1]}%, ${color[2]}%)`
      }
    }
  }

  return exports
}))
