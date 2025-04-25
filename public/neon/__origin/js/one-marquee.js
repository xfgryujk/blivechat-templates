window.OneMarquee = function(_options) {
  const options = Object.assign({
    duration: 7,
    delay: 200,
    easeing: (t, b, c, d) => {
      return c * t / d + b;
    }
  }, _options || {})
  const getActualWidth = (elm) => {
    const computedStyle = window.getComputedStyle(elm, null)
    return elm.clientWidth - (parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight))
  }
  return {
    data() {
      const duration = OneSDK.getStyleVariable('--lcv-marquee-duration', options.duration, parseFloat)
      const delay = OneSDK.getStyleVariable('--lcv-marquee-delay', options.delay, parseFloat)
      return {
        x: 0,
        duration,
        delay,
        paused: true
      }
    },
    mounted() {
      const {container, content} = this.$refs
      const second = this.duration
      const delay = this.delay
      const duration = second * 1000
      const b = performance.now() + delay
      if (getActualWidth(container) + 1 < content.offsetWidth) {
        const scrollX = container.scrollWidth - container.offsetWidth
        const tick = () => {
          const t = performance.now() - b
          if (t >= 0) {
            const x = options.easeing(Math.min(t, duration), 0, -scrollX, duration)
            content.style.transform = `translateX(${x}px)`
            if (t >= duration) {
              this.$emit('end', this.id)
              return
            }
          }
          setTimeout(tick)
        }
        tick()
      }
    },
    template: `
      <div class="marquee-container" ref="container">
        <div class="marquee-content" ref="content"><slot></slot></div>
      </div>
    `
  }
}