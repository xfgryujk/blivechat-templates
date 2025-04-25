(function(root, factory) {
  root.chatRendererConstants = factory(root.blcsdk)
}(this,
/**
 * @import * as blcsdk from '../vendor/blcsdk'
 * @param {typeof blcsdk} blcsdk
 */
function(blcsdk) {
  const exports = {}

  exports.AUTHOR_TYPE_NORMAL = blcsdk.AuthorType.NORMAL
  exports.AUTHOR_TYPE_MEMBER = blcsdk.AuthorType.MEMBER
  exports.AUTHOR_TYPE_ADMIN = blcsdk.AuthorType.ADMIN
  exports.AUTHOR_TYPE_OWNER = blcsdk.AuthorType.OWNER

  const AUTHOR_TYPE_TO_TEXT = []
  AUTHOR_TYPE_TO_TEXT[blcsdk.AuthorType.NORMAL] = ''
  AUTHOR_TYPE_TO_TEXT[blcsdk.AuthorType.MEMBER] = 'member' // 舰队
  AUTHOR_TYPE_TO_TEXT[blcsdk.AuthorType.ADMIN] = 'moderator' // 房管
  AUTHOR_TYPE_TO_TEXT[blcsdk.AuthorType.OWNER] = 'owner' // 主播
  exports.AUTHOR_TYPE_TO_TEXT = AUTHOR_TYPE_TO_TEXT

  const GUARD_LEVEL_TO_TEXT_KEY = []
  GUARD_LEVEL_TO_TEXT_KEY[blcsdk.GuardLevel.NONE] = ''
  GUARD_LEVEL_TO_TEXT_KEY[blcsdk.GuardLevel.LV3] = '总督'
  GUARD_LEVEL_TO_TEXT_KEY[blcsdk.GuardLevel.LV2] = '提督'
  GUARD_LEVEL_TO_TEXT_KEY[blcsdk.GuardLevel.LV1] = '舰长'

  exports.getShowGuardLevelText = function(guardLevel) {
    return GUARD_LEVEL_TO_TEXT_KEY[guardLevel] || ''
  }

  exports.MESSAGE_TYPE_TEXT = blcsdk.MsgType.TEXT
  exports.MESSAGE_TYPE_GIFT = blcsdk.MsgType.GIFT
  exports.MESSAGE_TYPE_MEMBER = blcsdk.MsgType.MEMBER
  exports.MESSAGE_TYPE_SUPER_CHAT = blcsdk.MsgType.SUPER_CHAT
  exports.MESSAGE_TYPE_DEL = 30
  exports.MESSAGE_TYPE_UPDATE = 31

  exports.CONTENT_PART_TYPE_TEXT = blcsdk.ContentPartType.TEXT
  exports.CONTENT_PART_TYPE_IMAGE = blcsdk.ContentPartType.IMAGE

  // 美元 -> 人民币 汇率
  const EXCHANGE_RATE = 7
  const PRICE_CONFIGS = [
    // 0 淡蓝
    {
      price: 0,
      colors: {
        contentBg: 'rgba(153, 236, 255, 1)',
        headerBg: 'rgba(153, 236, 255, 1)',
        header: 'rgba(0,0,0,1)',
        authorName: 'rgba(0,0,0,0.701961)',
        time: 'rgba(0,0,0,0.501961)',
        content: 'rgba(0,0,0,1)'
      },
      pinTime: 0,
      priceLevel: 0,
    },
    // ¥0.01 蓝
    {
      price: 0.01,
      colors: {
        contentBg: 'rgba(30,136,229,1)',
        headerBg: 'rgba(21,101,192,1)',
        header: 'rgba(255,255,255,1)',
        authorName: 'rgba(255,255,255,0.701961)',
        time: 'rgba(255,255,255,0.501961)',
        content: 'rgba(255,255,255,1)'
      },
      pinTime: 0,
      priceLevel: 1,
    },
    // $2 浅蓝
    {
      price: 2 * EXCHANGE_RATE,
      colors: {
        contentBg: 'rgba(0,229,255,1)',
        headerBg: 'rgba(0,184,212,1)',
        header: 'rgba(0,0,0,1)',
        authorName: 'rgba(0,0,0,0.701961)',
        time: 'rgba(0,0,0,0.501961)',
        content: 'rgba(0,0,0,1)'
      },
      pinTime: 0,
      priceLevel: 2,
    },
    // $5 绿
    {
      price: 5 * EXCHANGE_RATE,
      colors: {
        contentBg: 'rgba(29,233,182,1)',
        headerBg: 'rgba(0,191,165,1)',
        header: 'rgba(0,0,0,1)',
        authorName: 'rgba(0,0,0,0.541176)',
        time: 'rgba(0,0,0,0.501961)',
        content: 'rgba(0,0,0,1)'
      },
      pinTime: 2,
      priceLevel: 3,
    },
    // $10 黄
    {
      price: 10 * EXCHANGE_RATE,
      colors: {
        contentBg: 'rgba(255,202,40,1)',
        headerBg: 'rgba(255,179,0,1)',
        header: 'rgba(0,0,0,0.87451)',
        authorName: 'rgba(0,0,0,0.541176)',
        time: 'rgba(0,0,0,0.501961)',
        content: 'rgba(0,0,0,0.87451)'
      },
      pinTime: 5,
      priceLevel: 4,
    },
    // $20 橙
    {
      price: 20 * EXCHANGE_RATE,
      colors: {
        contentBg: 'rgba(245,124,0,1)',
        headerBg: 'rgba(230,81,0,1)',
        header: 'rgba(255,255,255,0.87451)',
        authorName: 'rgba(255,255,255,0.701961)',
        time: 'rgba(255,255,255,0.501961)',
        content: 'rgba(255,255,255,0.87451)'
      },
      pinTime: 10,
      priceLevel: 5,
    },
    // $50 品红
    {
      price: 50 * EXCHANGE_RATE,
      colors: {
        contentBg: 'rgba(233,30,99,1)',
        headerBg: 'rgba(194,24,91,1)',
        header: 'rgba(255,255,255,1)',
        authorName: 'rgba(255,255,255,0.701961)',
        time: 'rgba(255,255,255,0.501961)',
        content: 'rgba(255,255,255,1)'
      },
      pinTime: 30,
      priceLevel: 6,
    },
    // $100 红
    {
      price: 100 * EXCHANGE_RATE,
      colors: {
        contentBg: 'rgba(230,33,23,1)',
        headerBg: 'rgba(208,0,0,1)',
        header: 'rgba(255,255,255,1)',
        authorName: 'rgba(255,255,255,0.701961)',
        time: 'rgba(255,255,255,0.501961)',
        content: 'rgba(255,255,255,1)'
      },
      pinTime: 60,
      priceLevel: 7,
    },
  ]

  exports.getPriceConfig = function(price) {
    let i = 0
    // 根据先验知识，从小找到大通常更快结束
    for (; i < PRICE_CONFIGS.length - 1; i++) {
      let nextConfig = PRICE_CONFIGS[i + 1]
      if (price < nextConfig.price) {
        return PRICE_CONFIGS[i]
      }
    }
    return PRICE_CONFIGS[i]
  }

  exports.getShowContent = function(message) {
    if (message.translation) {
      return `${message.content}（${message.translation}）`
    }
    return message.content
  }

  exports.getShowContentParts = function(message) {
    let contentParts = [...message.contentParts]
    if (message.translation) {
      contentParts.push({
        type: blcsdk.ContentPartType.TEXT,
        text: `（${message.translation}）`
      })
    }
    return contentParts
  }

  exports.getGiftShowContent = function(message, showGiftName) {
    if (!showGiftName) {
      return ''
    }
    return `赠送 ${message.giftName}x${message.num}`
  }

  exports.getGiftShowNameAndNum = function(message) {
    return `${message.giftName}x${message.num}`
  }

  exports.getShowAuthorName = function(message) {
    if (message.authorNamePronunciation && message.authorNamePronunciation !== message.authorName) {
      return `${message.authorName}(${message.authorNamePronunciation})`
    }
    return message.authorName
  }

  exports.getTimeTextHourMin = function(date) {
    let hour = date.getHours()
    let min = `00${date.getMinutes()}`.slice(-2)
    return `${hour}:${min}`
  }

  exports.formatCurrency = function(price) {
    return new Intl.NumberFormat('zh-CN', {
      minimumFractionDigits: price < 100 ? 2 : 0
    }).format(price)
  }

  return exports
}))
