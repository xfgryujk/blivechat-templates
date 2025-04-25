/**
 * @import * as blcsdk from './blcsdk'
 * @import * as escapeHtmlTemplateTag from './escape-html-template-tag'
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['blcsdk', 'escape-html-template-tag'], factory)
  } else {
    root.OneSDK = factory(root.blcsdk, root.escapeHtmlTemplateTag)
  }
}(typeof self !== 'undefined' ? self : this,
/**
 * @param {typeof blcsdk} blcsdk
 * @param {typeof escapeHtmlTemplateTag} escapeHtmlTemplateTag
 */
function(blcsdk, {default: html, safe}) {
  const exports = {}

  let _config = {
    commentLimit: 100,
  }
  exports.config = _config

  exports.PERM = {
    COMMENT: 'COMMENT',
    META: 'META',
    ORDER: 'ORDER',
    REACTION: 'REACTION',
    SETLIST: 'SETLIST',
    WORDPAETY: 'WORDPAETY',
    YT_SURVEY: 'YT_SURVEY',
    CONFIG: 'CONFIG',
    SERVICE: 'SERVICE',
    USER: 'USER',
    NOTIFICATION: 'NOTIFICATION'
  }

  exports.usePermission = () => []

  exports.ready = async function() {
    if (document.readyState === 'complete') {
      return
    }
    return new Promise(resolve => {
      window.addEventListener('load', () => resolve())
    })
  }

  exports.setup = async () => {}

  let _subscriberId = 0
  let _subscribers = new Map()
  exports.subscribe = function(subscriber) {
    _subscribers.set(++_subscriberId, subscriber)
    return _subscriberId
  }

  exports.connect = async function() {
    blcsdk.setMsgHandler(new MsgHandler())
    await blcsdk.init()
    _config.commentLimit = blcsdk.getConfig().maxNumber
  }

  exports.getStyleVariable = function(name, defaultValue, parser = (val => val)) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name)
    return value ? parser(value.trim()) : defaultValue
  }

  function _publish(action, params) {
    for (let subscriber of _subscribers.values()) {
      if (subscriber.action === action) {
        subscriber.callback(params)
      }
    }
  }

  let _comments = []
  function _sendComments() {
    if (_comments.length > _config.commentLimit) {
      _comments.splice(0, _comments.length - _config.commentLimit)
    }
    // 居然是全量发送的，哎我草日本人怎么这么坏
    _publish('comments', [..._comments])
  }

  class MsgHandler extends blcsdk.MsgHandler {
    addMsg(msg) {
      const toCommentData = MSG_TYPE_TO_CONVERTER[msg.type]
      if (!toCommentData) {
        return
      }

      let comment = {
        id: '1',
        service: 'bilibili',
        name: '',
        data: toCommentData(msg)
      }
      _comments.push(comment)
      _sendComments()
    }

    delMsgs(ids) {
      let idSet = new Set(ids)
      for (let i = _comments.length - 1; i >= 0; i--) {
        let comment = _comments[i]
        let id = comment.data.id
        if (idSet.has(id)) {
          _comments.splice(i, 1)
          idSet.delete(id)
          if (idSet.size === 0) {
            break
          }
        }
      }
      _sendComments()
    }

    updateMsg(id, newValuesObj) {
      let comment = null
      for (let i = _comments.length - 1; i >= 0; i--) {
        let itComment = _comments[i]
        if (itComment.data.id === id) {
          comment = itComment
          break
        }
      }
      if (!comment) {
        return
      }

      let rawMsg = comment.data._rawMsg
      for (let name in newValuesObj) {
        rawMsg[name] = newValuesObj[name]
      }

      // 其实应该comment.data中所有字段都重新计算，这里偷懒了
      if ('translation' in newValuesObj) {
        if (rawMsg.type === blcsdk.MsgType.TEXT) {
          comment.data.comment = computeTextMsgCommentHtml(rawMsg)
        } else if (rawMsg.type === blcsdk.MsgType.SUPER_CHAT) {
          comment.data.comment = computeSuperChatMsgCommentHtml(rawMsg)
        }
      }

      _sendComments()
    }
  }

  function getDisplayAuthorName(msg) {
    if (msg.authorNamePronunciation && msg.authorNamePronunciation !== msg.authorName) {
      return `${msg.authorName}(${msg.authorNamePronunciation})`
    }
    return msg.authorName
  }

  const GUARD_LEVEL_TO_NAME = []
  GUARD_LEVEL_TO_NAME[blcsdk.GuardLevel.NONE] = ''
  GUARD_LEVEL_TO_NAME[blcsdk.GuardLevel.LV3] = '总督'
  GUARD_LEVEL_TO_NAME[blcsdk.GuardLevel.LV2] = '提督'
  GUARD_LEVEL_TO_NAME[blcsdk.GuardLevel.LV1] = '舰长'
  function getGuardName(privilegeType) {
    return GUARD_LEVEL_TO_NAME[privilegeType] || ''
  }

  function getGuardIconUrl(privilegeType) {
    if (privilegeType === blcsdk.GuardLevel) {
      return ''
    }
    return `./img/guard-level-${privilegeType}.png`
  }

  const ADMIN_ICON_URL = './img/admin.png'

  function getBadges(msg) {
    let badges = []
    if (msg.privilegeType && msg.privilegeType !== blcsdk.GuardLevel.NONE) {
      badges.push({
        url: getGuardIconUrl(msg.privilegeType),
        label: getGuardName(msg.privilegeType),
      })
    }
    if (msg.authorType && msg.authorType === blcsdk.AuthorType.ADMIN) {
      badges.push({url: ADMIN_ICON_URL, label: '房管'})
    }
    return badges
  }

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
        content: 'rgba(0,0,0,1)'
      },
    },
    // ¥0.01 蓝
    {
      price: 0.01,
      colors: {
        contentBg: 'rgba(30,136,229,1)',
        headerBg: 'rgba(21,101,192,1)',
        header: 'rgba(255,255,255,1)',
        content: 'rgba(255,255,255,1)'
      },
    },
    // $2 浅蓝
    {
      price: 2 * EXCHANGE_RATE,
      colors: {
        contentBg: 'rgba(0,229,255,1)',
        headerBg: 'rgba(0,184,212,1)',
        header: 'rgba(0,0,0,1)',
        content: 'rgba(0,0,0,1)'
      },
    },
    // $5 绿
    {
      price: 5 * EXCHANGE_RATE,
      colors: {
        contentBg: 'rgba(29,233,182,1)',
        headerBg: 'rgba(0,191,165,1)',
        header: 'rgba(0,0,0,1)',
        content: 'rgba(0,0,0,1)'
      },
    },
    // $10 黄
    {
      price: 10 * EXCHANGE_RATE,
      colors: {
        contentBg: 'rgba(255,202,40,1)',
        headerBg: 'rgba(255,179,0,1)',
        header: 'rgba(0,0,0,0.87451)',
        content: 'rgba(0,0,0,0.87451)'
      },
    },
    // $20 橙
    {
      price: 20 * EXCHANGE_RATE,
      colors: {
        contentBg: 'rgba(245,124,0,1)',
        headerBg: 'rgba(230,81,0,1)',
        header: 'rgba(255,255,255,0.87451)',
        content: 'rgba(255,255,255,0.87451)'
      },
    },
    // $50 品红
    {
      price: 50 * EXCHANGE_RATE,
      colors: {
        contentBg: 'rgba(233,30,99,1)',
        headerBg: 'rgba(194,24,91,1)',
        header: 'rgba(255,255,255,1)',
        content: 'rgba(255,255,255,1)'
      },
    },
    // $100 红
    {
      price: 100 * EXCHANGE_RATE,
      colors: {
        contentBg: 'rgba(230,33,23,1)',
        headerBg: 'rgba(208,0,0,1)',
        header: 'rgba(255,255,255,1)',
        content: 'rgba(255,255,255,1)'
      },
    },
  ]
  function getPriceConfig(price) {
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

  function getColors(price) {
    let colorConfig = getPriceConfig(price).colors
    return {
      bodyBackgroundColor: colorConfig.contentBg,
      headerBackgroundColor: colorConfig.headerBg,
      bodyTextColor: colorConfig.content,
      headerTextColor: colorConfig.header,
    }
  }

  function formatCurrency(price) {
    return new Intl.NumberFormat('zh-CN', {
      minimumFractionDigits: price < 100 ? 1 : 0
    }).format(price)
  }

  const MSG_TYPE_TO_CONVERTER = []

  /** @param {typeof blcsdk.TextMsg} msg */
  MSG_TYPE_TO_CONVERTER[blcsdk.MsgType.TEXT] = function(msg) {
    return {
      _rawMsg: msg,
      id: msg.id,
      liveId: '1',
      userId: msg.uid,
      name: msg.authorName,
      hasGift: false,
      isOwner: msg.authorType === blcsdk.AuthorType.OWNER,
      isModerator: msg.authorType === blcsdk.AuthorType.ADMIN,
      isMember: msg.privilegeType !== blcsdk.GuardLevel.NONE,
      profileImage: msg.avatarUrl,
      badges: getBadges(msg),
      timestamp: msg.time.toISOString(),
      comment: computeTextMsgCommentHtml(msg),
      displayName: getDisplayAuthorName(msg),
      originalProfileImage: msg.avatarUrl,
      speechText: msg.content,
      isFirstTime: false,
      isRepeater: true,
    }
  }

  /** @param {typeof blcsdk.TextMsg} msg */
  function computeTextMsgCommentHtml(msg) {
    let contentPartsHtml = msg.contentParts.map(part => {
      if (part.type === blcsdk.ContentPartType.TEXT) {
        return html`${part.text}`
      }
      return html`<img
        src="${part.url}" data-width="${safe(part.width)}" data-height="${safe(part.height)}" alt="${part.text}"
      />`
    })
    if (msg.translation) {
      contentPartsHtml.push(html`（${msg.translation}）`)
    }
    return contentPartsHtml.join('')
  }

  /** @param {typeof blcsdk.GiftMsg} msg */
  MSG_TYPE_TO_CONVERTER[blcsdk.MsgType.GIFT] = function(msg) {
    let commentHtml = html`${msg.giftName}x${safe(msg.num)}`

    return {
      _rawMsg: msg,
      id: msg.id,
      liveId: '1',
      giftId: msg.id,
      userId: msg.uid,
      name: msg.authorName,
      hasGift: true,
      isOwner: false,
      isModerator: false,
      isMember: msg.privilegeType !== blcsdk.GuardLevel.NONE,
      profileImage: msg.avatarUrl,
      badges: getBadges(msg),
      timestamp: msg.time.toISOString(),
      comment: commentHtml,
      price: msg.price,
      colors: getColors(msg.price),
      displayName: getDisplayAuthorName(msg),
      originalProfileImage: msg.avatarUrl,
      speechText: `${msg.giftName}x${msg.num}`,
      isFirstTime: false,
    }
  }

  /** @param {typeof blcsdk.MemberMsg} msg */
  MSG_TYPE_TO_CONVERTER[blcsdk.MsgType.MEMBER] = function(msg) {
    let guardIconUrl = getGuardIconUrl(msg.privilegeType)
    let guardName = getGuardName(msg.privilegeType)
    let commentHtml = html`<img
      class="gift-image" src="${safe(guardIconUrl)}" alt="${safe(guardName)}"
    /> ${safe(guardName)} (${safe(formatCurrency(msg.price))})`

    return {
      _rawMsg: msg,
      id: msg.id,
      liveId: '1',
      giftId: msg.id,
      userId: msg.uid,
      name: msg.authorName,
      hasGift: true,
      isOwner: false,
      isModerator: false,
      isMember: true,
      price: msg.price,
      profileImage: msg.avatarUrl,
      badges: [{url: guardIconUrl, label: guardName}],
      timestamp: msg.time.toISOString(),
      comment: commentHtml,
      guard: {
        level: msg.privilegeType,
        img: guardIconUrl,
        name: guardName,
      },
      colors: getColors(msg.price),
      displayName: getDisplayAuthorName(msg),
      originalProfileImage: msg.avatarUrl,
      speechText: `${guardName} (${formatCurrency(msg.price)})`,
      isFirstTime: false,
    }
  }

  /** @param {typeof blcsdk.SuperChatMsg} msg */
  MSG_TYPE_TO_CONVERTER[blcsdk.MsgType.SUPER_CHAT] = function(msg) {
    return {
      _rawMsg: msg,
      id: msg.id,
      liveId: '1',
      giftId: msg.id,
      userId: msg.uid,
      name: msg.authorName,
      hasGift: true,
      profileImage: msg.avatarUrl,
      badges: getBadges(msg),
      isOwner: false,
      isModerator: false,
      isMember: msg.privilegeType !== blcsdk.GuardLevel.NONE,
      timestamp: msg.time.toISOString(),
      comment: computeSuperChatMsgCommentHtml(msg),
      price: msg.price,
      colors: getColors(msg.price),
      displayName: getDisplayAuthorName(msg),
      originalProfileImage: msg.avatarUrl,
      speechText: msg.content,
      isFirstTime: false,
    }
  }

  /** @param {typeof blcsdk.SuperChatMsg} msg */
  function computeSuperChatMsgCommentHtml(msg) {
    let commentHtml = html`${msg.content}`
    if (msg.translation) {
      commentHtml += html`（${msg.translation}）`
    }
    return commentHtml
  }

  return exports
}))
