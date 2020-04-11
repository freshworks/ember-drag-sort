// ----- Ember modules -----
import {inject as service} from '@ember/service'
import {not} from '@ember/object/computed'
import {computed} from '@ember/object'

// ----- Own modules -----
import DragSortList from './drag-sort-list'
import layout from '../templates/components/drag-sort-occlusion-list'
import defaultOcclusionOptions from '../constants/occlusion-options'

export default DragSortList.extend(defaultOcclusionOptions, {

  // ----- Arguments -----
  staticHeight      : false,
  lazyRenderEnabled : true,
  itemsThreshold    : undefined,

  // ----- Services -----
  dragSort : service(),

  // ----- Overridden properties -----
  layout,
  classNameBindings : [
    'isLazyRenderActive:-isLazyRenderActive',
  ],

  // ----- Aliases -----
  renderAll : not('isLazyRenderActive'),

  // ----- Computed properties -----
  isLazyRenderActive : computed('lazyRenderEnabled', 'itemsThreshold', 'isVertical', 'items.length', function () {
    let {
      lazyRenderEnabled,
      itemsThreshold,
      isVertical,
      'items.length': itemCount,
    } = this.getProperties('lazyRenderEnabled', 'itemsThreshold', 'isVertical', 'items.length')

    itemsThreshold = parseInt(itemsThreshold)

    return isNaN(itemsThreshold)
      ? lazyRenderEnabled && isVertical
      : lazyRenderEnabled && isVertical && itemCount > itemsThreshold
  }).readOnly(),

  // ----- LifeCycle methods -----
  didInsertElement () {
    const { elementId, registerApi } = this.getProperties('elementId', 'registerApi')
    if (registerApi) {
      registerApi({
        elementId,
        scrollToBottom : this.scrollToBottom.bind(this),
      })
    }
  },

  // ----- Expose Public API -----
  scrollToBottom () {
    const element     = this.get('element')
    element.scrollTop = element.scrollHeight
  },
})
