(function(root, factory) {
  factory(root.blcsdk, root.chatRendererConstants, root.chatRenderer.default)
}(this,
/**
 * @import * as blcsdk from './vendor/blcsdk'
 * @import * as constants from './ChatRenderer/constants'
 * @import * as ChatRenderer from './ChatRenderer'
 * @param {typeof blcsdk} blcsdk
 * @param {typeof constants} constants
 * @param {typeof ChatRenderer.default} ChatRenderer
 */
function(blcsdk, constants, ChatRenderer) {
  // true 生成消息；false 不生成消息。不生成消息时需要修改下面的测试消息，否则前面的消息会被滚动到上面看不到
  const IS_GENERATE_MSG = true
  // true 浅色背景；false 深色背景
  const IS_BG_LIGHT = true

  // 默认头像
  const DEFAULT_AVATAR_URL = '//static.hdslb.com/images/member/noface.gif'

  // 测试消息
  const MSG_GENERATORS = [
    // 
    // 文本
    // 

    () => /** @type {typeof blcsdk.TextMsg} */ ({
      ...getTextCommon(),
      authorName: '田所浩二',
      contentParts: [
        {type: blcsdk.ContentPartType.TEXT, text: '让我看看'},
      ],
    }),
    () => /** @type {typeof blcsdk.TextMsg} */ ({
      ...getTextCommon(),
      authorName: '哈基米',
      contentParts: [
        {
          type: blcsdk.ContentPartType.IMAGE,
          text: '[dog]',
          url: 'https://i0.hdslb.com/bfs/live/4428c84e694fbf4e0ef6c06e958d9352c3582740.png',
          width: 60,
          height: 60,
        },
        {type: blcsdk.ContentPartType.TEXT, text: '文本'},
        {
          type: blcsdk.ContentPartType.IMAGE,
          text: '[比心]',
          url: 'http://i0.hdslb.com/bfs/live/4e029593562283f00d39b99e0557878c4199c71d.png',
          width: 60,
          height: 60,
        },
        {type: blcsdk.ContentPartType.TEXT, text: '表情'},
        {
          type: blcsdk.ContentPartType.IMAGE,
          text: '[喝彩]',
          url: 'http://i0.hdslb.com/bfs/live/b51824125d09923a4ca064f0c0b49fc97d3fab79.png@65w.webp',
          width: 60,
          height: 60,
        },
      ],
    }),
    () => /** @type {typeof blcsdk.TextMsg} */ ({
      ...getTextCommon(),
      authorName: 'xfgryujk',
      contentParts: [
        {
          type: blcsdk.ContentPartType.IMAGE,
          text: '[小黄豆说_猫猫流泪]',
          url: 'https://i0.hdslb.com/bfs/garb/c98c5fe9866c6d5926b8024e9ab263be662cb53a.png',
          width: 162,
          height: 162,
        },
      ],
    }),
    () => /** @type {typeof blcsdk.TextMsg} */ ({
      ...getTextCommon(),
      authorName: '小岛秀夫',
      authorType: blcsdk.AuthorType.MEMBER,
      contentParts: [
        {type: blcsdk.ContentPartType.TEXT, text: '想吃广东菜✋😭✋'},
      ],
      privilegeType: blcsdk.GuardLevel.LV1,
    }),
    () => /** @type {typeof blcsdk.TextMsg} */ ({
      ...getTextCommon(),
      authorName: 'Dante',
      authorType: blcsdk.AuthorType.ADMIN,
      contentParts: [
        {type: blcsdk.ContentPartType.TEXT, text: 'Hey Vergil, your portal opening days are over. Give me the Yamato'},
      ],
      privilegeType: blcsdk.GuardLevel.LV1,
    }),
    () => /** @type {typeof blcsdk.TextMsg} */ ({
      ...getTextCommon(),
      authorName: '長崎そよ',
      authorType: blcsdk.AuthorType.OWNER,
      contentParts: [
        {type: blcsdk.ContentPartType.TEXT, text: 'なんで春日影やったの！？'},
      ],
    }),
    () => /** @type {typeof blcsdk.TextMsg} */ ({
      ...getTextCommon(),
      authorName: '周冠宇',
      authorType: blcsdk.AuthorType.MEMBER,
      contentParts: [
        {type: blcsdk.ContentPartType.TEXT, text: 'DU↗DU→DU↗DU↓ Max Verstappen'},
      ],
      privilegeType: blcsdk.GuardLevel.LV2,
    }),
    () => /** @type {typeof blcsdk.TextMsg} */ ({
      ...getTextCommon(),
      authorName: '空條承太郎',
      authorType: blcsdk.AuthorType.MEMBER,
      contentParts: [
        {type: blcsdk.ContentPartType.TEXT, text: '我衰咗三年，我等緊個機會，爭番口氣'},
      ],
      privilegeType: blcsdk.GuardLevel.LV3,
    }),

    //
    // 礼物
    //

    () => /** @type {typeof blcsdk.GiftMsg} */ ({
      ...getGiftCommon(),
      authorName: '博丽灵梦',
      price: 0,
      giftName: '粉丝团灯牌',
      num: 10,
      totalFreeCoin: 2000,
    }),
    () => /** @type {typeof blcsdk.GiftMsg} */ ({
      ...getGiftCommon(),
      authorName: '小岛秀夫',
      price: 9.9,
      giftName: '可爱捏',
    }),

    //
    // 醒目留言
    //

    () => /** @type {typeof blcsdk.SuperChatMsg} */ ({
      ...getSuperChatCommon(),
      authorName: '成龙',
      price: 30,
      content: '阿祖，投降吧，外面全是警察',
    }),
    () => /** @type {typeof blcsdk.SuperChatMsg} */ ({
      ...getSuperChatCommon(),
      authorName: '杨戬',
      price: 100,
      content: '你这猴子，真令我欢喜',
    }),
    () => /** @type {typeof blcsdk.SuperChatMsg} */ ({
      ...getSuperChatCommon(),
      authorName: '御剑侍伶',
      price: 1000,
      content: '因为你的缘故，我的心中萌生了多余的情感',
    }),

    //
    // 上舰
    //

    () => /** @type {typeof blcsdk.MemberMsg} */ ({
      ...getMemberCommon(),
      authorName: 'ディオ・ブランドー',
      privilegeType: blcsdk.GuardLevel.LV1,
    }),
    () => /** @type {typeof blcsdk.MemberMsg} */ ({
      ...getMemberCommon(),
      authorName: 'Arthur Morgan',
      privilegeType: blcsdk.GuardLevel.LV2,
    }),
    () => /** @type {typeof blcsdk.MemberMsg} */ ({
      ...getMemberCommon(),
      authorName: '孙悟空',
      privilegeType: blcsdk.GuardLevel.LV3,
    }),
  ]

  let nextId_ = 1
  function nextId() {
    return (nextId_++).toString()
  }

  function getTextCommon() {
    return {
      id: nextId(),
      type: constants.MESSAGE_TYPE_TEXT,
      avatarUrl: DEFAULT_AVATAR_URL,
      time: new Date(),
      authorType: blcsdk.AuthorType.NORMAL,
      content: '',
      privilegeType: blcsdk.GuardLevel.NONE,
      translation: '',
      uid: '',
      medalLevel: 0,
      medalName: '',
      isMirror: false,
    }
  }

  function getGiftCommon() {
    return {
      id: nextId(),
      type: constants.MESSAGE_TYPE_GIFT,
      avatarUrl: DEFAULT_AVATAR_URL,
      time: new Date(),
      authorNamePronunciation: '',
      num: 1,
      totalFreeCoin: 0,
      giftId: 0,
      giftIconUrl: '',
      uid: '',
      privilegeType: blcsdk.GuardLevel.NONE,
      medalLevel: 0,
      medalName: '',
    }
  }

  function getSuperChatCommon() {
    return {
      id: nextId(),
      type: constants.MESSAGE_TYPE_SUPER_CHAT,
      avatarUrl: DEFAULT_AVATAR_URL,
      time: new Date(),
      authorNamePronunciation: '',
      translation: '',
      uid: '',
      privilegeType: blcsdk.GuardLevel.NONE,
      medalLevel: 0,
      medalName: '',
    }
  }

  function getMemberCommon() {
    return {
      id: nextId(),
      type: constants.MESSAGE_TYPE_MEMBER,
      avatarUrl: DEFAULT_AVATAR_URL,
      time: new Date(),
      authorNamePronunciation: '',
      privilegeType: blcsdk.GuardLevel.LV1,
      num: 1,
      unit: '月',
      price: 198,
      uid: '',
      medalLevel: 0,
      medalName: '',
    }
  }

  if (IS_BG_LIGHT) {
    document.querySelector('#app').classList.add('light')
  }

  new Vue({
    components: {
      ChatRenderer,
    },
    data() {
      return {
        config: {
          // 最多显示消息数
          maxNumber: 60,
          // 显示礼物名
          showGiftName: true,
          // 合并礼物
          mergeGift: true,
        },
        generateMsgTimerId: null,
        nextMsgGeneratorIdx: 0,
      }
    },
    mounted() {
      if (MSG_GENERATORS.length <= 0) {
        return
      }

      if (IS_GENERATE_MSG) {
        this.generateMsgTimerId = window.setInterval(this.generateMsg, 700)
      } else {
        let msgs = MSG_GENERATORS.map(generateMsg => generateMsg())
        this.$refs.renderer.handleMessageGroup(msgs)
      }
    },
    beforeDestroy() {
      if (this.generateMsgTimerId) {
        window.clearInterval(this.generateMsgTimerId)
        this.generateMsgTimerId = null
      }
    },
    methods: {
      generateMsg() {
        let idx = this.nextMsgGeneratorIdx
        this.nextMsgGeneratorIdx = (this.nextMsgGeneratorIdx + 1) % MSG_GENERATORS.length

        let msg = MSG_GENERATORS[idx]()
        this.$refs.renderer.handleMessageGroup([msg])
      }
    },
  }).$mount('#app')
}))
