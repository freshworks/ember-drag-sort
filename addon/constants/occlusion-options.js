export default {
  key : '@identity',
  
  // –––––––––––––– Required Settings
  /**
   * Estimated height of an item to be rendered. Use best guess as this will be used to determine how many items
   * are displayed virtually, before and after the vertical-collection viewport.
   *
   * @property estimateHeight
   * @type Number
   * @required
   */
  estimateHeight : 50,

  // –––––––––––––– Optional Settings
  /**
   * Indicates if the occluded items' heights will change or not.
   * If true, the vertical-collection will assume that items' heights are always equal to estimateHeight;
   * this is more performant, but less flexible.
   *
   * @property staticHeight
   * @type Boolean
   */
  staticHeight : false,

  /**
   * Indicates whether or not list items in the Radar should be reused on update of virtual components (e.g. scroll).
   * This yields performance benefits because it is not necessary to repopulate the component pool of the radar.
   * Set to false when recycling a component instance has undesirable ramifications including:
   *  - When using `unbound` in a component or sub-component
   *  - When using init for instance state that differs between instances of a component or sub-component
   *      (can move to didInitAttrs to fix this)
   *  - When templates for individual items vary widely or are based on conditionals that are likely to change
   *      (i.e. would defeat any benefits of DOM recycling anyway)
   *
   * @property shouldRecycle
   * @type Boolean
   */
  shouldRecycle : true,

  // –––––––––––––– Performance Tuning
  /**
   * The amount of extra items to keep visible on either side of the viewport -- must be greater than 0.
   * Increasing this value is useful when doing infinite scrolling and loading data from a remote service,
   * with the desire to allow records to show as the user scrolls and the backend API takes time to respond.
   *
   * @property bufferSize
   * @type Number
   * @default 2
   */
  bufferSize : 2,

  // –––––––––––––– Initial Scroll State
  /**
   * If set, upon initialization the scroll
   * position will be set such that the item
   * with the provided id is at the top left
   * on screen.
   *
   * If the item cannot be found, scrollTop
   * is set to 0.
   *
   * @property idForFirstItem
   */
  idForFirstItem : null,

  /**
   * If set, if scrollPosition is empty
   * at initialization, the component will
   * render starting at the bottom.
   *
   * @property renderFromLast
   * @type Boolean
   * @default false
   */
  renderFromLast : false,

  /**
   * The tag name used in DOM elements before and after the rendered list. By default, it is set to
   * 'options-content' to avoid any confusion with user's CSS settings. However, it could be
   * overriden to provide custom behavior (for example, in table user wants to set it to 'tr' to
   * comply with table semantics).
   */
  occlusionTagName : 'options-content',

  // –––––––––––––– actions
  // Each action has the signature (item, index) => {}
  firstReached        : null,
  lastReached         : null,
  firstVisibleChanged : null,
  lastVisibleChanged  : null,
}
