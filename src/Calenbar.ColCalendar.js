import Snap from 'imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js'
import Fragment from './Calenbar.Fragment.js'
import Util from './Util.js'

export default class ColCalendar extends Fragment {
  constructor(outerContainer, config) {
    super(outerContainer, config)
    this._setUp()
    this._render()
  }

  _setUp() {
    const style = this._containerDom.style
    const config = this._config
    const scrollBarWidth = Util.getScrollbarWidth()
    style.overflow = 'hidden'
    style.width =
      this._outerContainer.clientWidth -
      config.row_head.width -
      scrollBarWidth +
      'px'
    style.gridArea = '1 / 2 / 2 / 2'

    this._snapElement.attr({
      width: config.grid.width * config.date_range + 'px',
      height: config.row_head.width + 'px'
    })
  }

  _render() {
    const config = this._config
    const svg = this._snapElement
    // create pattern for date grid
    const path = 'M %w 0 L 0 0 0 %h'
      .replace('%w', config.grid.width)
      .replace('%h', config.col_head.height)
    const p = svg
      .path(path)
      .attr({
        fill: 'none',
        stroke: '#ccc',
        strokeWidth: 3
      })
      .pattern(0, 0, config.grid.width, config.col_head.height / 2)

    // draw outer frame
    const dateFrame = svg.rect(
      0,
      config.col_head.height / 2,
      svg.attr('width'),
      config.col_head.height / 2
    )
    dateFrame.attr({
      fill: p
    })
    svg.rect(0, 0, svg.attr('width'), config.col_head.height).attr({
      fill: 'none',
      stroke: '#ccc',
      strokeWidth: 3
    })

    // draw daily labels, monthly separator and labels
    const y = config.col_head.height - 12
    const date = new Date(config.center_date.getTime())
    date.setDate(date.getDate() - config.date_range / 2)
    for (let i = 0; i < config.date_range; i++) {
      const x = config.grid.width * i
      const d = date.getDate()
      // daily label
      svg.text(x + config.grid.width / 2, y, d)
      // monthly separator
      if (d === 1) {
        svg.line(x, 0, x, config.col_head.height).attr({
          stroke: '#ccc',
          strokeWidth: 3
        })
      }
      // monthly label
      if (i === 0 || d === 1) {
        svg.text(
          x + config.grid.width / 2,
          y - config.col_head.height / 2,
          date.getMonth() + 1
        )
      }
      date.setDate(d + 1)
    }
  }
}
