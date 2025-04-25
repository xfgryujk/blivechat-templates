(function(root, factory) {
  root.chatRendererMembershipItem = factory(
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

  exports.default = {
    template: `
  <yt-live-chat-membership-item-renderer class="style-scope yt-live-chat-item-list-renderer" show-only-header
    :blc-guard-level="privilegeType"
  >
    <div id="card" class="style-scope yt-live-chat-membership-item-renderer">
      <div id="header" class="style-scope yt-live-chat-membership-item-renderer">
        <img-shadow id="author-photo" height="40" width="40" class="style-scope yt-live-chat-membership-item-renderer"
          :imgUrl="avatarUrl"
        ></img-shadow>
        <div id="header-content" class="style-scope yt-live-chat-membership-item-renderer">
          <div id="header-content-primary-column" class="style-scope yt-live-chat-membership-item-renderer">
            <div id="header-content-inner-column" class="style-scope yt-live-chat-membership-item-renderer">
              <author-chip class="style-scope yt-live-chat-membership-item-renderer"
                isInMemberMessage :authorName="authorName" :authorType="0" :privilegeType="privilegeType"
              ></author-chip>
            </div>
            <div id="header-subtext" class="style-scope yt-live-chat-membership-item-renderer">{{ title }}</div>
          </div>
          <div id="timestamp" class="style-scope yt-live-chat-membership-item-renderer">{{ timeText }}</div>
        </div>
      </div>
    </div>
  </yt-live-chat-membership-item-renderer>
    `,
    name: 'MembershipItem',
    components: {
      ImgShadow,
      AuthorChip
    },
    props: {
      avatarUrl: String,
      authorName: String,
      privilegeType: Number,
      title: String,
      time: Date
    },
    computed: {
      timeText() {
        return constants.getTimeTextHourMin(this.time)
      }
    }
  }

  return exports
}))
